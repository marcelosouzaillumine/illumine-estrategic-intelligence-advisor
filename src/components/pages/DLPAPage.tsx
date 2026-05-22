import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, FileText, Database, TrendingUp, TrendingDown, Info, BarChart3, AlertTriangle, ShieldAlert, Zap, Target, Activity, ShieldCheck, PieChart as PieChartIcon, CheckCircle2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

type ToastType = { type: 'success' | 'error'; message: string } | null;

// Helper: Custom Advanced KPI Card
function AdvancedKpiCard({ title, value, subtitle, status, icon: Icon, colorClass, borderClass }: any) {
  return (
    <div className={cn("p-6 rounded-[24px] border bg-white shadow-sm flex flex-col relative overflow-hidden group transition-all hover:shadow-md hover:border-slate-300", borderClass)}>
      <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none transition-transform duration-500 group-hover:scale-[2]", colorClass)} />
      <div className="flex items-start justify-between mb-5 relative z-10">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight w-2/3">{title}</h4>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
          <Icon size={18} />
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <div className="w-full [container-type:inline-size] py-1 mb-2">
           <p className="font-display font-medium text-slate-800 truncate text-[clamp(1.1rem,12cqw,1.75rem)] tracking-tight">
             {value}
           </p>
        </div>
        <div className="flex items-center gap-2">
           <span className={cn("text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border", status.bgColor, status.textColor, status.borderColor)}>
             {status.label}
           </span>
           <span className="text-[10px] text-slate-400 font-medium line-clamp-1">{subtitle}</span>
        </div>
      </div>
    </div>
  )
}

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca de Dados ────────────────────────────────────────────────────────
  const { dbData: dbDataDLPA, docIds: docIdsDLPA, loading: loadingDLPA, refetch: refetchDLPA } =
    useAnnualFinancialData(selectedClient, filterYear, 'DLPA');

  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDLPA;

  // ── Inteligência de Extração e Cálculo ─────────────────────────────────────
  const metrics = useMemo(() => {
    const normalizeString = (s: string) => 
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/^[0-9.]+\s*[-]\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim();

    const getVal = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistoryData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => normalizeString(d.type || '') === normalizeString(t))
      );
      const normalizedFilters = nameFilters.map(normalizeString);
      const match = yearEntries.find((d: any) => {
        const c = normalizeString(d.conta || d.category || '');
        return normalizedFilters.some(n => c === n || c.includes(n));
      });
      return match?.val || match?.valor || match?.value || 0;
    };

    // Bases
    const lucroLiquido = getVal(filterYear, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio']);
    const lucroOperacional = getVal(filterYear, ['dre'], ['ebit', 'lucro operacional', 'resultado operacional']);
    const ebitda = getVal(filterYear, ['dre'], ['ebitda', 'lajida']);
    const eventosNaoRecorrentes = getVal(filterYear, ['dre'], ['nao recorrente', 'extraordinario', 'outras receitas e despesas']);
    
    // DLPA / DFC
    let dividendos = getVal(filterYear, ['dlpa', 'dre', 'dfc'], ['dividendos', 'distribuicao de lucros', 'lucros distribuidos']);
    if (!dividendos && dbDataDLPA.length > 0) {
       dividendos = dbDataDLPA.find(d => normalizeString(d.conta || d.category || '').includes('distribuicao'))?.val || 0;
    }
    dividendos = Math.abs(dividendos); // Distribuição é saída

    const caixaOperacional = getVal(filterYear, ['dfc'], ['caixa operacional', 'fco', 'atividades operacionais']);
    const capex = Math.abs(getVal(filterYear, ['dfc', 'bp'], ['capex', 'investimento', 'imobilizado', 'atividades de investimento']));
    const varCapGiro = getVal(filterYear, ['dfc'], ['capital de giro', 'variacao do capital de giro']);
    
    // BP
    const pl = getVal(filterYear, ['bp', 'balanço patrimonial'], ['patrimonio liquido', 'pl']);
    const plInicial = getVal(filterYear - 1, ['bp', 'balanço patrimonial'], ['patrimonio liquido', 'pl']);
    const lucrosAcumulados = getVal(filterYear, ['bp', 'dlpa'], ['lucros acumulados', 'saldo final', 'lucros ou prejuizos']);
    const prejuizoAcumulado = lucrosAcumulados < 0 ? Math.abs(lucrosAcumulados) : 0;

    // Fórmulas
    const resultadoRecorrente = lucroLiquido - eventosNaoRecorrentes;
    const fluxCaixaLivre = caixaOperacional - capex;

    const convLucroCaixa = lucroLiquido !== 0 ? caixaOperacional / lucroLiquido : 0;
    const dividendCoverage = dividendos !== 0 ? lucroLiquido / dividendos : 0;
    const distCaixaLivre = fluxCaixaLivre !== 0 ? dividendos / fluxCaixaLivre : 0;
    const retencaoEstrategica = lucroLiquido > 0 ? Math.max(0, lucroLiquido - dividendos) / lucroLiquido : 0;
    
    const cobPatrimonialPrejuizo = prejuizoAcumulado !== 0 ? pl / prejuizoAcumulado : 0;
    const erosaoPatrimonial = pl !== 0 ? prejuizoAcumulado / pl : 0;
    
    const plPreDistribuicao = pl + dividendos;
    const presCapital = plPreDistribuicao !== 0 ? pl / plPreDistribuicao : 0;
    
    const taxaReinvest = lucroOperacional !== 0 ? (capex + Math.abs(varCapGiro)) / lucroOperacional : 0;
    const dependSocios = caixaOperacional !== 0 ? dividendos / caixaOperacional : 0;

    // Health Score (0-100)
    let score = 100;
    if (lucroLiquido < 0) score -= 20;
    if (convLucroCaixa < 0.7) score -= 15;
    if (dividendCoverage < 1) score -= 20;
    if (distCaixaLivre > 1) score -= 15;
    if (erosaoPatrimonial > 0.1) score -= 10;
    if (dependSocios > 0.5) score -= 10;
    if (taxaReinvest < 0.1) score -= 10;
    score = Math.max(0, Math.min(100, score));

    return {
      bases: { lucroLiquido, lucroOperacional, ebitda, dividendos, caixaOperacional, capex, pl, plInicial, prejuizoAcumulado, fluxCaixaLivre, resultadoRecorrente },
      indicadores: {
        convLucroCaixa,
        dividendCoverage,
        distCaixaLivre,
        retencaoEstrategica,
        cobPatrimonialPrejuizo,
        erosaoPatrimonial,
        presCapital,
        taxaReinvest,
        dependSocios
      },
      score
    };
  }, [allHistoryData, filterYear, dbDataDLPA]);

  // ── Classificadores ───────────────────────────────────────────────────────
  
  const getStatus = (val: number, type: string) => {
    switch(type) {
      case 'convLucroCaixa':
        if (val > 1) return { label: 'Excelente', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600', borderColor: 'border-emerald-500/20' };
        if (val >= 0.7) return { label: 'Aceitável', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600', borderColor: 'border-blue-500/20' };
        if (val > 0) return { label: 'Baixa Qualidade', bgColor: 'bg-amber-500/10', textColor: 'text-amber-600', borderColor: 'border-amber-500/20' };
        return { label: 'Risco Operacional', bgColor: 'bg-rose-500/10', textColor: 'text-rose-600', borderColor: 'border-rose-500/20' };
      
      case 'dividendCoverage':
        if (val > 2) return { label: 'Saudável', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600', borderColor: 'border-emerald-500/20' };
        if (val >= 1) return { label: 'Estável', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600', borderColor: 'border-blue-500/20' };
        if (val > 0) return { label: 'Risco Patrimonial', bgColor: 'bg-amber-500/10', textColor: 'text-amber-600', borderColor: 'border-amber-500/20' };
        return { label: 'Crítico', bgColor: 'bg-rose-500/10', textColor: 'text-rose-600', borderColor: 'border-rose-500/20' };

      case 'erosao':
        if (val < 0.1) return { label: 'Controlado', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600', borderColor: 'border-emerald-500/20' };
        if (val <= 0.3) return { label: 'Atenção', bgColor: 'bg-amber-500/10', textColor: 'text-amber-600', borderColor: 'border-amber-500/20' };
        return { label: 'Crítico', bgColor: 'bg-rose-500/10', textColor: 'text-rose-600', borderColor: 'border-rose-500/20' };

      case 'distCaixaLivre':
        if (val <= 0.5) return { label: 'Sustentável', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600', borderColor: 'border-emerald-500/20' };
        if (val <= 1) return { label: 'Equilibrado', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600', borderColor: 'border-blue-500/20' };
        return { label: 'Pressão de Caixa', bgColor: 'bg-rose-500/10', textColor: 'text-rose-600', borderColor: 'border-rose-500/20' };
        
      default:
        return { label: 'Estável', bgColor: 'bg-slate-500/10', textColor: 'text-slate-600', borderColor: 'border-slate-500/20' };
    }
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Estratégico', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500/30', lightBg: 'bg-emerald-500/10' };
    if (score >= 60) return { label: 'Saudável', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/30', lightBg: 'bg-blue-500/10' };
    if (score >= 40) return { label: 'Sensível', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500/30', lightBg: 'bg-amber-500/10' };
    return { label: 'Crítico', color: 'text-rose-500', bg: 'bg-rose-500', border: 'border-rose-500/30', lightBg: 'bg-rose-500/10' };
  };

  const getMaturity = (score: number, taxaReinvest: number) => {
    if (score >= 80 && taxaReinvest > 0.3) return 'Distribuição Estratégica';
    if (score >= 70) return 'Maturidade';
    if (score >= 50 && taxaReinvest > 0.2) return 'Expansão';
    if (score >= 40) return 'Consolidação';
    return 'Sobrevivência';
  };

  const scoreStatus = getScoreStatus(metrics.score);
  const maturityStatus = getMaturity(metrics.score, metrics.indicadores.taxaReinvest);

  // ── Parecer Executivo Automático ──────────────────────────────────────────
  const generateInsights = () => {
    const insights = [];
    const { bases, indicadores } = metrics;

    if (bases.dividendos > 0 && bases.lucroLiquido < 0) {
      insights.push({
        type: 'danger',
        text: 'A distribuição de dividendos em cenário de prejuízo líquido indica forte desalinhamento entre a remuneração dos sócios e a preservação da estrutura patrimonial da companhia.'
      });
    }

    if (indicadores.convLucroCaixa > 0 && indicadores.convLucroCaixa < 0.7) {
      insights.push({
        type: 'warning',
        text: 'O lucro contábil apresenta baixa conversão em caixa, indicando fragilidade operacional e possível risco de pressão futura sobre a liquidez.'
      });
    } else if (indicadores.convLucroCaixa >= 1) {
      insights.push({
        type: 'success',
        text: 'Excelente conversão de lucro em caixa, validando a alta qualidade do resultado contábil e a robustez da operação.'
      });
    }

    if (indicadores.distCaixaLivre > 1) {
      insights.push({
        type: 'warning',
        text: 'A distribuição atual excede o fluxo de caixa livre gerado, forçando a companhia a consumir caixa ou aumentar endividamento para remunerar os sócios.'
      });
    }

    if (indicadores.taxaReinvest < 0.1 && bases.lucroOperacional > 0) {
      insights.push({
        type: 'info',
        text: 'A empresa apresenta boa capacidade de geração de valor operacional, porém necessita fortalecer sua taxa de reinvestimento (CAPEX) para sustentar crescimento de longo prazo.'
      });
    }

    if (indicadores.erosaoPatrimonial > 0.1) {
      insights.push({
        type: 'danger',
        text: 'Alerta de erosão patrimonial em andamento. O prejuízo acumulado já corrói parcela significativa do capital, exigindo plano de retenção imediato.'
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'success',
        text: 'O modelo de distribuição encontra-se alinhado à geração de caixa e preservação patrimonial, demonstrando alta maturidade na governança corporativa.'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // ── Histórico para Gráficos ───────────────────────────────────────────────
  const chartData = useMemo(() => {
    return [4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => d.year === y);
      
      const getValY = (docTypes: string[], nameFilters: string[]) => {
        const normalizedFilters = nameFilters.map(n => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
        const match = yearEntries.filter((d: any) => docTypes.includes(d.type?.toLowerCase())).find((d: any) => {
          const c = (d.conta || d.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          return normalizedFilters.some(n => c.includes(n));
        });
        return match?.val || match?.valor || match?.value || 0;
      };

      const l = getValY(['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio']);
      const d = Math.abs(getValY(['dlpa', 'dre', 'dfc'], ['dividendos', 'distribuicao']));
      const f = getValY(['dfc'], ['caixa operacional', 'fco']);

      return {
        year: y.toString(),
        Lucro: l,
        Dividendos: d,
        FCO: f
      };
    });
  }, [allHistoryData, filterYear]);

  // ── Handlers & UI Auxiliar ────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const actionButtons = (
    <div className="flex items-center gap-3">
      <div className="flex bg-card p-1 rounded-md border border-border items-center mr-2 shadow-sm">
        <Calendar size={12} className="ml-2 text-secondary" />
        <select
          onChange={(e) => setFilterYear(Number(e.target.value))}
          value={filterYear}
          className="bg-transparent px-3 py-1 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
        >
          {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowManualModal(true)}
        className="px-4 py-2 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Plus size={14} /> Lançar
      </button>

      <button
        onClick={() => setShowImportModal(true)}
        className="px-4 py-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Upload size={14} /> Importar
      </button>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Módulo de Inteligência de Capital & Governança" 
        subtitle="Análise estratégica profunda de distribuição, preservação patrimonial e qualidade do lucro."
        icon={Target}
        color="executive"
      />
      
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/50 p-4 rounded-2xl border border-slate-200 backdrop-blur-md shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
              Cálculo Dinâmico Multi-DRE/BP/DFC
            </span>
          </div>
        </div>
        {actionButtons}
      </div>

      {/* Visão de Board e Parecer Automático */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-1 rounded-[32px] p-8 bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white group">
          <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:scale-110", scoreStatus.lightBg)} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest">Health Score</h3>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">Visão de Board</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className={cn("text-7xl font-black tracking-tighter", scoreStatus.color)}>{metrics.score}</span>
              <span className="text-2xl font-bold text-white/30">/100</span>
            </div>
            
            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md mb-8", scoreStatus.lightBg, scoreStatus.border)}>
              <span className={cn("w-2 h-2 rounded-full animate-pulse", scoreStatus.bg)} />
              <span className={cn("text-xs font-bold uppercase tracking-widest", scoreStatus.color)}>{scoreStatus.label}</span>
            </div>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Maturidade do Capital</p>
            <p className="text-lg font-black text-white/90">{maturityStatus}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
               <Zap size={20} className="text-slate-700" />
             </div>
             <div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Parecer Executivo Automático</h3>
               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Análise Sistêmica</p>
             </div>
           </div>

           <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {insights.map((insight, idx) => (
               <div key={idx} className={cn(
                 "p-5 rounded-2xl border flex gap-4",
                 insight.type === 'danger' ? 'bg-rose-50 border-rose-100' :
                 insight.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                 insight.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                 'bg-blue-50 border-blue-100'
               )}>
                 <div className="shrink-0 mt-0.5">
                   {insight.type === 'danger' ? <ShieldAlert size={18} className="text-rose-500" /> :
                    insight.type === 'warning' ? <AlertTriangle size={18} className="text-amber-500" /> :
                    insight.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> :
                    <Info size={18} className="text-blue-500" />}
                 </div>
                 <p className={cn(
                   "text-sm font-medium leading-relaxed",
                   insight.type === 'danger' ? 'text-rose-900' :
                   insight.type === 'warning' ? 'text-amber-900' :
                   insight.type === 'success' ? 'text-emerald-900' :
                   'text-blue-900'
                 )}>
                   {insight.text}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Grade de Indicadores */}
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-2 flex items-center gap-2">
        <Activity size={16} className="text-secondary" /> Indicadores Estratégicos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AdvancedKpiCard 
          title="Resultado Recorrente" 
          value={formatCurrency(metrics.bases.resultadoRecorrente)} 
          subtitle="Lucro s/ efeitos extraordinários"
          status={{ label: metrics.bases.resultadoRecorrente > 0 ? 'Forte' : 'Atenção', bgColor: 'bg-slate-100', textColor: 'text-slate-600', borderColor: 'border-slate-200' }}
          icon={TrendingUp}
          colorClass="bg-blue-50 text-blue-500"
          borderClass="border-blue-100"
        />
        <AdvancedKpiCard 
          title="Conversão em Caixa" 
          value={formatValue(metrics.indicadores.convLucroCaixa * 100, '') + '%'} 
          subtitle="FCO / Lucro Líquido"
          status={getStatus(metrics.indicadores.convLucroCaixa, 'convLucroCaixa')}
          icon={Activity}
          colorClass="bg-emerald-50 text-emerald-500"
          borderClass="border-emerald-100"
        />
        <AdvancedKpiCard 
          title="Dividend Coverage" 
          value={formatValue(metrics.indicadores.dividendCoverage, '') + 'x'} 
          subtitle="Lucro / Dividendos"
          status={getStatus(metrics.indicadores.dividendCoverage, 'dividendCoverage')}
          icon={ShieldCheck}
          colorClass="bg-indigo-50 text-indigo-500"
          borderClass="border-indigo-100"
        />
        <AdvancedKpiCard 
          title="Retenção Estratégica" 
          value={formatValue(metrics.indicadores.retencaoEstrategica * 100, '') + '%'} 
          subtitle="Lucros retidos no negócio"
          status={{ label: metrics.indicadores.retencaoEstrategica > 0.4 ? 'Saudável' : 'Baixo', bgColor: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200' }}
          icon={Database}
          colorClass="bg-purple-50 text-purple-500"
          borderClass="border-purple-100"
        />
        <AdvancedKpiCard 
          title="Distr. sobre Caixa Livre" 
          value={formatValue(metrics.indicadores.distCaixaLivre * 100, '') + '%'} 
          subtitle="Div. / Fluxo Caixa Livre"
          status={getStatus(metrics.indicadores.distCaixaLivre, 'distCaixaLivre')}
          icon={PieChartIcon}
          colorClass="bg-amber-50 text-amber-500"
          borderClass="border-amber-100"
        />
        <AdvancedKpiCard 
          title="Erosão Patrimonial" 
          value={formatValue(metrics.indicadores.erosaoPatrimonial * 100, '') + '%'} 
          subtitle="Prejuízo / Patrimônio Líquido"
          status={getStatus(metrics.indicadores.erosaoPatrimonial, 'erosao')}
          icon={TrendingDown}
          colorClass="bg-rose-50 text-rose-500"
          borderClass="border-rose-100"
        />
        <AdvancedKpiCard 
          title="Taxa Reinvestimento" 
          value={formatValue(metrics.indicadores.taxaReinvest * 100, '') + '%'} 
          subtitle="CAPEX / Lucro Operacional"
          status={{ label: metrics.indicadores.taxaReinvest > 0.15 ? 'Crescimento' : 'Estagnação', bgColor: 'bg-teal-50', textColor: 'text-teal-600', borderColor: 'border-teal-200' }}
          icon={Target}
          colorClass="bg-teal-50 text-teal-500"
          borderClass="border-teal-100"
        />
        <AdvancedKpiCard 
          title="Dependência dos Sócios" 
          value={formatValue(metrics.indicadores.dependSocios * 100, '') + '%'} 
          subtitle="Div. / Caixa Operacional"
          status={{ label: metrics.indicadores.dependSocios < 0.5 ? 'Controlada' : 'Alta', bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200' }}
          icon={AlertTriangle}
          colorClass="bg-orange-50 text-orange-500"
          borderClass="border-orange-100"
        />
      </div>

      {/* Gráficos Analíticos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Dinâmica de Geração e Distribuição</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Lucro Líquido vs FCO vs Dividendos</p>
              </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">{payload[0].payload.year}</p>
                            <div className="space-y-2">
                              {payload.map((p: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-8">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{p.name}</span>
                                  </div>
                                  <span className="text-xs font-black text-slate-900">{formatCurrency(p.value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Lucro" name="Lucro Líquido" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Dividendos" name="Dividendos" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line type="monotone" dataKey="FCO" name="Caixa Operac. (FCO)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <h3 className="text-lg font-black mb-1 relative z-10">Mapeamento de Valor</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8 relative z-10">Qualidade e Sustentabilidade</p>
            
            <div className="space-y-4 flex-1 relative z-10">
               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Qualidade do Lucro</p>
                    <p className="text-sm font-bold text-white">
                      {metrics.indicadores.convLucroCaixa > 1 ? 'Alta' : metrics.indicadores.convLucroCaixa > 0.7 ? 'Moderada' : 'Baixa / Artificial'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <Database size={16} className="text-white/70" />
                  </div>
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacto Patrimonial</p>
                    <p className="text-sm font-bold text-white">
                      {metrics.indicadores.presCapital > 0.95 ? 'Preservado' : metrics.indicadores.presCapital > 0.8 ? 'Sob Pressão' : 'Descapitalizando'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <ShieldCheck size={16} className="text-white/70" />
                  </div>
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cobertura de Prejuízos</p>
                    <p className="text-sm font-bold text-white">
                      {metrics.bases.prejuizoAcumulado === 0 ? 'Sem Prejuízo' : `${formatValue(metrics.indicadores.cobPatrimonialPrejuizo, '')}x o Patrimônio`}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <AlertTriangle size={16} className="text-white/70" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Detalhamento da DLPA (Tabela) */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden mb-10">
        <div className="px-6 md:px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
               <FileText size={16} className="text-blue-500" />
             </div>
             <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detalhamento da DLPA</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Demonstração Contábil</p>
             </div>
          </div>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            Composição de Lucros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="text-left py-4 px-6 md:px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                <th className="text-right py-4 px-6 md:px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { conta: 'Saldo Inicial de Lucros Acumulados', val: metrics.bases.plInicial, isTotal: true },
                { conta: 'Lucro Líquido do Exercício', val: metrics.bases.lucroLiquido, isTotal: false },
                { conta: 'Distribuição (Dividendos / Reservas)', val: -metrics.bases.dividendos, isTotal: false },
                { conta: 'Saldo Final de Lucros Acumulados', val: metrics.bases.plInicial + metrics.bases.lucroLiquido - metrics.bases.dividendos, isTotal: true }
              ].map((row: any, i: number) => (
                <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', row.isTotal ? 'bg-slate-50/30' : '')}>
                  <td className="py-3.5 px-6 md:px-8">
                    <span className={cn('block', row.isTotal ? 'text-slate-900 font-black' : 'text-slate-500 font-medium pl-4')}>
                      {row.conta}
                    </span>
                  </td>
                  <td className={cn("py-3.5 px-6 md:px-8 text-right font-mono font-bold", (row.val || 0) < 0 ? "text-rose-500" : "text-slate-700", row.isTotal && "text-slate-900")}>
                    {formatCurrency(row.val || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
