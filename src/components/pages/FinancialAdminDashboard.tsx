import React, { useMemo, useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, ShieldCheck, Activity, Target, WalletCards, Calculator, BookOpen, PieChart as PieIcon, ArrowUpRight, TrendingDown, Building2, FileText, Clock, CheckCircle2, AlertTriangle, ChevronRight, Loader2, DollarSign, ShieldAlert } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { PageHeader, Semaphore, StatusBadge, MarkdownText } from '../Common';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { getLiquidityIndicators } from '../../lib/master-causal-engine';
import { ExecutivePerspectiveSection } from '../ExecutivePerspectiveSection';
import { useExecutiveAdvisory } from '../../hooks/useExecutiveAdvisory';
import { useLanguage } from '../../contexts/LanguageContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { FULL_MONTH_LABELS } from '../../constants';
import { DashboardSkeleton } from '../ui/skeletons';

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
  const { t } = useLanguage();
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

  const { advisoryReport, loading: advisoryLoading } = useExecutiveAdvisory(clientId, selectedYear, selectedMonth);

  const fluxo30Dias = useMemo(() => {
    if (!cashFlowData?.Fluxo_Diario) return [];
    return cashFlowData.Fluxo_Diario.slice(0, 30);
  }, [cashFlowData]);

  const liquidityIndices = useMemo(() => getLiquidityIndicators({
    liqCorrente: calculatedKPIs.liquidezCorrente,
    liqSeca: calculatedKPIs.liquidezCorrente * 0.8,
    liqImediata: calculatedKPIs.saldoCaixa / (calculatedKPIs.totalLiabilities || 1),
    liqGeral: calculatedKPIs.totalAssets / (calculatedKPIs.totalLiabilities || 1),
    liquidezReal: calculatedKPIs.liquidezCorrente * 0.9,
  } as any, undefined), [calculatedKPIs]);

  const liqCorrenteObj = useMemo(() => liquidityIndices.find(i => i.name === 'Liquidez Corrente') || { status: 'Vermelho' }, [liquidityIndices]);
  const liqStatusMap: Record<string, { text: string; bg: string }> = useMemo(() => ({
    Verde: { text: t('status.excellent'), bg: 'bg-success' },
    Amarelo: { text: t('status.preserved'), bg: 'bg-warning' },
    Vermelho: { text: t('status.critical'), bg: 'bg-destructive' }
  }), [t]);
  const liqInfo = liqStatusMap[liqCorrenteObj.status as keyof typeof liqStatusMap] || liqStatusMap.Vermelho;

  const almObj = useMemo(() => liquidityIndices.find(i => i.name === 'Liquidez Geral') || { status: 'Vermelho' }, [liquidityIndices]);
  const almInfo = useMemo(() => ({
    text: almObj.status === 'Verde' ? t('status.consolidated') : t('status.structuring'),
    color: almObj.status === 'Verde' ? 'text-success' : 'text-warning'
  }), [almObj, t]);

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
      label: t('fin_admin.kpi.total_liquidity'), 
      value: calculatedKPIs.saldoCaixa, 
      isCur: true, 
      icon: WalletCards, 
      color: 'text-emerald-600',
      description: t('fin_admin.desc.total_liquidity')
    },
    { 
      label: t('fin_admin.kpi.op_ebitda'), 
      value: calculatedKPIs.ebitda, 
      isCur: true, 
      icon: Zap, 
      color: 'text-amber-600',
      description: t('fin_admin.desc.op_ebitda')
    },
    { 
      label: t('fin_admin.kpi.net_margin'), 
      value: calculatedKPIs.margemLiquida, 
      suffix: '%', 
      icon: TrendingUp, 
      color: 'text-primary',
      description: t('fin_admin.desc.net_margin')
    },
    { 
      label: t('fin_admin.kpi.debt'), 
      value: (calculatedKPIs.totalLiabilities / (calculatedKPIs.totalAssets || 1)) * 100, 
      suffix: '%', 
      icon: Activity, 
      color: 'text-rose-600',
      description: t('fin_admin.desc.debt')
    }
  ], [calculatedKPIs, t]);

  // 2. Financial Pillars
  const financialPillars = useMemo(() => [
    { label: t('fin_admin.pillars.current_liquidity'), value: calculatedKPIs.liquidezCorrente, suffix: 'x', target: 1.5 },
    { label: t('fin_admin.pillars.asset_turnover'), value: calculatedKPIs.revenue / (calculatedKPIs.totalAssets || 1), suffix: 'x', target: 2.0 },
    { label: t('fin_admin.pillars.working_capital'), value: calculatedKPIs.totalAssets - calculatedKPIs.totalLiabilities, isCur: true, target: 0 },
    { label: t('fin_admin.pillars.ebitda_margin'), value: calculatedKPIs.ebitdaMargin, suffix: '%', target: 20 }
  ], [calculatedKPIs, t]);

  // 3. Administrative Efficiency
  const adminMetrics = useMemo(() => [
    { label: t('fin_admin.admin.overhead'), value: getVal('Overhead'), suffix: '%', status: 'neutral' },
    { label: t('fin_admin.admin.cost_ga'), value: getVal('Custo G&A'), isCur: true, status: 'positive' },
    { label: t('fin_admin.admin.process_efficiency'), value: getVal('Eficiência Proc'), suffix: '%', status: 'positive' },
    { label: t('fin_admin.admin.default_rate'), value: getVal('Inadimplência'), suffix: '%', status: 'negative' }
  ], [dbIndicators, t]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title={t('fin_admin.main.title')}
        subtitle={t('fin_admin.main.subtitle')}
        icon={BarChart3}
        color="executive"
      />

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-background border border-border rounded-md p-1 shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-border">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-body-sm font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-body-sm font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>{t(`common.months.${m}`)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-success-soft text-success rounded-full border border-success/20">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-medium uppercase tracking-widest">{t('fin_admin.status.sync_active')}</span>
           </div>
        </div>
      </div>

      {/* 1. Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, idx) => (
          <ExecutiveMetricCard density="analytical" key={idx}
            label={metric.label}
            value={formatValue(metric.value, '')}
            suffix={metric.isCur ? 'R$' : metric.suffix || ''}
            icon={metric.icon}
            tone="success"
          />
        ))}
      </div>

      {/* 2. Centro de Discernimento Financeiro: Caixa vs. Competência */}
      <div className="bg-executive p-10 md:p-14 rounded-md text-white shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-md bg-white/10 text-secondary border border-white/5">
                  <Calculator size={24} />
                </div>
                <h3 className="text-h2 font-medium tracking-tight">{t('fin_admin.center.title')}</h3>
              </div>
              <p className="text-white/60 font-medium max-w-2xl leading-relaxed">
                {t('fin_admin.center.desc_1')}<span className="text-white">{t('fin_admin.center.desc_2')}</span>{t('fin_admin.center.desc_3')}<span className="text-white">{t('fin_admin.center.desc_4')}</span>{t('fin_admin.center.desc_5')}
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-md border border-white/10 backdrop-blur-md">
              <div className="text-center px-4 border-r border-white/10">
                <p className="text-[9px] font-medium text-white/60 uppercase tracking-widest mb-1">{t('fin_admin.center.liquidity_status')}</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", liqInfo.bg)} />
                  <span className="text-body-sm font-medium uppercase">
                    {liqInfo.text}
                  </span>
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-[9px] font-medium text-white/60 uppercase tracking-widest mb-1">{t('fin_admin.center.alm_maturity')}</p>
                <div className={cn("px-2 py-0.5 rounded text-[10px] uppercase tracking-wider", almInfo.color, "bg-black/20")}>
                   {almInfo.text}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Competência Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={18} className="text-secondary" />
                <h4 className="text-[10px] font-medium text-white/60 uppercase tracking-widest">{t('fin_admin.regime.competence')}</h4>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-md space-y-6 hover:bg-white/[0.08] transition-all">
                <div>
                  <p className="text-[9px] font-medium text-white/50 uppercase tracking-widest mb-1">{t('fin_admin.regime.economic_profit')}</p>
                  <h5 className="text-h2 font-medium text-white">{formatCurrency(calculatedKPIs.netProfit)}</h5>
                  <p className="text-[10px] text-white/40 mt-2 font-medium">{t('fin_admin.regime.economic_efficiency')}</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-medium text-white/60">{t('fin_admin.kpi.net_margin')}</span>
                    <span className="text-body-sm font-medium text-secondary">{calculatedKPIs.margemLiquida.toFixed(2)}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min(calculatedKPIs.margemLiquida * 2, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contrast / Insight Column */}
            <div className="flex flex-col items-center justify-center py-6">
               <div className="w-full h-full bg-white/5 border border-dashed border-white/20 rounded-md p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary animate-pulse">
                    <Activity size={32} />
                  </div>
                  <div>
                    <h5 className="text-body-md font-medium text-white mb-2">{t('fin_admin.efficiency_gap.title')}</h5>
                    <p className="text-[10px] font-medium text-secondary uppercase tracking-widest">{t('fin_admin.efficiency_gap.subtitle')}</p>
                  </div>
                  <div className="text-h2 font-medium text-white">
                    {calculatedKPIs.netProfit > 0 ? ((calculatedKPIs.saldoCaixa / calculatedKPIs.netProfit) * 100).toFixed(2) : '0'}%
                  </div>
                  <p className="text-body-sm text-white/60 font-medium leading-relaxed italic">
                    {calculatedKPIs.saldoCaixa < calculatedKPIs.netProfit 
                      ? t('fin_admin.efficiency_gap.warning')
                      : t('fin_admin.efficiency_gap.excellent')}
                  </p>
               </div>
            </div>

            {/* Caixa Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <WalletCards size={18} className="text-success" />
                <h4 className="text-[10px] font-medium text-white/60 uppercase tracking-widest">{t('fin_admin.regime.cash')}</h4>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-md space-y-6 hover:bg-white/[0.08] transition-all">
                <div>
                  <p className="text-[9px] font-medium text-white/50 uppercase tracking-widest mb-1">{t('fin_admin.regime.immediate_liquidity')}</p>
                  <h5 className="text-h2 font-medium text-success">{formatCurrency(calculatedKPIs.saldoCaixa)}</h5>
                  <p className="text-[10px] text-white/40 mt-2 font-medium">{t('fin_admin.regime.firepower')}</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-medium text-white/60">{t('fin_admin.regime.short_term_coverage')}</span>
                    <span className="text-body-sm font-medium text-success">{calculatedKPIs.liquidezCorrente.toFixed(2)}x</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full">
                    <div className="h-full bg-success rounded-full" style={{ width: `${Math.min(calculatedKPIs.liquidezCorrente * 40, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 2. Financial Pillars - Left Column */}
        <div className="xl:col-span-2 space-y-8">
          <div className="card-premium relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-h3 font-medium text-foreground tracking-tight mb-1">{t('fin_admin.pillars.title')}</h3>
                <p className="text-body-sm text-muted-foreground font-medium">{t('fin_admin.pillars.subtitle')}</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 rounded-md bg-surface-container text-muted-foreground hover:text-primary transition-colors">
                    <TrendingUp size={20} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {financialPillars.map((pillar, i) => (
                <div key={i} className="space-y-4 p-6 rounded-md bg-surface-container/50 border border-border group hover:bg-background hover:shadow-md transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{pillar.label}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      pillar.value >= pillar.target ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                    )}>
                      {pillar.value >= pillar.target ? t('fin_admin.pillars.above_target') : t('fin_admin.pillars.below_target')}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-h2 font-medium text-foreground">
                      {formatValue(pillar.value, pillar.isCur ? 'R$' : pillar.suffix || '')}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      {t('fin_admin.pillars.target')}: {formatValue(pillar.target, pillar.isCur ? 'R$' : pillar.suffix || '')}
                    </span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden border border-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((pillar.value / (pillar.target || 1)) * 100, 100)}%` }}
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        pillar.value >= pillar.target ? "bg-success" : "bg-warning"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue vs Expenses Chart */}
          <div className="card-premium">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-h3 font-medium text-foreground tracking-tight flex items-center gap-3">
                <Activity className="text-secondary" /> {t('fin_admin.flow.title')}
              </h3>
              <div className="flex items-center gap-6 text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-foreground" /> {t('fin_admin.flow.revenue')}
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-secondary" /> {t('fin_admin.flow.ebitda')}
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={evolData}>
                    <defs>
                      <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)', fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)', fontWeight: 500 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)', boxShadow: 'var(--shadow-floating)', fontSize: '12px' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area type="monotone" dataKey="Receita" stroke="var(--color-primary)" fill="url(#colorRec)" fillOpacity={1} strokeWidth={3} />
                    <Area type="monotone" dataKey="EBITDA" stroke="var(--color-secondary)" fill="url(#colorEbitda)" fillOpacity={1} strokeWidth={3} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Administrative & Accounting - Right Column */}
        <div className="space-y-8">
          {/* Administrative Efficiency */}
          <div className="bg-executive rounded-md p-10 text-white shadow-premium relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center text-white">
                  <Building2 size={24} />
                </div>
                <div>
                   <h3 className="text-body-md font-medium tracking-tight leading-none mb-1">{t('fin_admin.admin.title')}</h3>
                   <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest">{t('fin_admin.admin.subtitle')}</p>
                </div>
              </div>

              <div className="space-y-6">
                {adminMetrics.map((metric, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">{metric.label}</p>
                      <p className="text-h3 font-medium">{formatValue(metric.value, metric.isCur ? 'R$' : metric.suffix || '')}</p>
                    </div>
                    <div className={cn(
                      "w-2 h-10 rounded-full",
                      metric.status === 'positive' ? "bg-success shadow-md" : 
                      metric.status === 'negative' ? "bg-destructive shadow-md" : "bg-warning shadow-md"
                    )} />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate?.('administrativa_indicadores')}
                className="w-full py-4 bg-white/10 border border-white/20 rounded-md text-[10px] font-medium uppercase tracking-widest hover:bg-white hover:text-executive transition-all flex items-center justify-center gap-2"
              >
                {t('fin_admin.admin.btn_detail')} <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Accounting Accuracy */}
          <div className="card-premium">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center text-primary">
                  <Calculator size={24} />
                </div>
                <div>
                   <h3 className="text-body-md font-medium text-foreground tracking-tight leading-none mb-1">{t('fin_admin.accounting.title')}</h3>
                   <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{t('fin_admin.accounting.subtitle')}</p>
                </div>
             </div>

             <div className="space-y-6 mb-8">
                <div className="p-5 rounded-md bg-surface-container border border-border">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{t('fin_admin.accounting.reconciled_balance')}</span>
                      <span className="text-[10px] font-medium text-success uppercase tracking-widest">98.5%</span>
                   </div>
                   <div className="h-1.5 bg-background rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '98.5%' }}
                        className="h-full bg-success"
                      />
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-md bg-warning-soft flex items-center justify-center text-warning shrink-0">
                      <AlertTriangle size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">{t('fin_admin.accounting.alerts')}</p>
                      <p className="text-body-sm font-medium text-foreground leading-relaxed">{t('fin_admin.accounting.alerts_desc_1')}{mappingGaps}{t('fin_admin.accounting.alerts_desc_2')}</p>
                      <button 
                        onClick={() => onNavigate?.('plano_contas')}
                        className="text-[9px] font-medium text-secondary uppercase tracking-widest mt-2 hover:underline"
                      >
                        {t('fin_admin.accounting.fix_mapping')}
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onNavigate?.('dre')}
                  className="flex flex-col items-center gap-2 p-4 rounded-md bg-surface-container border border-border hover:border-secondary/20 transition-all group"
                >
                   <FileText size={20} className="text-muted-foreground group-hover:text-secondary" />
                   <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">{t('fin_admin.accounting.btn_dre')}</span>
                </button>
                <button 
                  onClick={() => onNavigate?.('bp')}
                  className="flex flex-col items-center gap-2 p-4 rounded-md bg-surface-container border border-border hover:border-secondary/20 transition-all group"
                >
                   <Building2 size={20} className="text-muted-foreground group-hover:text-secondary" />
                   <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">{t('fin_admin.accounting.btn_bp')}</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      <ExecutivePerspectiveSection 
        report={advisoryReport} 
        loading={advisoryLoading}
        className="mt-12"
      />
    </div>
  );
}
