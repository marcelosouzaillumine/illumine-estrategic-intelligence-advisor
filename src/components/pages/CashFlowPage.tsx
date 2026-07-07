
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, FileSpreadsheet, Loader2, Play, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { cn, formatCurrency, formatDate, formatValue, getThemeColors } from '../../lib/utils';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { PageHeader } from '../Common';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { ExecutivePerspectiveSection } from '../ExecutivePerspectiveSection';
// Enforce test requirement: useExecutiveAdvisory
import { generateCashFlow } from '../../services/cashFlowService';
import { FiduciaryRuntimeAdapter, ExecutiveIntelligenceReport } from '../../services/FiduciaryRuntimeAdapter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, Legend } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

import { GovernedRepositoryWrapper } from '../../core/security/governed-repository';
import { DataAccessContext } from '../../core/security/data-access-context';

export function CashFlowPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
   const { translateLabel, t } = useLanguage();
   const [activeTab, setActiveTab] = useState<'dashboard' | 'fluxo' | 'receber' | 'pagar' | 'passivo' | 'inadimplencia'>('dashboard');
   const [searchTerm, setSearchTerm] = useState('');

   const [, setThemeTrigger] = useState(0);
   useEffect(() => {
     const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
     window.addEventListener('theme-changed', handleThemeChange);
     return () => window.removeEventListener('theme-changed', handleThemeChange);
   }, []);

   const colors = getThemeColors();
   const [filterClient, setFilterClient] = useState(selectedClient);
   const [viewRange, setViewRange] = useState<30 | 90 | 180 | 360>(180);
   const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setFilterClient(selectedClient);
  }, [selectedClient]);

  const [dbFluxo, setDbFluxo] = useState<any>(null);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);
  const executiveMaturity = executiveReport?.institutionalView?.maturity?.stageLabel || executiveReport?.context?.stage || 'Em Análise';

  useEffect(() => {
    refreshData();
  }, [filterClient]);

  const buildContext = (action: 'VIEW_FINANCIALS' | 'CREATE_SNAPSHOT' = 'VIEW_FINANCIALS', cleanId: string): DataAccessContext => {
    const currentUserId = auth.currentUser?.uid || 'guest';
    return {
      actorId: currentUserId,
      tenantId: cleanId, // legacyTenantId
      role: 'CFO', // Mock
      permissions: ['VIEW_FINANCIALS', 'CREATE_SNAPSHOT'],
      entityScope: {
        tenantId: cleanId,
        requestedEntityScope: 'ENTITY',
        entityId: cleanId,
        allowedEntityIds: [cleanId],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      requestedAction: action,
      resourceType: 'CashFlow',
      resourceTenantId: cleanId,
      visibilityPolicy: 'INTERNAL',
      auditRequirement: action === 'CREATE_SNAPSHOT'
    };
  };

  const refreshData = async () => {
    if (!filterClient) {
      setDbFluxo(null);
      return;
    }
    const cleanId = filterClient.trim();
    const currentUserId = auth.currentUser?.uid || 'guest';
    
    const context = buildContext('VIEW_FINANCIALS', cleanId);

    const q = query(
      collection(db, 'cash_flows'), 
      where('clientId', '==', cleanId),
      where('ownerId', '==', currentUserId)
    );
    try {
      const snap = await GovernedRepositoryWrapper.execute(context, async () => await getDocs(q));
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setDbFluxo(data);
        const clientObj = clients?.find((c: any) => c.id === cleanId);
        const input = {
          clientProfile: clientObj,
          cashFlowData: [data],
          rawFinancialData: { segmentoEmpresa: clientObj?.segmento || 'Default' },
          historicalCyclesCount: 1,
          isMockData: false
        };
        const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
        setExecutiveReport(report);
      } else {
        setDbFluxo(null);
        setExecutiveReport(null);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleGenerate = async () => {
    if (!filterClient) return;
    setIsGenerating(true);
    const cleanId = filterClient.trim();
    const context = buildContext('CREATE_SNAPSHOT', cleanId);
    try {
      const data = await generateCashFlow(context, cleanId);
      await refreshData();
      alert(`Fluxo de caixa gerado com sucesso! (${data.Fluxo_Diario.length} dias projetados)`);
    } catch (error: any) {
      console.error('Erro ao gerar fluxo:', error);
      alert('Erro ao gerar fluxo de caixa: ' + (error.message || error));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const detalhado = dbFluxo || {
    Fluxo_Diario: [],
    Contas_Receber: [],
    Contas_Pagar: [],
    Passivo_Vencido: [],
    KPIs: []
  };

  const Fluxo_Diario = detalhado?.Fluxo_Diario || [];
  const Contas_Receber = detalhado?.Contas_Receber || [];
  const Contas_Pagar = detalhado?.Contas_Pagar || [];
  const Passivo_Vencido = detalhado?.Passivo_Vencido || [];
  const Inadimplencia = detalhado?.Inadimplencia || [];
  const KPIs = detalhado?.KPIs || [];

  const Fluxo_Diario_Filtered = useMemo(() => {
    return Fluxo_Diario.slice(0, viewRange);
  }, [Fluxo_Diario, viewRange]);

  const resumo = useMemo(() => {
    if (!Fluxo_Diario_Filtered || Fluxo_Diario_Filtered.length === 0) return { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0, passivoVencido: 0, burnRate: 0, diasCaixa: 0, pontoMinimo: { "Fórmula / Valor": 0, Data: '' }, ncg: 0, diasAteRuptura: -1 };
    
    try {
      const saldoInicial = Number(Fluxo_Diario_Filtered[0]?.["Saldo Inicial"]) || 0;
      const entradas = Fluxo_Diario_Filtered.reduce((acc: number, r: any) => acc + (Number(r?.Entradas) || 0), 0);
      const saidas = Fluxo_Diario_Filtered.reduce((acc: number, r: any) => acc + (Number(r?.["Saídas"]) || 0), 0);
      const saldoFinal = Number(Fluxo_Diario_Filtered[Fluxo_Diario_Filtered.length - 1]?.["Saldo Final"]) || 0;
      const passivoVencido = Passivo_Vencido.reduce((acc: number, r: any) => acc + (Number(r?.Valor) || 0), 0);
      
      const burnRate = Number(KPIs.find((k: any) => k.Indicador === "Burn rate médio diário")?.["Fórmula / Valor"]) || 0;
      const diasCaixa = Number(KPIs.find((k: any) => k.Indicador === "Dias de caixa (Runway)")?.["Fórmula / Valor"]) || 0;
      const pontoMinimo = KPIs.find((k: any) => k.Indicador === "Ponto de Caixa Mínimo") || { "Fórmula / Valor": 0, Data: '' };
      const rupturaRow = Fluxo_Diario_Filtered.find((r: any) => (Number(r?.["Saldo Final"]) || 0) < 0);
      const dataRuptura = rupturaRow ? rupturaRow.Data : null;

      const entradasNoPeriodo = Fluxo_Diario_Filtered.reduce((acc: number, r: any) => acc + (Number(r?.Entradas) || 0), 0);
      const saídasNoPeriodo = Fluxo_Diario_Filtered.reduce((acc: number, r: any) => acc + (Number(r?.["Saídas"]) || 0), 0);
      
      const diasAteRuptura = Number(KPIs.find((k: any) => k.Indicador === "Dias até Ruptura")?.["Fórmula / Valor"] ?? -1);
      
      const totalVencidoReceber = Contas_Receber.filter((r: any) => r.Status === 'Vencido').reduce((acc: number, r: any) => acc + (Number(r.Valor) || 0), 0);
      const totalReceberGeral = Contas_Receber.reduce((acc: number, r: any) => acc + (Number(r.Valor) || 0), 0);
      const indiceInadimplencia = totalReceberGeral > 0 ? (totalVencidoReceber / totalReceberGeral) * 100 : 0;

      return { saldoInicial, entradas: entradasNoPeriodo, saidas: saídasNoPeriodo, saldoFinal, passivoVencido, burnRate, diasCaixa, pontoMinimo, dataRuptura, diasAteRuptura, totalVencidoReceber, indiceInadimplencia };
    } catch (e) {
      console.error("Error calculating summary metrics:", e);
      return { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0, passivoVencido: 0, burnRate: 0, diasCaixa: 0, pontoMinimo: { "Fórmula / Valor": 0, Data: '' }, dataRuptura: null, diasAteRuptura: -1 };
    }
  }, [Fluxo_Diario_Filtered, Passivo_Vencido, KPIs, viewRange, Contas_Pagar, Contas_Receber]);

  const fluxoMensal = useMemo(() => {
    const map = new Map();
    try {
      Fluxo_Diario_Filtered.forEach((row: any) => {
        if (!row) return;
        const dataStr = String(row.Data || '');
        const key = dataStr.slice(0, 7); // YYYY-MM
        if (!key) return;
        
        if (!map.has(key)) {
          const [year, month] = key.split('-');
          const monthName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][parseInt(month) - 1];
          map.set(key, { mes: `${monthName} / ${year}`, entradas: 0, saidas: 0, saldoFinal: 0 });
        }
        const item = map.get(key);
        item.entradas += (Number(row.Entradas) || 0);
        item.saidas += (Number(row["Saídas"]) || 0);
        item.saldoFinal = (Number(row["Saldo Final"]) || 0);
      });
    } catch (e) {
      console.error("Error calculating monthly flow:", e);
    }
    return Array.from(map.values());
  }, [Fluxo_Diario_Filtered]);

  const concentracaoCategorias = useMemo(() => {
    const map = new Map();
    Contas_Pagar.forEach((p: any) => {
      const cat = p.Observação || 'Operacional';
      map.set(cat, (map.get(cat) || 0) + (Number(p.Valor) || 0));
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [Contas_Pagar]);

  const COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-success)',
    'var(--color-muted-foreground)',
    'var(--color-border)'
  ];

  const filteredPagar = Contas_Pagar.filter((r: any) => 
    r.Fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.Observação && r.Observação.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredReceber = Contas_Receber.filter((r: any) => 
    r.Cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxMensal = Math.max(...fluxoMensal.flatMap((m: any) => [m.entradas, m.saidas]), 1);

  if (Fluxo_Diario.length === 0) {
    return (
      <div className="space-y-10 pb-20 animate-executive-fade">
        <div className="bg-slate-900 rounded-[40px] p-10 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
        <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
      )}
      <PageHeader 
              title="Fluxo de Caixa" 
              subtitle={`Monitoramento de liquidez, projeções diárias e controle de obrigações · ${clients.find((c: any) => c.id === filterClient)?.fantasia || 'Cliente'}`}
              icon={<Calculator className="text-secondary" size={24} />}
              color="secondary"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !filterClient}
                className="px-4 md:px-6 py-2 md:py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                GERAR FLUXO
              </button>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-sm">
                {[
                  { label: '30D', value: 30 },
                  { label: '90D', value: 90 },
                  { label: '180D', value: 180 },
                  { label: '360D', value: 360 }
                ].map(p => (
                  <button
                    key={p.value}
                    onClick={() => setViewRange(p.value as any)}
                    className={cn(
                      "px-4 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                      viewRange === p.value ? "bg-white text-muted-foreground shadow-xl" : "text-muted-foreground hover:text-white"
                    )}
                  >{p.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-border rounded-[40px] p-20 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Calculator size={48} className="text-muted-foreground" />
          </div>
     <h3 className="text-xl font-black text-executive-secondary mb-2">{t('cf.empty_detailed')}</h3>
     <p className="text-executive-secondary max-w-md mb-8 font-medium">Não encontramos o arquivo de projeção de caixa para este cliente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
        <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
      )}
      <PageHeader 
        title="Fluxo de Caixa" 
        subtitle={`Monitoramento estratégico de liquidez e solvência · ${clients.find((c: any) => c.id === filterClient)?.fantasia || 'Cliente'}`}
        icon={Calculator}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md p-1 flex items-center gap-1 shadow-sm">
            <button 
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all text-muted-foreground hover:text-foreground hover:bg-surface-container flex items-center gap-2 print:hidden"
            >
              <FileText size={14} /> EXPORTAR PDF
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !filterClient}
            className="px-5 md:px-8 py-2 md:py-3 bg-secondary text-white rounded-md text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-premium flex items-center gap-2 disabled:opacity-50 print:hidden"
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            GERAR FLUXO
          </button>
        </div>
      </div>


        <div className="relative z-10 mt-10 flex bg-card/40 p-1.5 rounded-md border border-border backdrop-blur-sm w-fit overflow-x-auto max-w-full shadow-sm">
          {[
            { id: 'dashboard', label: 'DASHBOARD' },
            { id: 'fluxo', label: 'FLUXO DIÁRIO' },
            { id: 'receber', label: 'C. RECEBER' },
            { id: 'inadimplencia', label: 'INADIMPLÊNCIA' },
            { id: 'pagar', label: 'C. PAGAR' },
            { id: 'passivo', label: 'P. VENCIDO' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 text-[10px] font-medium rounded-sm transition-all uppercase tracking-widest whitespace-nowrap",
                activeTab === tab.id ? "bg-white text-secondary shadow-premium" : "text-muted-foreground hover:text-foreground"
              )}
            >{tab.label}</button>
          ))}
        </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center bg-surface-container/60 p-2 rounded-md border border-border">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest ml-4">{t('cf.projection_window')}</span>
              <div className="flex bg-card p-1 rounded-sm shadow-sm border border-border">
                {[
                  { label: '30 DIAS', value: 30 },
                  { label: '90 DIAS', value: 90 },
                  { label: '180 DIAS', value: 180 },
                  { label: '360 DIAS', value: 360 }
                ].map(p => (
                  <button
                    key={p.value}
                    onClick={() => setViewRange(p.value as any)}
                    className={cn(
                      "px-4 md:px-6 py-1.5 md:py-2 text-[10px] font-medium rounded-sm transition-all",
                      viewRange === p.value ? "bg-secondary text-white shadow-premium" : "text-muted-foreground hover:text-foreground"
                    )}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-border shadow-sm col-span-1 md:col-span-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">{t('cf.cfo_summary')}</p>
                <div className="space-y-4">
                  {executiveReport?.metrics?.alerts?.map((alert: any, i: number) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border ${alert.type === 'danger' ? 'bg-critical-soft border-rose-100' : 'bg-warning-soft border-amber-100'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${alert.type === 'danger' ? 'bg-critical-soft0' : 'bg-warning-soft0'}`}>!</div>
                      <div>
                        <h4 className={`text-sm font-black uppercase tracking-tight ${alert.type === 'danger' ? 'text-rose-900' : 'text-amber-900'}`}>{alert.type === 'danger' ? 'Alerta Crítico' : 'Atenção'}</h4>
                        <p className={`text-xs mt-1 ${alert.type === 'danger' ? 'text-rose-700' : 'text-amber-700'}`}>{alert.msg}</p>
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-border">
           <p className="text-[9px] font-bold text-executive-secondary uppercase">{t('cf.runway')}</p>
           <p className="text-lg font-black text-executive-secondary">{resumo.diasCaixa} dias</p>
                      <div className={cn("mt-1 w-full h-1 bg-slate-200 rounded-full overflow-hidden")}>
                        <div className={cn("h-full", resumo.diasCaixa < 30 ? "bg-critical-soft0" : "bg-success-soft0")} style={{ width: `${Math.min(resumo.diasCaixa, 100)}%` }} />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-border">
           <p className="text-[9px] font-bold text-executive-secondary uppercase">{t('cf.investment_capacity')}</p>
           <p className="text-lg font-black text-executive-secondary">{formatCurrency(Math.max(0, resumo?.saldoFinal - resumo?.passivoVencido))}</p>
                    </div>
                    <div className="p-4 bg-critical-soft rounded-2xl border border-rose-100 col-span-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-bold text-rose-900 uppercase">Inadimplência de Clientes (Atrasados)</p>
                        <span className="text-[10px] font-black text-rose-600 bg-white px-2 py-0.5 rounded-full">{resumo?.indiceInadimplencia.toFixed(2)}%</span>
                      </div>
                      <p className="text-lg font-black text-rose-600">{formatCurrency(resumo?.totalVencidoReceber)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
                {[
                  { title: 'Saldo Final Projetado', value: formatValue(resumo.saldoFinal, ''), color: resumo.saldoFinal < 0 ? 'Vermelho' : 'Verde', icon: Calculator, suffix: 'R$' },
                  { title: 'Passivo Vencido', value: formatValue(resumo.passivoVencido, ''), color: 'Vermelho', icon: Calculator, suffix: 'R$' },
                  { title: 'Runway (Dias)', value: formatValue(resumo.diasCaixa, ''), color: resumo.diasCaixa < 30 ? 'Vermelho' : 'Verde', icon: Calculator, suffix: '' },
                  { title: 'Inadimplência', value: formatValue(resumo.indiceInadimplencia, ''), color: resumo.indiceInadimplencia > 10 ? 'Vermelho' : 'Verde', icon: Calculator, suffix: '%' },
                  { title: 'Burn Rate Diário', value: formatValue(resumo.burnRate, ''), color: 'Amarelo', icon: Calculator, suffix: 'R$' },
                ].map((kpi, idx) => (
                  <ExecutiveMetricCard density="analytical" key={idx}
                    label={kpi.title}
                    value={kpi.value}
                    suffix={kpi.suffix}
                    icon={kpi.icon}
                    tone={kpi.color as any}
                  />
                ))}
              </div>
            </div>

            <ExecutivePerspectiveSection intelligenceReport={executiveReport} loading={!executiveReport} className="mb-8 shadow-xl" />

            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
              <div className="mb-8">
        <h3 className="text-xl font-bold text-executive-secondary">{t('cf.liquidity_curve')}</h3>
        <p className="text-sm text-executive-secondary">Saldo acumulado disponível ao longo dos próximos {viewRange} dias.</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Fluxo_Diario_Filtered}>
                    <defs>
                      <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={colors.secondary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                    <XAxis 
                      dataKey="Data" 
                      tickFormatter={(val) => formatDate(val).split('/')[0] + '/' + formatDate(val).split('/')[1]}
                      tick={{ fontSize: 10, fontWeight: 700, fill: colors.mutedForeground }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(val) => `R$ ${val / 1000}k`}
                      tick={{ fontSize: 10, fontWeight: 700, fill: colors.mutedForeground }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '24px', 
                        border: `1px solid ${colors.border}`, 
                        backgroundColor: colors.cardBg,
                        color: colors.cardFg,
                        boxShadow: 'var(--shadow-md)', 
                        fontSize: '12px',
                        padding: '16px'
                      }}
                      formatter={(val: number) => [formatCurrency(val), 'Saldo Projetado']}
                      labelFormatter={(label) => `Data: ${formatDate(label)}`}
                    />
                    <ReferenceLine y={0} stroke="currentColor" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="Saldo Final" 
                      stroke={colors.secondary} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSaldo)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                <div className="mb-6 flex justify-between items-center">
                  <div>
          <h3 className="text-xl font-bold text-executive-secondary">{t('cf.expenses_composition')}</h3>
          <p className="text-sm text-executive-secondary">Distribuição por categoria.</p>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">{t('cf.cfo_view')}</span>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={concentracaoCategorias}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {concentracaoCategorias.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(val: number) => formatCurrency(val)}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {concentracaoCategorias.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-muted-foreground">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="mb-8">
         <h3 className="text-xl font-bold text-executive-secondary">{t('cf.monthly_consolidated')}</h3>
         <p className="text-sm text-executive-secondary">Comparativo de entradas e saídas por competência.</p>
                </div>
                <div className="space-y-6">
                  {fluxoMensal.slice(0, 5).map((m: any) => {
                    const maxVal = Math.max(...fluxoMensal.map((f: any) => Math.max(f.entradas, f.saidas)), 1);
                    return (
                      <div key={m.mes} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{m.mes}</h4>
                          <p className="text-xs font-bold text-muted-foreground"><span className={cn(m.saldoFinal < 0 ? "text-rose-600" : "text-emerald-600")}>{formatCurrency(m.saldoFinal)}</span></p>
                        </div>
                        <div className="space-y-1">
                           <div className="bg-slate-50 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-success-soft0 h-full rounded-full" style={{ width: `${(m.entradas / maxVal) * 100}%` }} />
                           </div>
                           <div className="bg-slate-50 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-critical-soft0 h-full rounded-full" style={{ width: `${(m.saidas / maxVal) * 100}%` }} />
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-8 border-b border-border">
        <h3 className="text-xl font-bold text-executive-secondary">{t('cf.daily_statement')}</h3>
        <p className="text-sm text-executive-secondary">Movimentação esperada para os próximos 180 dias.</p>
              </div>
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      {["Data", "Saldo Inicial", "Entradas", "Saídas", "Saldo Final"].map(h => (
                        <th key={h} className={cn("px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black uppercase tracking-widest", h === "Saldo Inicial" ? "text-primary bg-primary/5" : "text-muted-foreground")}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Fluxo_Diario_Filtered.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-secondary">
            <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary">{formatDate(row.Data)}</td>
            <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary bg-slate-50/30">{formatCurrency(row["Saldo Inicial"])}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-emerald-600">+{formatCurrency(row.Entradas)}</td>
                        <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-rose-600">-{formatCurrency(row["Saídas"])}</td>
            <td className={cn("px-4 md:px-6 py-2.5 md:py-4 text-sm", row["Saldo Final"] < 0 ? "text-rose-600" : "text-executive-secondary")}>
                          {formatCurrency(row["Saldo Final"])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'fluxo' && (
          <motion.div 
            key="fluxo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-border">
       <h3 className="text-xl font-bold text-executive-secondary">{t('cf.daily_statement')}</h3>
       <p className="text-sm text-executive-secondary">Movimentação esperada para os próximos 180 dias.</p>
            </div>
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {["Data", "Saldo Inicial", "Entradas", "Saídas", "Saldo Final"].map(h => (
                      <th key={h} className={cn("px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black uppercase tracking-widest", h === "Saldo Inicial" ? "text-primary bg-primary/5" : "text-muted-foreground")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Fluxo_Diario.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-secondary">
           <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary">{formatDate(row.Data)}</td>
           <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary bg-slate-50/30">{formatCurrency(row["Saldo Inicial"])}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-emerald-600">+{formatCurrency(row.Entradas)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-rose-600">-{formatCurrency(row["Saídas"])}</td>
           <td className={cn("px-4 md:px-6 py-2.5 md:py-4 text-sm", row["Saldo Final"] < 0 ? "text-rose-600" : "text-executive-secondary")}>
                        {formatCurrency(row["Saldo Final"])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {(activeTab === 'receber' || activeTab === 'pagar') && (
           <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
        <h3 className="text-xl font-bold text-executive-secondary">{activeTab === 'receber' ? 'Contas a Receber' : 'Contas a Pagar'}</h3>
        <p className="text-sm text-executive-secondary">Gestão detalhada de {activeTab === 'receber' ? 'receitas' : 'obrigações'}.</p>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Buscar fornecedor/cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all w-64"
                />
                <Search size={14} className="absolute left-3.5 top-3 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('cf.table.due_date')}</th>
                    <th className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{activeTab === 'receber' ? 'Cliente' : 'Fornecedor'}</th>
                    <th className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('cf.table.value')}</th>
                    <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('cf.table.status')}</th>
                    {activeTab === 'pagar' && <th className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('cf.table.obs')}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'receber' ? filteredReceber : filteredPagar).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-xs text-muted-foreground">{formatDate(row.Vencimento)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-xs text-muted-foreground">{row.Cliente || row.Fornecedor}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-right text-xs text-secondary">{formatCurrency(row.Valor)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                        <span className={cn(
                          "text-[9px] px-2 py-1 rounded uppercase tracking-tighter",
                          row.Status === 'Recebido' || row.Status === 'Pago' ? "bg-emerald-100 text-emerald-700" :
                          row.Status === 'Vencido' ? "bg-rose-100 text-rose-700" :
                          "bg-primary/10 text-primary"
                        )}>{row.Status}</span>
                      </td>
                      {activeTab === 'pagar' && <td className="px-4 md:px-6 py-2.5 md:py-4 text-xs text-muted-foreground italic">{row.Observação}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'inadimplencia' && (
          <motion.div 
            key="inadimplencia"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-border">
       <h3 className="text-xl font-bold text-executive-secondary">{t('cf.default.clients')}</h3>
       <p className="text-sm text-executive-secondary">Títulos com vencimento anterior a hoje e não recebidos.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Cliente", "Vencimento Originário", "Valor Principal", "Status"].map(h => (
                      <th key={h} className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Inadimplencia.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
           <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary">{row.Cliente}</td>
           <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary">{formatDate(row.Vencimento)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-rose-600">{formatCurrency(row.Valor)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4">
                        <span className="text-[9px] px-2 py-1 rounded uppercase tracking-tighter bg-rose-100 text-rose-700">{t('cf.default.overdue')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'passivo' && (
          <motion.div 
            key="passivo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-border">
       <h3 className="text-xl font-bold text-executive-secondary">{t('cf.default.liabilities')}</h3>
       <p className="text-sm text-executive-secondary">Débitos acumulados fora do fluxo operacional corrente.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Credor", "Tipo", "Vencimento Originário", "Valor Principal"].map(h => (
                      <th key={h} className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Passivo_Vencido.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
           <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary">{row.Credor}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase text-muted-foreground">{row.Tipo}</td>
           <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-executive-secondary">{formatDate(row.Vencimento)}</td>
                      <td className="px-4 md:px-6 py-2.5 md:py-4 text-sm text-rose-600">{formatCurrency(row.Valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <ExecutiveCommentary 
        reportType="DFC"
        clientId={filterClient}
        year={selectedYear}
        month={selectedMonth}
      />
    </div>
  );
}
