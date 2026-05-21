import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Target, 
  LayoutDashboard,
  Users,
  Globe,
  ShoppingBag,
  Lightbulb,
  Loader2,
  Sparkles,
  ArrowRight,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  XAxis,
  YAxis,
  AreaChart,
  Area
} from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardSkeleton } from '../ui/skeletons';
import { PageHeader, Semaphore, KpiCard, KpiValue, ControlBar } from '../Common';
import { formatCurrency, formatValue, cn, getThemeColors } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { FULL_MONTH_LABELS, MONTH_LABELS } from '../../constants';
import { Button } from '../ui/button';

const AXIS_DATA = [
  { 
    id: 'governanca_estrategica', 
    name: 'Governança Corporativa', 
    icon: ShieldCheck, 
    color: 'bg-slate-900', 
    mainKpi: 'Maturidade de Governança',
    suffix: '%' 
  },
  { 
    id: 'dashboard_cultura', 
    name: 'Cultura Organizacional', 
    icon: Users, 
    color: 'bg-purple-900', 
    mainKpi: 'eNPS',
    suffix: '' 
  },
  { 
    id: 'dashboard_gestao', 
    name: 'Administração e Finanças', 
    icon: BarChartIcon, 
    color: 'bg-slate-800', 
    mainKpi: 'Margem EBITDA',
    suffix: '%' 
  },
  { 
    id: 'dashboard_inovacao', 
    name: 'Gestão de Inovação', 
    icon: Lightbulb, 
    color: 'bg-cyan-900', 
    mainKpi: 'Índice de Inovação',
    suffix: '%' 
  },
  { 
    id: 'dashboard_marketing', 
    name: 'Gestão de Marketing', 
    icon: Globe, 
    color: 'bg-blue-900', 
    mainKpi: 'ROI de Marketing',
    suffix: 'x' 
  },
  { 
    id: 'dashboard_comercial', 
    name: 'Gestão Comercial', 
    icon: ShoppingBag, 
    color: 'bg-emerald-900', 
    mainKpi: 'Taxa de Conversão',
    suffix: '%' 
  },
  { 
    id: 'dashboard_operacional', 
    name: 'Gestão Operacional', 
    icon: Activity, 
    color: 'bg-slate-700', 
    mainKpi: 'OEE (Eficiência)',
    suffix: '%' 
  },
];

const AxisCard = ({ axis, value, status, trend, onClick }: any) => {
  return (
    <KpiCard
      title={axis.name}
      value={formatValue(value, '')}
      suffix={axis.suffix}
      icon={axis.icon}
      status={status || (value === 0 ? 'Pendente' : 'Verde')}
      trend={trend || (value === 0 ? 'Pendente' : 'Estável')}
      onClick={onClick}
      className="group"
      noScroll={true}
    />
  );
};

