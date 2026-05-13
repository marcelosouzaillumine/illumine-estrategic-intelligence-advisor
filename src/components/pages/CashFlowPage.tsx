
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, FileSpreadsheet, Loader2, Play, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../Common';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { DATA } from '../../data';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { generateCashFlow } from '../../services/cashFlowService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, Legend } from 'recharts';

export function CashFlowPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
   const [activeTab, setActiveTab] = useState<'dashboard' | 'fluxo' | 'receber' | 'pagar' | 'passivo' | 'inadimplencia'>('dashboard');
   const [searchTerm, setSearchTerm] = useState('');
   const [filterClient, setFilterClient] = useState(selectedClient);
   const [viewRange, setViewRange] = useState<30 | 90 | 180 | 360>(180);
   const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setFilterClient(selectedClient);
  }, [selectedClient]);

  const [dbFluxo, setDbFluxo] = useState<any>(null);

  useEffect(() => {
    refreshData();
  }, [filterClient]);

  const refreshData = async () => {
    if (!filterClient) {
      setDbFluxo(null);
      return;
    }
    const cleanId = filterClient.trim();
    const currentUserId = auth.currentUser?.uid || 'guest';
    
    const q = query(
      collection(db, 'cash_flows'), 
      where('clientId', '==', cleanId),
      where('ownerId', '==', currentUserId)
    );
    try {
      const snap = await getDocs(q);
      if (!snap.empty) {
        setDbFluxo(snap.docs[0].data());
      } else {
        setDbFluxo(null);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleGenerate = async () => {
    if (!filterClient) return;
    setIsGenerating(true);
    try {
      const data = await generateCashFlow(filterClient);
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

  const detalhado = dbFluxo || (DATA as any).fluxoCaixaDetalhado[filterClient] || {
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
      const payablesNoPeriodo = Contas_Pagar.filter((p: any) => p.Vencimento <= Fluxo_Diario_Filtered[Fluxo_Diario_Filtered.length - 1]?.Data).reduce((acc: number, p: any) => acc + (Number(p.Valor) || 0), 0);
      
      const mesesNoPeriodo = Math.max(1, viewRange / 30);
      const ncg = saídasNoPeriodo / mesesNoPeriodo;

      const lcr = payablesNoPeriodo > 0 ? (saldoInicial + entradasNoPeriodo) / payablesNoPeriodo : 2;
      const margemSeguranca = saídasNoPeriodo > 0 ? (saldoFinal / saídasNoPeriodo) * 100 : 0;

      const diasAteRuptura = Number(KPIs.find((k: any) => k.Indicador === "Dias até Ruptura")?.["Fórmula / Valor"] ?? -1);
      
      const totalVencidoReceber = Contas_Receber.filter((r: any) => r.Status === 'Vencido').reduce((acc: number, r: any) => acc + (Number(r.Valor) || 0), 0);
      const totalReceberGeral = Contas_Receber.reduce((acc: number, r: any) => acc + (Number(r.Valor) || 0), 0);
      const indiceInadimplencia = totalReceberGeral > 0 ? (totalVencidoReceber / totalReceberGeral) * 100 : 0;

      return { saldoInicial, entradas: entradasNoPeriodo, saidas: saídasNoPeriodo, saldoFinal, passivoVencido, burnRate, diasCaixa, pontoMinimo, dataRuptura, ncg, diasAteRuptura, totalVencidoReceber, indiceInadimplencia, lcr, margemSeguranca };
    } catch (e) {
      console.error("Error calculating summary metrics:", e);
      return { saldoInicial: 0, entradas: 0, saidas: 0, saldoFinal: 0, passivoVencido: 0, burnRate: 0, diasCaixa: 0, pontoMinimo: { "Fórmula / Valor": 0, Data: '' }, dataRuptura: null, ncg: 0, diasAteRuptura: -1, lcr: 0, margemSeguranca: 0 };
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

  const COLORS = ['#ff8552', '#0e1c2c', '#64748b', '#94a3b8', '#cbd5e1'];

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
                className="px-6 py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2 disabled:opacity-50"
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
                      viewRange === p.value ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"
                    )}
                  >{p.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-200/60 rounded-[40px] p-20 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Calculator size={48} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Sem dados de fluxo detalhado</h3>
          <p className="text-slate-500 max-w-md mb-8 font-medium">Não encontramos o arquivo de projeção de caixa para este cliente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Fluxo de Caixa" 
        subtitle={`Monitoramento estratégico de liquidez e solvência · ${clients.find((c: any) => c.id === filterClient)?.fantasia || 'Cliente'}`}
        icon={<Calculator size={24} />}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExportPDF}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 print:hidden"
            >
              <FileText size={14} /> EXPORTAR PDF
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !filterClient}
              className="px-8 py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2 disabled:opacity-50 print:hidden"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              GERAR FLUXO
            </button>
          </div>
        }
      />
        <div className="relative z-10 mt-10 flex bg-white/5 p-1.5 rounded-[20px] border border-white/10 backdrop-blur-sm w-fit overflow-x-auto max-w-full">
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
                "px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest whitespace-nowrap",
                activeTab === tab.id ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"
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
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Janela de Projeção</span>
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
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
                      "px-6 py-2 text-[10px] font-black rounded-lg transition-all",
                      viewRange === p.value ? "bg-secondary text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                    )}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">CFO Executive Summary</p>
                <div className="space-y-4">
                  {resumo?.saldoFinal < 0 || resumo?.dataRuptura ? (
                    <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white shrink-0">!</div>
                      <div>
                        <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight">Risco de Liquidez Identificado</h4>
                        <p className="text-xs text-rose-700 mt-1">
                          {resumo?.dataRuptura 
                            ? `O fluxo ficará negativo pela primeira vez em ${formatDate(resumo.dataRuptura)}. `
                            : `Atenção: Saldo projetado de ${formatCurrency(resumo?.saldoFinal)}. `
                          }
                          Recomenda-se revisão imediata de prazos com fornecedores.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">✓</div>
                      <div>
                        <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Liquidez Sob Controle</h4>
                        <p className="text-xs text-emerald-700 mt-1">A operação mantém-se positiva nos próximos {viewRange} dias. Ponto de caixa mínimo: <span className="font-bold">{formatCurrency(Number(resumo?.pontoMinimo?.["Fórmula / Valor"]) || 0)}</span>.</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Runway Operacional</p>
                      <p className="text-lg font-black text-slate-900">{resumo.diasCaixa} dias</p>
                      <div className={cn("mt-1 w-full h-1 bg-slate-200 rounded-full overflow-hidden")}>
                        <div className={cn("h-full", resumo.diasCaixa < 30 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${Math.min(resumo.diasCaixa, 100)}%` }} />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Capacidade de Investimento</p>
                      <p className="text-lg font-black text-slate-900">{formatCurrency(Math.max(0, resumo?.saldoFinal - resumo?.passivoVencido))}</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 col-span-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-bold text-rose-900 uppercase">Inadimplência de Clientes (Atrasados)</p>
                        <span className="text-[10px] font-black text-rose-600 bg-white px-2 py-0.5 rounded-full">{resumo?.indiceInadimplencia.toFixed(1)}%</span>
                      </div>
                      <p className="text-lg font-black text-rose-600">{formatCurrency(resumo?.totalVencidoReceber)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                {[
                  { title: 'Saldo Final Projetado', value: formatCurrency(resumo.saldoFinal), color: resumo.saldoFinal < 0 ? 'text-rose-600' : 'text-emerald-600', icon: '💰' },
                  { title: 'Passivo Vencido', value: formatCurrency(resumo.passivoVencido), color: 'text-rose-600', icon: '⚠️' },
                  { title: `LCR (${viewRange}D)`, value: Number(resumo.lcr).toFixed(2), color: Number(resumo.lcr) < 1 ? 'text-rose-600' : 'text-emerald-600', icon: '🛡️' },
                  { title: `Margem Segurança`, value: Number(resumo.margemSeguranca).toFixed(1) + "%", color: Number(resumo.margemSeguranca) < 10 ? 'text-amber-600' : 'text-emerald-600', icon: '📉' },
                  { title: 'Necessidade Mensal (NCG)', value: formatCurrency(resumo.ncg), color: 'text-secondary', icon: '🔄' },
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                      <span className="text-xs opacity-50">{kpi.icon}</span>
                    </div>
                    <h3 className={cn("text-lg font-black tracking-tight", kpi.color || "text-slate-900")}>{kpi.value}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">Curva de Liquidez Projetada</h3>
                <p className="text-sm text-slate-500">Saldo acumulado disponível ao longo dos próximos {viewRange} dias.</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Fluxo_Diario_Filtered}>
                    <defs>
                      <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff8552" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ff8552" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="Data" 
                      tickFormatter={(val) => formatDate(val).split('/')[0] + '/' + formatDate(val).split('/')[1]}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(val) => `R$ ${val / 1000}k`}
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number) => [formatCurrency(val), 'Saldo Projetado']}
                      labelFormatter={(label) => `Data: ${formatDate(label)}`}
                    />
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="Saldo Final" 
                      stroke="#ff8552" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSaldo)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Composição de Gastos</h3>
                    <p className="text-sm text-slate-500">Distribuição por categoria.</p>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">CFO View</span>
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
                      <span className="text-[10px] font-bold text-slate-500 truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Visão Mensal Consolidada</h3>
                  <p className="text-sm text-slate-500">Comparativo de entradas e saídas por competência.</p>
                </div>
                <div className="space-y-6">
                  {fluxoMensal.slice(0, 5).map((m: any) => {
                    const maxVal = Math.max(...fluxoMensal.map((f: any) => Math.max(f.entradas, f.saidas)), 1);
                    return (
                      <div key={m.mes} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.mes}</h4>
                          <p className="text-xs font-bold text-slate-600"><span className={cn(m.saldoFinal < 0 ? "text-rose-600" : "text-emerald-600")}>{formatCurrency(m.saldoFinal)}</span></p>
                        </div>
                        <div className="space-y-1">
                           <div className="bg-slate-50 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(m.entradas / maxVal) * 100}%` }} />
                           </div>
                           <div className="bg-slate-50 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(m.saidas / maxVal) * 100}%` }} />
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Extrato Diário Projetado</h3>
                <p className="text-sm text-slate-500">Movimentação esperada para os próximos 180 dias.</p>
              </div>
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      {["Data", "Saldo Inicial", "Entradas", "Saídas", "Saldo Final"].map(h => (
                        <th key={h} className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", h === "Saldo Inicial" ? "text-primary bg-primary/5" : "text-slate-400")}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Fluxo_Diario_Filtered.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-secondary">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatDate(row.Data)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 bg-slate-50/30">{formatCurrency(row["Saldo Inicial"])}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">+{formatCurrency(row.Entradas)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-rose-600">-{formatCurrency(row["Saídas"])}</td>
                        <td className={cn("px-6 py-4 text-sm font-black", row["Saldo Final"] < 0 ? "text-rose-600" : "text-slate-900")}>
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
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Extrato Diário Projetado</h3>
              <p className="text-sm text-slate-500">Movimentação esperada para os próximos 180 dias.</p>
            </div>
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    {["Data", "Saldo Inicial", "Entradas", "Saídas", "Saldo Final"].map(h => (
                      <th key={h} className={cn("px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest", h === "Saldo Inicial" ? "text-primary bg-primary/5" : "text-slate-400")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Fluxo_Diario.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-secondary">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatDate(row.Data)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700 bg-slate-50/30">{formatCurrency(row["Saldo Inicial"])}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">+{formatCurrency(row.Entradas)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-rose-600">-{formatCurrency(row["Saídas"])}</td>
                      <td className={cn("px-6 py-4 text-sm font-black", row["Saldo Final"] < 0 ? "text-rose-600" : "text-slate-900")}>
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
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{activeTab === 'receber' ? 'Contas a Receber' : 'Contas a Pagar'}</h3>
                <p className="text-sm text-slate-500">Gestão detalhada de {activeTab === 'receber' ? 'receitas' : 'obrigações'}.</p>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Buscar fornecedor/cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all w-64"
                />
                <Search size={14} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-secondary transition-colors" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vencimento</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'receber' ? 'Cliente' : 'Fornecedor'}</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    {activeTab === 'pagar' && <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Obs</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'receber' ? filteredReceber : filteredPagar).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{formatDate(row.Vencimento)}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">{row.Cliente || row.Fornecedor}</td>
                      <td className="px-6 py-4 text-right text-xs font-black text-secondary">{formatCurrency(row.Valor)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter",
                          row.Status === 'Recebido' || row.Status === 'Pago' ? "bg-emerald-100 text-emerald-700" :
                          row.Status === 'Vencido' ? "bg-rose-100 text-rose-700" :
                          "bg-primary/10 text-primary"
                        )}>{row.Status}</span>
                      </td>
                      {activeTab === 'pagar' && <td className="px-6 py-4 text-xs text-slate-500 italic">{row.Observação}</td>}
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
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Inadimplência de Clientes</h3>
              <p className="text-sm text-slate-500">Títulos com vencimento anterior a hoje e não recebidos.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Cliente", "Vencimento Originário", "Valor Principal", "Status"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Inadimplencia.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{row.Cliente}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatDate(row.Vencimento)}</td>
                      <td className="px-6 py-4 text-sm font-black text-rose-600">{formatCurrency(row.Valor)}</td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter bg-rose-100 text-rose-700">Vencido</span>
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
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Passivo Vencido e Exigível</h3>
              <p className="text-sm text-slate-500">Débitos acumulados fora do fluxo operacional corrente.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Credor", "Tipo", "Vencimento Originário", "Valor Principal"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Passivo_Vencido.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{row.Credor}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{row.Tipo}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{formatDate(row.Vencimento)}</td>
                      <td className="px-6 py-4 text-sm font-black text-rose-600">{formatCurrency(row.Valor)}</td>
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
