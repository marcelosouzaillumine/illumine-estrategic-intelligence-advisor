import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Target, 
  WalletCards, 
  Calculator,
  BookOpen,
  PieChart as PieIcon,
  ArrowUpRight,
  TrendingDown,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Loader2,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { PageHeader, Semaphore, StatusBadge, MarkdownText } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { GovernancePerspectiveSection } from '../GovernancePerspectiveSection';
import { generateGovernanceParecer } from '../../services/governanceAiService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { FULL_MONTH_LABELS } from '../../constants';

interface FinancialAdminDashboardProps {
  clientId: string;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  onNavigate?: (page: any) => void;
}

export function FinancialAdminDashboard({ 
  clientId, 
  selectedMonth, 
  setSelectedMonth, 
  selectedYear, 
  setSelectedYear,
  onNavigate
}: FinancialAdminDashboardProps) {
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [allYearIndicators, setAllYearIndicators] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any>(null);
  const [mappingGaps, setMappingGaps] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Real-time calculated KPIs from financial entries, positions, assets, etc.
  const { kpis: calculatedKPIs } = useRealIndicatorData(clientId, selectedMonth, selectedYear);

  useEffect(() => {
    if (!clientId) return;
    
    setLoading(true);
    
    // Listen for all indicators of the client to build the chart
    const qAll = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId)
    );
    
    // Listen for cash flow projections
    const qCash = query(
      collection(db, 'cash_flows'),
      where('clientId', '==', clientId)
    );

    const qAccs = query(
      collection(db, 'account_plans'),
      where('clientId', '==', clientId),
      where('planType', '==', 'accounting')
    );
    
    const unsubs = [
      onSnapshot(qAll, (snapshot) => {
        const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllYearIndicators(allData);
        
        // Filter current period indicators
        const current = allData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
        setDbIndicators(current);
        setLoading(false);
      }),
      onSnapshot(qCash, (snapshot) => {
        if (!snapshot.empty) {
          setCashFlowData(snapshot.docs[0].data());
        } else {
          setCashFlowData(null);
        }
      }),
      onSnapshot(qAccs, (snapshot) => {
        const accs = snapshot.docs.map(doc => doc.data());
        const total = accs.length;
        const mapped = accs.filter(a => a.kpiMapping).length;
        setMappingGaps(total - mapped);
      })
    ];
    
    return () => unsubs.forEach(unsub => unsub());
  }, [clientId, selectedYear, selectedMonth]);

  const [isGeneratingParecer, setIsGeneratingParecer] = useState(false);
  const [parecer, setParecer] = useState<string | null>(null);

  const handleGenerateParecer = async () => {
    setIsGeneratingParecer(true);
    try {
      const kpis = {
        // Aspectos Contábeis
        'Receita Bruta': formatCurrency(calculatedKPIs.revenue),
        'EBITDA': formatCurrency(calculatedKPIs.ebitda),
        'Lucro Líquido': formatCurrency(calculatedKPIs.netProfit),
        'Margem Líquida': `${calculatedKPIs.margemLiquida.toFixed(1)}%`,
        
        // Aspectos Financeiros (ALM/Caixa)
        'Saldo de Caixa Real': formatCurrency(calculatedKPIs.saldoCaixa),
        'Liquidez Corrente': calculatedKPIs.liquidezCorrente.toFixed(2),
        'Solvência ALM (Ativo/Passivo)': `${(calculatedKPIs.totalAssets / (calculatedKPIs.totalLiabilities || 1)).toFixed(2)}x`,
        'Exposição de Risco de Caixa': `${((calculatedKPIs.totalLiabilities / (calculatedKPIs.saldoCaixa || 1)) * 100).toFixed(1)}%`,
        
        // Aspectos Administrativos/Governança
        'Gargalos de Mapeamento Contábil': `${mappingGaps} contas sem classificação`,
        'Endividamento Geral': `${((calculatedKPIs.totalLiabilities / (calculatedKPIs.totalAssets || 1)) * 100).toFixed(1)}%`
      };

      const topPrinciples = GOVERNANCE_PRINCIPLES
        .filter(p => p.axis === 'Gestão Administrativa e Financeira')
        .map(p => p.name);

      const scenarios = GOVERNANCE_PRINCIPLES
        .filter(p => p.axis === 'Gestão Administrativa e Financeira' && p.situationalScenario)
        .map(p => p.situationalScenario) as string[];

      const result = await generateGovernanceParecer({
        clientName: 'Sua Empresa',
        industry: 'Geral',
        metrics: kpis,
        topPrinciples: topPrinciples,
        scenarios: scenarios
      });
      setParecer(result);
    } catch (err) {
      console.error('Erro ao gerar parecer:', err);
    } finally {
      setIsGeneratingParecer(false);
    }
  };

  const fluxo30Dias = useMemo(() => {
    if (!cashFlowData?.Fluxo_Diario) return [];
    return cashFlowData.Fluxo_Diario.slice(0, 30);
  }, [cashFlowData]);

  const flatMetrics = useMemo(() => {
    return {
      'Liquidez Corrente': calculatedKPIs.liquidezCorrente,
      'EBITDA': calculatedKPIs.ebitda,
      'Margem Líquida': calculatedKPIs.margemLiquida,
      'Margem EBITDA': calculatedKPIs.ebitdaMargin,
      'Endividamento': (calculatedKPIs.totalLiabilities / (calculatedKPIs.totalAssets || 1)) * 100,
      'Solvência ALM': calculatedKPIs.totalAssets / (calculatedKPIs.totalLiabilities || 1),
      'Saldo de Caixa': calculatedKPIs.saldoCaixa,
      'Exposição de Risco': (calculatedKPIs.totalLiabilities / (calculatedKPIs.saldoCaixa || 1)) * 100
    };
  }, [calculatedKPIs]);

  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, 'Gestão Administrativa e Financeira');
  }, [flatMetrics]);

  const axisPrinciples = useMemo(() => {
    return GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Gestão Administrativa e Financeira');
  }, []);

  const evolData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(selectedYear, selectedMonth - 1 - (11 - i), 1);
      return { m: d.getMonth() + 1, y: d.getFullYear() };
    });
    
    const monthNames = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return months.map(({ m, y }) => {
      const monthIndicators = allYearIndicators.filter((i: any) => i.mes === m && i.ano === y);
      const rec = monthIndicators.find((i: any) => i.ind === 'Receita Líquida')?.val || 0;
      const ebitda = monthIndicators.find((i: any) => i.ind === 'EBITDA')?.val || 0;
      const profit = monthIndicators.find((i: any) => i.ind === 'Lucro Líquido')?.val || 0;
      
      return {
        name: `${monthNames[m]}/${y.toString().slice(-2)}`,
        Receita: rec,
        EBITDA: ebitda,
        Lucro: profit
      };
    });
  }, [allYearIndicators, selectedMonth, selectedYear]);

  const getIndicator = (name: string) => {
    return dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
  };

  const getVal = (name: string, fallback: number = 0) => {
    const ind = getIndicator(name);
    return ind ? ind.val : fallback;
  };

  // 1. Executive Summary Metrics
  const summaryMetrics = useMemo(() => [
    { 
      label: 'Liquidez Total', 
      value: calculatedKPIs.saldoCaixa, 
      isCur: true, 
      icon: WalletCards, 
      color: 'text-emerald-600',
      description: 'Caixa + Bancos + Ativos Imediatos'
    },
    { 
      label: 'EBITDA Operacional', 
      value: calculatedKPIs.ebitda, 
      isCur: true, 
      icon: Zap, 
      color: 'text-amber-600',
      description: 'Geração de caixa operacional'
    },
    { 
      label: 'Margem Líquida', 
      value: calculatedKPIs.margemLiquida, 
      suffix: '%', 
      icon: TrendingUp, 
      color: 'text-indigo-600',
      description: 'Lucratividade final sobre a receita'
    },
    { 
      label: 'Endividamento', 
      value: (calculatedKPIs.totalLiabilities / (calculatedKPIs.totalAssets || 1)) * 100, 
      suffix: '%', 
      icon: Activity, 
      color: 'text-rose-600',
      description: 'Relação Passivo / Ativo Total'
    }
  ], [calculatedKPIs]);

  // 2. Financial Pillars
  const financialPillars = useMemo(() => [
    { label: 'Liquidez Corrente', value: calculatedKPIs.liquidezCorrente, suffix: 'x', target: 1.5 },
    { label: 'Giro do Ativo', value: calculatedKPIs.revenue / (calculatedKPIs.totalAssets || 1), suffix: 'x', target: 2.0 },
    { label: 'Capital de Giro', value: calculatedKPIs.totalAssets - calculatedKPIs.totalLiabilities, isCur: true, target: 0 },
    { label: 'Margem EBITDA', value: calculatedKPIs.ebitdaMargin, suffix: '%', target: 20 }
  ], [calculatedKPIs]);

  // 3. Administrative Efficiency
  const adminMetrics = useMemo(() => [
    { label: 'Overhead Administrativo', value: getVal('Overhead'), suffix: '%', status: 'neutral' },
    { label: 'Custo G&A / Colab.', value: getVal('Custo G&A'), isCur: true, status: 'positive' },
    { label: 'Eficiência Processual', value: getVal('Eficiência Proc'), suffix: '%', status: 'positive' },
    { label: 'Taxa de Inadimplência', value: getVal('Inadimplência'), suffix: '%', status: 'negative' }
  ], [dbIndicators]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] animate-pulse">
        <Loader2 size={48} className="text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Reconstruindo Inteligência Financeira...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Dashboard Adm Fin"
        subtitle="Monitoramento integrado de performance econômica, saúde financeira e eficiência administrativa."
        icon={BarChart3}
        color="bg-slate-900"
      />

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-slate-100">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sincronização Ativa</span>
           </div>
        </div>
      </div>

      {/* 1. Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
              <metric.icon size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-primary/10", metric.color)}>
                  <metric.icon size={22} />
                </div>
                <StatusBadge status="Verde" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                {formatValue(metric.value, metric.isCur ? 'R$' : metric.suffix || '')}
              </h3>
              <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tight">{metric.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. ALM & Cash Flow 30D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gestão de Ativos e Passivos (ALM) */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Asset & Liability Management (ALM)</h3>
              <p className="text-xs text-slate-500 font-medium">Equilíbrio entre recursos disponíveis e obrigações.</p>
            </div>
            <ShieldCheck className="text-indigo-600" size={24} />
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Total de Ativos</p>
                <h4 className="text-2xl font-black text-emerald-900">{formatCurrency(calculatedKPIs.totalAssets)}</h4>
                <div className="mt-4 space-y-2">
                   <div className="flex justify-between text-[9px] font-bold text-emerald-600 uppercase">
                      <span>Liquidez Imediata</span>
                      <span>{formatCurrency(calculatedKPIs.saldoCaixa)}</span>
                   </div>
                   <div className="h-1 bg-white rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(calculatedKPIs.saldoCaixa / (calculatedKPIs.totalAssets || 1)) * 100}%` }} />
                   </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100">
                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-2">Total de Passivos</p>
                <h4 className="text-2xl font-black text-rose-900">{formatCurrency(calculatedKPIs.totalLiabilities)}</h4>
                <div className="mt-4 space-y-2">
                   <div className="flex justify-between text-[9px] font-bold text-rose-600 uppercase">
                      <span>Exigível Imediato</span>
                      <span>{formatCurrency(calculatedKPIs.totalLiabilities)}</span>
                   </div>
                   <div className="h-1 bg-white rounded-full">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }} />
                   </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Índice de Solvência (ALM)</p>
                  <h4 className="text-2xl font-black">{((calculatedKPIs.totalAssets / (calculatedKPIs.totalLiabilities || 1))).toFixed(2)}x</h4>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status de Cobertura</p>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                    (calculatedKPIs.totalAssets / (calculatedKPIs.totalLiabilities || 1)) > 1 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  )}>
                    {(calculatedKPIs.totalAssets / (calculatedKPIs.totalLiabilities || 1)) > 1 ? 'Seguro' : 'Risco de Liquidez'}
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Fluxo de Caixa 30 Dias */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Fluxo de Caixa (Próximos 30 Dias)</h3>
              <p className="text-xs text-slate-500 font-medium">Projeção diária de entradas e saídas esperadas.</p>
            </div>
            <Activity className="text-secondary" size={24} />
          </div>

          <div className="h-[200px] w-full mb-8">
            {fluxo30Dias.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={fluxo30Dias}>
                    <defs>
                      <linearGradient id="colorSaldo30" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff8552" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ff8552" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="Data" 
                      hide
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number) => [formatCurrency(val), 'Saldo Projetado']}
                    />
                    <Area type="monotone" dataKey="Saldo Final" stroke="#ff8552" fill="url(#colorSaldo30)" fillOpacity={1} strokeWidth={3} />
                 </AreaChart>
               </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Calculator size={32} className="text-slate-300 mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase">Sem projeção gerada</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Média de Entradas (30d)</p>
                <p className="text-sm font-black text-emerald-600">
                   {fluxo30Dias.length > 0 ? formatCurrency(fluxo30Dias.reduce((acc: number, r: any) => acc + (Number(r.Entradas) || 0), 0) / 30) : 'R$ 0,00'}
                </p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Média de Saídas (30d)</p>
                <p className="text-sm font-black text-rose-600">
                   {fluxo30Dias.length > 0 ? formatCurrency(fluxo30Dias.reduce((acc: number, r: any) => acc + (Number(r["Saídas"]) || 0), 0) / 30) : 'R$ 0,00'}
                </p>
             </div>
          </div>
          
          <button 
            onClick={() => onNavigate?.('caixa')}
            className="w-full mt-6 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Gerenciar Fluxo Detalhado <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Financial Pillars - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Pilares de Performance Financeira</h3>
                <p className="text-xs text-slate-500 font-medium">Indicadores calculados em tempo real com base no plano de contas.</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-colors">
                    <TrendingUp size={20} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {financialPillars.map((pillar, i) => (
                <div key={i} className="space-y-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pillar.label}</span>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      pillar.value >= pillar.target ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {pillar.value >= pillar.target ? 'Acima da Meta' : 'Abaixo da Meta'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {formatValue(pillar.value, pillar.isCur ? 'R$' : pillar.suffix || '')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Meta: {formatValue(pillar.target, pillar.isCur ? 'R$' : pillar.suffix || '')}
                    </span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((pillar.value / (pillar.target || 1)) * 100, 100)}%` }}
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        pillar.value >= pillar.target ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue vs Expenses Chart */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Activity className="text-indigo-600" /> Fluxo de Performance Mensal
              </h3>
              <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Receita
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> EBITDA
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={evolData}>
                    <defs>
                      <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area type="monotone" dataKey="Receita" stroke="#0f172a" fill="url(#colorRec)" fillOpacity={1} strokeWidth={4} />
                    <Area type="monotone" dataKey="EBITDA" stroke="#6366f1" fill="url(#colorEbitda)" fillOpacity={1} strokeWidth={4} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Administrative & Accounting - Right Column */}
        <div className="space-y-8">
          {/* Administrative Efficiency */}
          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Building2 size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight leading-none mb-1">Eficiência Administrativa</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Back-office & Suporte</p>
                </div>
              </div>

              <div className="space-y-6">
                {adminMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{metric.label}</p>
                      <p className="text-xl font-black">{formatValue(metric.value, metric.isCur ? 'R$' : metric.suffix || '')}</p>
                    </div>
                    <div className={cn(
                      "w-2 h-10 rounded-full",
                      metric.status === 'positive' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : 
                      metric.status === 'negative' ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    )} />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate?.('administrativa_indicadores')}
                className="w-full py-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2"
              >
                Detalhar Operação Administrativa <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Accounting Accuracy */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Calculator size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Conformidade Contábil</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Integridade de Dados</p>
                </div>
             </div>

             <div className="space-y-6 mb-8">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Conciliado</span>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">98.5%</span>
                   </div>
                   <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '98.5%' }}
                        className="h-full bg-emerald-500"
                      />
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <AlertTriangle size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alertas Contábeis</p>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">Existem {mappingGaps} categorias no plano de contas sem mapeamento de KPIs.</p>
                      <button 
                        onClick={() => onNavigate?.('plano_contas')}
                        className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-2 hover:underline"
                      >
                        Corrigir Mapeamento
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onNavigate?.('dre')}
                  className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                   <FileText size={20} className="text-slate-400 group-hover:text-indigo-600" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">DRE Contábil</span>
                </button>
                <button 
                  onClick={() => onNavigate?.('bp')}
                  className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                   <Building2 size={20} className="text-slate-400 group-hover:text-indigo-600" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Balanço</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      <GovernancePerspectiveSection 
        axis="Gestão Administrativa e Financeira"
        metrics={flatMetrics}
        triggeredRules={triggeredRules}
        principles={axisPrinciples}
        aiAnalysis={parecer}
        isGeneratingAi={isGeneratingParecer}
        onGenerateAi={handleGenerateParecer}
        className="mt-12"
      />
    </div>
  );
}