export function DashboardPage({ 
  selectedClient, 
  selectedMonth, 
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onNavigate
}: any) {
  const [periodMode, setPeriodMode] = useState<'mensal' | 'anual'>('mensal');
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [allYearIndicators, setAllYearIndicators] = useState<any[]>([]);
  const [allFinancialEntries, setAllFinancialEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [, setThemeTrigger] = useState(0);
  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();

  const { kpis: calculatedKPIs } = useRealIndicatorData(selectedClient, periodMode === 'anual' ? 0 : selectedMonth, selectedYear);

  useEffect(() => {
    if (!selectedClient) return;

    setLoading(true);
    const qAll = query(
      collection(db, 'indicators'),
      where('clientId', '==', selectedClient)
    );

    const unsubAll = onSnapshot(qAll, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllYearIndicators(allData);
      
      let current: any[] = [];
      if (periodMode === 'anual') {
        const yearData = allData.filter((i: any) => i.ano === selectedYear);
        const groupsMapByName: Record<string, any[]> = {};
        yearData.forEach((ind: any) => {
          const name = ind.ind || '';
          if (!groupsMapByName[name]) groupsMapByName[name] = [];
          groupsMapByName[name].push(ind);
        });

        current = Object.entries(groupsMapByName).map(([name, docs]) => {
          const lowerName = name.toLowerCase();
          const shouldSum = lowerName.includes('faturamento') ||
            (lowerName.includes('ebitda') && !lowerName.includes('margem')) ||
            (lowerName.includes('lucro') && !lowerName.includes('margem')) ||
            (lowerName.includes('receita') && !lowerName.includes('margem')) ||
            lowerName.includes('fluxo de caixa');

          let val = 0;
          if (shouldSum) {
            val = docs.reduce((sum, doc) => sum + (Number(doc.val) || 0), 0);
          } else {
            val = docs.reduce((sum, doc) => sum + (Number(doc.val) || 0), 0) / docs.length;
          }

          const semScore = docs.reduce((sum, doc) => {
            const s = doc.sem;
            if (s === 'Verde') return sum + 3;
            if (s === 'Amarelo') return sum + 2;
            return sum + 1;
          }, 0) / docs.length;

          const sem = semScore >= 2.5 ? 'Verde' : semScore >= 1.5 ? 'Amarelo' : 'Vermelho';

          return { ...docs[0], val, sem };
        });
      } else {
        current = allData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
      }
      setDbIndicators(current);
      setLoading(false);
    });

    const qEntries = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', selectedClient)
    );

    const unsubEntries = onSnapshot(qEntries, (snapshot) => {
      const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllFinancialEntries(entriesData);
    });

    return () => {
      unsubAll();
      unsubEntries();
    };
  }, [selectedClient, selectedYear, selectedMonth, periodMode]);

  const getIndicatorValue = useCallback((name: string) => {
    const ind = dbIndicators.find((i: any) => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    if (ind) return ind.val;

    // A. Real-time heuristics fallback if db indicators don't exist
    if (name === 'Receita Líquida' || name === 'Faturamento Bruto') return calculatedKPIs.revenue;
    if (name === 'EBITDA') return calculatedKPIs.ebitda;
    if (name === 'Lucro Líquido') return calculatedKPIs.netProfit;
    if (name === 'Saldo em Caixa') return calculatedKPIs.saldoCaixa;
    if (name === 'Gestão de Ativos') return calculatedKPIs.totalAssets;
    if (name === 'Gestão de Passivos') return calculatedKPIs.totalLiabilities;
    if (name === 'Liquidez Corrente') return calculatedKPIs.liquidezCorrente;
    if (name === 'Margem EBITDA') return calculatedKPIs.ebitdaMargin;
    if (name === 'Margem Líquida') return calculatedKPIs.margemLiquida;

    return 0;
  }, [dbIndicators, calculatedKPIs]);

  const getIndicatorTrend = useCallback((name: string) => {
    const currentInd = dbIndicators.find((i: any) => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    const currentValue = currentInd ? currentInd.val : getIndicatorValue(name);
    
    if (currentValue === 0) return 'Pendente';

    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = selectedYear - 1;
    }

    const prevInd = allYearIndicators.find(
      (i: any) => (i.ind === name || i.ind?.toLowerCase() === name.toLowerCase()) &&
                  i.mes === prevMonth &&
                  i.ano === prevYear
    );

    if (!prevInd) return 'Estável';

    const diff = currentValue - prevInd.val;
    if (diff > 0.001) return 'Em Alta';
    if (diff < -0.001) return 'Em Queda';
    return 'Estável';
  }, [dbIndicators, allYearIndicators, selectedMonth, selectedYear, getIndicatorValue]);

  const getIndicatorStatus = useCallback((name: string) => {
    const ind = dbIndicators.find((i: any) => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    if (ind?.sem) return ind.sem;

    const trend = getIndicatorTrend(name);
    if (trend === 'Pendente') return 'Pendente';
    if (trend === 'Em Queda') return 'Vermelho';
    if (trend === 'Em Alta') return 'Verde';
    return 'Verde';
  }, [dbIndicators, getIndicatorTrend]);

  const evolData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(selectedYear, selectedMonth - 1 - (11 - i), 1);
      return { m: d.getMonth() + 1, y: d.getFullYear() };
    });

    return months.map(({ m, y }) => {
      // 1. Try to find in indicators collection
      const monthIndicators = allYearIndicators.filter((i: any) => i.mes === m && i.ano === y);
      let rec = monthIndicators.find((i: any) => i.ind === 'Receita Líquida' || i.ind === 'Faturamento Bruto')?.val || 0;
      let ebitda = monthIndicators.find((i: any) => i.ind === 'EBITDA')?.val || 0;

      // 2. If indicators are empty, fallback to aggregated financial_entries
      if (rec === 0 && ebitda === 0 && allFinancialEntries.length > 0) {
        const monthEntries = allFinancialEntries.filter(
          (e: any) => (Number(e.month) === m || Number(e.mes) === m) && (Number(e.year) === y || Number(e.ano) === y)
        );
        
        let flattenedEntries: any[] = [];
        monthEntries.forEach((doc: any) => {
          if (Array.isArray(doc.data)) {
            flattenedEntries.push(...doc.data);
          } else {
            flattenedEntries.push(doc);
          }
        });

        rec = flattenedEntries
          .filter((e: any) => {
            const name = (e.category || e.conta || '').toLowerCase();
            return name === 'receita líquida' || name === 'receita operacional líquida' || name === 'faturamento bruto' || name === 'faturamento' || name === 'receita de vendas';
          })
          .reduce((sum: number, e: any) => sum + (Number(e.value || e.valor || e.val) || 0), 0);
          
        ebitda = flattenedEntries
          .filter((e: any) => {
            const name = (e.category || e.conta || '').toLowerCase();
            return name === 'ebitda' || name.includes('ebitda') || name === 'lajida';
          })
          .reduce((sum: number, e: any) => sum + (Number(e.value || e.valor || e.val) || 0), 0);
      }
      
      return {
        name: `${MONTH_LABELS[m]}/${y.toString().slice(-2)}`,
        Receita: rec,
        EBITDA: ebitda,
      };
    });
  }, [allYearIndicators, allFinancialEntries, selectedMonth, selectedYear]);

  if (!selectedClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-executive-fade bg-background border border-border rounded-md p-20 text-center w-full">
         <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-secondary shadow-xl relative">
            <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 animate-pulse" />
            <LayoutDashboard size={48} className="relative z-10 animate-pulse" />
         </div>
         <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
            <h2 className="text-h2 font-medium text-foreground tracking-tight">Selecione uma Empresa</h2>
            <p className="text-muted-foreground w-full max-w-2xl mx-auto font-medium leading-relaxed">
              Por favor, selecione uma empresa no seletor de cliente ativo no topo da tela para visualizar o painel estratégico de performance.
            </p>
         </div>
      </div>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-16 pb-32 animate-executive-fade">
      <PageHeader 
        title="Monitoramento Estratégico de Performance"
        subtitle="Visão centralizada dos Pilares de Gestão fundamentais para a perenidade e valor de mercado."
        icon={LayoutDashboard}
        color="executive"
      />

      {/* Control Bar */}
      <ControlBar 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        periodMode={periodMode}
        setPeriodMode={setPeriodMode}
        showStatusBadge={true}
        statusBadgeLabel="Monitoramento Ativo"
      />

      {/* Strategic Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Receita Líquida', value: getIndicatorValue('Receita Líquida'), key: 'Receita Líquida', isCur: true, icon: TrendingUp },
          { label: 'EBITDA', value: getIndicatorValue('EBITDA'), key: 'EBITDA', isCur: true, icon: Zap },
          { label: 'Lucro Líquido', value: getIndicatorValue('Lucro Líquido'), key: 'Lucro Líquido', isCur: true, icon: PieChartIcon },
          { label: 'Valor Estimado', value: (getIndicatorValue('EBITDA') * 12 * 6.5), key: 'EBITDA', isCur: true, icon: Target, highlight: true },
        ].map((item, idx) => (
          <KpiCard 
            key={idx}
            title={item.label}
            value={formatValue(item.value, item.isCur ? 'R$' : '')}
            icon={item.icon}
            highlight={item.highlight}
            status={getIndicatorStatus(item.key) || (item.value === 0 ? 'Pendente' : 'Verde')}
            trend={getIndicatorTrend(item.key)}
            noScroll={true}
          />
        ))}
      </div>

      {/* The Pilares de Gestão Hub */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-medium text-foreground flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border flex items-center justify-center text-secondary">
                <LayoutDashboard size={24} />
              </div>
              Hub de Monitoramento dos Pilares de Gestão
            </h2>
            <p className="text-body-sm font-medium text-muted-foreground ml-16">Visão sistêmica e integrada de todos os pilares de gestão.</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent mx-12 hidden lg:block"></div>
          <div className="flex items-center gap-2 px-5 py-2 bg-secondary/5 border border-secondary/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Visão Executiva</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {AXIS_DATA.map((axis) => (
            <AxisCard 
              key={axis.id} 
              axis={axis} 
              value={getIndicatorValue(axis.mainKpi)} 
              status={getIndicatorStatus(axis.mainKpi)}
              trend={getIndicatorTrend(axis.mainKpi)}
              onClick={() => onNavigate(axis.id)}
            />
          ))}
        </div>
      </div>

      {/* Mid Section: Charts and AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card p-12 rounded-[48px] border border-border shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-medium text-foreground tracking-tight">Evolução de Performance Consolidada</h3>
                <p className="text-body-sm text-muted-foreground font-medium">Histórico de Receita e EBITDA dos últimos 12 meses.</p>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/20"></div>
                  <span className="text-muted-foreground">Receita Bruta</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary shadow-lg shadow-secondary/20"></div>
                  <span className="text-muted-foreground">EBITDA Gerencial</span>
                </div>
              </div>
            </div>
            
            <div className="h-[420px] w-full relative z-10 overflow-visible">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={evolData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={colors.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 700 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: colors.mutedForeground, fontWeight: 700 }} 
                    tickFormatter={(v) => `R$${v / 1000}k`} 
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: `1px solid ${colors.border}`, 
                      backgroundColor: colors.cardBg,
                      color: colors.cardFg,
                      boxShadow: 'var(--shadow-md)', 
                      fontSize: '12px',
                      padding: '16px'
                    }}
                    cursor={{ stroke: colors.border, strokeWidth: 2 }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Receita" 
                    stroke={colors.primary} 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRec)" 
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="EBITDA" 
                    stroke={colors.secondary} 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorEbitda)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-primary rounded-[48px] p-12 text-primary-foreground relative overflow-hidden h-full flex flex-col group shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-1000">
              <Sparkles size={140} className="text-secondary" />
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-lg shadow-secondary/20 animate-pulse">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Parecer Executivo</h3>
                   <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Inteligência Artificial Ativada</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <h4 className="text-3xl font-display font-medium leading-[1.1] tracking-tight">
                  {dbIndicators.length > 0 ? "Discernimento Estratégico Consolidado." : "Aguardando fluxos de dados para análise."}
                </h4>
                <div className="relative">
                   <div className="absolute -left-6 top-0 bottom-0 w-1 bg-secondary/30 rounded-full" />
                   <p className="text-primary-foreground/70 text-lg leading-relaxed italic font-light">
                    {dbIndicators.length > 0 
                      ? "A correlação entre os pilares de gestão indica uma janela de oportunidade para otimização de margens sem comprometer o eNPS corporativo."
                      : "A inteligência sistêmica requer a importação de dados de pelo menos 3 pilares de gestão para gerar correlações de valor."}
                   </p>
                </div>
                
                {dbIndicators.length > 0 && (
                  <div className="pt-8 flex items-center gap-4">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-secondary/20 flex items-center justify-center text-[10px] font-bold">AI</div>
                       ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Baseado em 127 pontos de dados</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={() => onNavigate('advisory_insights')}
              className="mt-12 w-full py-5 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-secondary/10"
            >
              Acessar Advisory Hub <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Insights Section */}
      <div className="bg-card border border-border rounded-2xl p-10 md:p-16 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-medium text-foreground tracking-tight">Direcionamento Estratégico</h3>
            <p className="text-body-md text-muted-foreground font-medium">Status atual das diretrizes institucionais nos eixos de governança.</p>
          </div>
          <Button 
            onClick={() => onNavigate('relatorio_executivo')}
            className="flex items-center gap-3 px-5 md:px-8 py-2.5 md:py-4 bg-surface-container text-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all border border-border shadow-sm shrink-0"
          >
            Gerar Relatório Executivo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dbIndicators.length > 0 ? (
            AXIS_DATA.slice(0, 3).map((axis, idx) => {
              const val = getIndicatorValue(axis.mainKpi);
              const status = getIndicatorStatus(axis.mainKpi);
              return (
                <div key={idx} className="bg-surface-container/30 border border-border p-8 rounded-2xl flex gap-6 group cursor-pointer transition-all hover:bg-surface-container" onClick={() => onNavigate(axis.id)}>
                  <div className="shrink-0 pt-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center border-2 border-border group-hover:border-secondary transition-colors">
                       <Semaphore status={status} />
                    </div>
                  </div>
                  <div className="space-y-2 min-w-0 flex-1 overflow-visible">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] group-hover:text-secondary transition-colors break-words leading-normal">{axis.name}</h4>
                    <KpiValue 
                      value={val > 0 ? formatValue(val, '') : '0,00'} 
                      suffix={axis.suffix}
                      noScroll={true}
                      className="text-lg font-medium text-foreground tracking-tight"
                    />
                    <div className="flex items-center justify-between gap-2 pt-2 overflow-visible">
                       <span className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Analisar</span>
                       <span className="text-[9px] font-medium text-muted-foreground uppercase break-words leading-normal">{axis.mainKpi}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 py-16 text-center bg-surface-container/30 rounded-[32px] border border-dashed border-border">
              <p className="text-sm text-muted-foreground font-medium italic">Nenhum direcionamento estratégico disponível para o período selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
