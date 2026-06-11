
import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, TrendingDown, Users, Activity, Globe, ShoppingBag, 
  FileText, Zap, BarChart3, Target, ArrowUpRight, LayoutGrid, 
  BookOpen, Lightbulb, Loader2, PieChart as PieIcon, MessageSquare, Scale, ChevronRight, ShieldAlert
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import { PageHeader, StatusBadge, MarkdownText, KpiCard } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { orchestrateGovernanceNarrative } from '../../core/orchestration/executiveOrchestrationEngine';
import { DashboardSkeleton } from '../ui/skeletons';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveDecisionMemo } from '../ui/executive-decision-memo';
import { ExecutiveNarrative } from '../ui/executive-narrative';
import { ExecutiveCallout } from '../ui/executive-callout';
import { ExecutiveChart, ExecutiveChartTooltip } from '../ui/executive-chart';
import { useHistoricalDemonstracoes } from '../../hooks/useHistoricalDemonstracoes';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { useTemporalRuntime } from '../../hooks/useTemporalRuntime';
import { TemporalExecutiveScoreboard } from '../temporal/TemporalExecutiveScoreboard';
import { TemporalEarlyWarningBanner } from '../temporal/TemporalEarlyWarningBanner';
import { TemporalAdvisoryCard } from '../temporal/TemporalAdvisoryCard';
import { GovernanceTrajectoryGraph } from '../temporal/GovernanceTrajectoryGraph';
import { InstitutionalResilienceTimeline } from '../temporal/InstitutionalResilienceTimeline';
import { TemporalHeatmapPanel } from '../temporal/TemporalHeatmapPanel';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { useLanguage } from '../../contexts/LanguageContext';
interface GovernanceDashboardPageProps {
  clientId: string;
  onNavigate: (page: Page) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
}

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

export function GovernanceDashboardPage({ 
  clientId, 
  onNavigate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}: GovernanceDashboardPageProps) {
  // Strategic KPIs - Dynamic
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const current = allData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
      setDbIndicators(current);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const strategicKPIs = useMemo(() => [
    { label: t('gov.kpi.net_profit'), value: getIndicatorValue('Margem Líquida'), suffix: '%', status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'neutral', icon: BarChart3 },
    { label: t('gov.kpi.ebitda_margin'), value: getIndicatorValue('Margem EBITDA'), suffix: '%', status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'neutral', icon: Zap },
    { label: t('gov.kpi.transparency_index'), value: getIndicatorValue('Índice de Transparência', 0), suffix: '%', status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'neutral', icon: Globe },
    { label: t('gov.kpi.churn_rate'), value: getIndicatorValue('Churn Rate', 0), suffix: '%', status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'negative', icon: ShieldAlert }
  ], [dbIndicators, t]);

  // Radar Data for Areas - Dynamic
  const radarData = useMemo(() => [
    { area: t('gov.area.governance'), score: getIndicatorValue('Maturidade de Governança', 0), target: 85, fullMark: 100 },
    { area: t('gov.area.culture'), score: getIndicatorValue('eNPS', 0), target: 80, fullMark: 100 },
    { area: t('gov.area.finance'), score: getIndicatorValue('Margem EBITDA', 0), target: 75, fullMark: 100 },
    { area: t('gov.area.innovation'), score: getIndicatorValue('Índice de Inovação', 0), target: 80, fullMark: 100 },
    { area: t('gov.area.marketing'), score: getIndicatorValue('ROI de Marketing', 0) * 10, target: 85, fullMark: 100 },
    { area: t('gov.area.commercial'), score: getIndicatorValue('Win Rate', 0), target: 75, fullMark: 100 },
    { area: t('gov.area.operations'), score: getIndicatorValue('Índice de Qualidade', 0), target: 85, fullMark: 100 },
  ], [dbIndicators, t]);

  // Area Snapshots - Dynamic
  const areaSnapshots = useMemo(() => [
    { 
      id: 'governanca_estrategica' as Page,
      label: t('gov.snapshot.governance'), 
      kpi: t('gov.kpi_short.maturity'), 
      value: getIndicatorValue('Maturidade de Governança', 0), 
      suffix: '%', 
      status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'neutral', 
      icon: ShieldCheck,
      color: 'bg-slate-800'
    },
    { 
      id: 'dashboard_cultura' as Page,
      label: t('gov.snapshot.culture'), 
      kpi: t('gov.kpi_short.enps'), 
      value: getIndicatorValue('eNPS', 0), 
      status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'neutral', 
      icon: Users,
      color: 'bg-primary'
    },
    { 
      id: 'dashboard_gestao' as Page,
      label: t('gov.snapshot.finance'), 
      kpi: t('gov.kpi_short.ebitda'), 
      value: getIndicatorValue('Margem EBITDA', 0), 
      suffix: '%', 
      status: (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'positive' : 'neutral', 
      icon: BarChart3,
      color: 'bg-primary'
    },
    { 
      id: 'dashboard_inovacao' as Page,
      label: t('gov.snapshot.innovation'), 
      kpi: t('gov.kpi_short.index'), 
      value: getIndicatorValue('Índice de Inovação', 0), 
      suffix: '%', 
      status: 'neutral', 
      icon: Lightbulb,
      color: 'bg-cyan-500'
    },
    { 
      id: 'dashboard_marketing' as Page,
      label: t('gov.snapshot.marketing'), 
      kpi: t('gov.kpi_short.cpl'), 
      value: getIndicatorValue('CPL', 0), 
      isCur: true, 
      status: 'neutral', 
      icon: Globe,
      color: 'bg-blue-500'
    },
    { 
      id: 'dashboard_comercial' as Page,
      label: t('gov.snapshot.commercial'), 
      kpi: t('gov.kpi_short.conversion'), 
      value: getIndicatorValue('Taxa de Conversão', 0), 
      suffix: '%', 
      status: 'positive', 
      icon: ShoppingBag,
      color: 'bg-success-soft0'
    },
    { 
      id: 'dashboard_operacional' as Page,
      label: t('gov.snapshot.operations'), 
      kpi: t('gov.kpi_short.oee'), 
      value: getIndicatorValue('OEE', 0), 
      suffix: '%', 
      status: 'neutral', 
      icon: Activity,
      color: 'bg-warning-soft0'
    }
  ], [dbIndicators, t]);

  const flatMetrics = useMemo(() => {
    return strategicKPIs.reduce((acc: any, kpi: any) => ({...acc, [kpi.label]: kpi.value}), {});
  }, [strategicKPIs]);

  // Institucional Runtime Integration
  const currentYear = selectedYear || new Date().getFullYear();
  const { dbData: financialData } = useHistoricalDemonstracoes(clientId, currentYear);
  const runtimeInput = useMemo(() => ({
    rawFinancialData: financialData,
    historicalCyclesCount: financialData.length,
    isMockData: false
  }), [financialData]);
  
  const { runtimeOutput } = useInstitutionalRuntime({ input: runtimeInput });
  const isBlocked = (runtimeOutput as any)?.canonicalState?.restrictions?.length > 0 || (runtimeOutput as any)?.canonicalState?.fiduciaryWarnings?.length > 0;

  // Temporal Integration
  const temporalSession = useMemo(() => ({
    isReady: true,
    tenantId: 'TENANT-1', // Placeholder for actual auth context
    entityScope: ['ENT-1']
  }), []);
  
  const rawTemporalPayload = (runtimeOutput?.inferences?.['TemporalCausality'] as any) || null;
  const { temporalData } = useTemporalRuntime(temporalSession, rawTemporalPayload);

  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, 'Governança Corporativa', isBlocked);
  }, [flatMetrics, isBlocked]);

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [auditTrail, setAuditTrail] = useState<any>(null);


  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    setTimeout(() => {
      // SFFL v1.0: Delegate strictly to runtime
      if ((runtimeOutput?.advisory as any)?.executiveSummary || (runtimeOutput as any)?.orchestratedNarrative?.narrative) {
        setAiAnalysis((runtimeOutput?.advisory as any)?.executiveSummary || (runtimeOutput as any)?.orchestratedNarrative?.narrative);
      } else {
        setAiAnalysis(t('gov.ai.mock_client'));
      }
      setAuditTrail({ complianceStatus: isBlocked ? 'non_compliant' : 'compliant', warnings: (runtimeOutput as any)?.canonicalState?.fiduciaryWarnings || [] });
      setLoadingAi(false);
    }, 500);
  };

  const [isYTD, setIsYTD] = useState(false);
  const hasData = dbIndicators.length > 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!loading && !hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 animate-executive-fade">
         <ExecutiveEmptyState
           icon={<ShieldCheck size={48} />}
           title={t('gov.empty.title')}
           description={`${t('gov.empty.desc_1')} ${t(`common.months.${selectedMonth || 1}`)} ${selectedYear}. ${t('gov.empty.desc_2')}`}
           className="bg-transparent border-none shadow-none"
         />
         
         <div className="text-center space-y-4 w-full max-w-2xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-2 border border-border shadow-sm h-[40px]">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                !isYTD ? "text-secondary" : "text-muted-foreground"
              )}>{t('common.monthly')}</span>
              <button 
                onClick={() => setIsYTD(!isYTD)}
                className={cn(
                  "w-10 h-5 rounded-full p-1 transition-all duration-500 relative",
                  isYTD ? "bg-secondary" : "bg-slate-200"
                )}
              >
                <motion.div 
                  animate={{ x: isYTD ? 20 : 0 }}
                  className="w-3 h-3 bg-white rounded-full shadow-md"
                />
              </button>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                isYTD ? "text-secondary" : "text-muted-foreground"
              )}>
                {t('common.yearly')}
              </span>
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-md border border-border rounded-2xl p-1 shadow-sm h-[40px]">
              <div className={cn("flex items-center px-4 py-2", !isYTD && "border-r border-border")}>
                <BookOpen size={14} className="text-secondary mr-2" />
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear?.(Number(e.target.value))}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                    <option key={y} value={y} className="bg-white">{y}</option>
                  ))}
                </select>
              </div>
              {!isYTD && (
                <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth?.(Number(e.target.value))}
                    className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m} className="bg-white">{t(`common.months.${m}`)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
            
            <button 
              onClick={() => onNavigate('maintenance')}
              className="px-5 md:px-8 py-2.5 md:py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
            >
              {t('gov.empty.btn_import')}
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-16 pb-32 animate-executive-fade">
      {((runtimeOutput as any)?.isSandbox || (runtimeOutput as any)?.isDemonstrative) && (
        <SandboxWarningOverlay type={(runtimeOutput as any).isSandbox ? 'sandbox' : 'demonstrative'} />
      )}
      <PageHeader 
        title={t('gov.dashboard.title')}
        subtitle={t('gov.dashboard.subtitle')}
        icon={ShieldCheck}
        transparent
      />

      {temporalData && (
        <div className="mb-10 flex flex-col gap-8">
          <TemporalEarlyWarningBanner warnings={temporalData.earlyWarnings} />
          
          <TemporalExecutiveScoreboard temporalData={temporalData} />

          {temporalData.trajectorySeries && (
            <GovernanceTrajectoryGraph series={temporalData.trajectorySeries} />
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {temporalData.densityMaps && (
              <TemporalHeatmapPanel densityMaps={temporalData.densityMaps} />
            )}
            
            {temporalData.historicalEvents && (
              <InstitutionalResilienceTimeline events={temporalData.historicalEvents} />
            )}
          </div>
        </div>
      )}

      <ExecutiveSurface padding="md" radius="md" className="flex items-center justify-start gap-4 flex-wrap -mt-6 mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 bg-card rounded-md px-4 md:px-6 py-2 md:py-2.5 border border-border shadow-sm h-[40px]">
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-widest transition-colors",
              !isYTD ? "text-secondary" : "text-muted-foreground"
            )}>{t('common.monthly')}</span>
            <button 
              onClick={() => setIsYTD(!isYTD)}
              className={cn(
                "w-10 h-5 rounded-full p-1 transition-all duration-500 relative",
                isYTD ? "bg-secondary" : "bg-muted"
              )}
            >
              <motion.div 
                animate={{ x: isYTD ? 20 : 0 }}
                className="w-3 h-3 bg-white rounded-full shadow-md"
              />
            </button>
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-widest transition-colors",
              isYTD ? "text-secondary" : "text-muted-foreground"
            )}>
              {t('common.yearly')}
            </span>
          </div>

          <div className="flex items-center bg-card border border-border rounded-md p-1 shadow-sm h-[40px]">
            <div className={cn("flex items-center px-4 py-2", !isYTD && "border-r border-border")}>
              <BookOpen size={14} className="text-secondary mr-2.5" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear?.(Number(e.target.value))}
                className="text-[10px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {!isYTD && (
              <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth?.(Number(e.target.value))}
                  className="text-[10px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <option key={m} value={m}>{t(`common.months.${m}`)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </ExecutiveSurface>


      {/* Strategic KPIs Grid - Standardized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
        {strategicKPIs.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            title={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.suffix || ''}
            icon={kpi.icon}
            status={kpi.status === 'positive' ? t('gov.status.positive') : kpi.status === 'negative' ? t('gov.status.negative') : t('gov.status.neutral')}
            trend={t('gov.trend.bullish')}
            noScroll={true}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Radar Analysis */}
        <ExecutiveChart
          title={t('gov.radar.title')}
          description={t('gov.radar.subtitle')}
          height={380}
          className="h-full border-border"
        >
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
             <defs>
                <linearGradient id="radarScoreGrad" x1="0" y1="0" x2="1" y2="1">
                   <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.65} />
                   <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="radarTargetGrad" x1="0" y1="0" x2="1" y2="1">
                   <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.15} />
                   <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.02} />
                </linearGradient>
             </defs>
             
             <PolarGrid stroke="var(--color-border)" opacity={0.6} />
             <PolarAngleAxis 
               dataKey="area" 
               tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: '900', letterSpacing: '0.05em' }}
             />
             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
             
             <Radar
               name={t('gov.radar.target')}
               dataKey="target"
               stroke="var(--color-chart-3)"
               fill="url(#radarTargetGrad)"
               fillOpacity={0.2}
               strokeWidth={1.5}
               strokeDasharray="4 4"
               dot={{ r: 3.5, stroke: 'var(--color-chart-3)', strokeWidth: 1, fill: 'var(--color-card)' }}
             />
             
             <Radar
               name={t('gov.radar.score')}
               dataKey="score"
               stroke="var(--color-chart-1)"
               fill="url(#radarScoreGrad)"
               fillOpacity={0.55}
               strokeWidth={2.5}
               dot={{ r: 4.5, stroke: 'var(--color-chart-1)', strokeWidth: 1.5, fill: 'var(--color-card)' }}
             />
             
             <ExecutiveChartTooltip />
          </RadarChart>
        </ExecutiveChart>

        {/* Strategic Insights */}
        <ExecutiveSurface padding="xl" className="flex flex-col justify-between h-full border-border shadow-inner">
           <div className="space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-md bg-executive flex items-center justify-center text-white shadow-premium">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <h3 className="text-h3 font-medium text-foreground tracking-tight">{t('gov.insights.title')}</h3>
                    <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">{t('gov.insights.subtitle')}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 {[
                   { title: t('gov.insights.mock1.title'), text: t('gov.insights.mock1.text') },
                   { title: t('gov.insights.mock2.title'), text: t('gov.insights.mock2.text') },
                   { title: t('gov.insights.mock3.title'), text: t('gov.insights.mock3.text') }
                 ].map((insight, i) => (
                   <ExecutiveCallout key={i} variant="insight" title={insight.title}>
                     {insight.text}
                   </ExecutiveCallout>
                 ))}
              </div>
           </div>

           <button className="w-full mt-10 px-4 py-3 bg-executive text-white rounded-xl text-sm font-bold hover:bg-executive/90 transition-colors shadow-sm">
              {t('gov.btn.export_monthly')}
           </button>
        </ExecutiveSurface>

      </div>

      {/* Area Snapshots Grid */}
      <div className="space-y-6 mt-10">
        <div className="flex justify-between items-end mb-6">
           <div>
              <h3 className="text-h3 font-medium text-foreground tracking-tight">{t('gov.health.title')}</h3>
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">{t('gov.health.subtitle')}</p>
           </div>
           <button className="btn-ghost flex items-center gap-2 text-xs font-semibold text-primary">
              {t('gov.btn.view_all')} <ChevronRight size={14} />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
           {areaSnapshots.map((area, idx) => (
             <div key={idx} onClick={() => onNavigate(area.id)} className="cursor-pointer group h-full transition-all duration-300 hover:scale-[1.02]">
               <ExecutiveMetricCard
                 label={area.label}
                 value={
                   <div className="flex items-baseline gap-1">
                     {area.isCur && <span className="text-sm font-normal text-muted-foreground mr-1">R$</span>}
                     {formatValue(area.value, '')}
                     {area.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{area.suffix}</span>}
                   </div>
                 }
                 statusBadge={<span>{area.status === 'positive' ? t('gov.status.positive') : t('gov.status.neutral')}</span>}
                 tone={area.status === 'positive' ? 'success' : 'warning'}
                 description={
                   <div className="flex items-center gap-1.5 mt-1">
                     <span className={cn("flex items-center gap-1 font-medium", area.status === 'positive' ? "text-emerald-600" : "text-amber-600")}>
                        {area.status === 'positive' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {area.status === 'positive' ? t('gov.trend.healthy') : t('gov.trend.attention')}
                     </span>
                   </div>
                 }
                 className="border border-border shadow-sm group-hover:border-primary/40 group-hover:shadow-md transition-all"
               />
             </div>
           ))}
        </div>
      </div>

      {/* Perspectiva Governança Aplicada ao Eixo de Governança */}
      <ExecutiveSurface padding="xl" className="overflow-hidden relative shadow-sm border-border flex flex-col gap-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-surface-container text-primary rounded-lg border border-border">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground leading-none">{t('gov.perspective.title')}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{t('gov.perspective.subtitle')}</p>
            </div>
          </div>
          <button 
            onClick={handleGenerateAnalysis}
            disabled={loadingAi}
            className="btn-executive flex items-center gap-2"
          >
            {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} 
            {aiAnalysis ? t('gov.btn.regenerate_ai') : t('gov.btn.generate_ai')}
          </button>
        </div>

        {aiAnalysis && (
          <ExecutiveNarrative 
            title={<span className="flex items-center gap-2"><Zap size={14} /> {t('gov.ai.strategic_reading')}</span>}
            variant="insight"
          >
            <div className="flex flex-col gap-6">
              {auditTrail?.complianceStatus === 'non_compliant' ? (
                <ExecutiveCallout 
                  variant="critical"
                  title={t('gov.ai.blocked_title')}
                >
                  <p>{t('gov.ai.blocked_desc')}</p>
                  {auditTrail.warnings?.length > 0 && (
                    <ul className="mt-2 list-disc list-inside opacity-90 text-sm">
                      {auditTrail.warnings.map((w: any, i: number) => (
                        <li key={i}>
                          {typeof w === 'string' ? w : t(w.labelKey, w.args)}
                        </li>
                      ))}
                    </ul>
                  )}
                </ExecutiveCallout>
              ) : (
                <>
                  {auditTrail?.complianceStatus === 'partially_compliant' && (
                    <ExecutiveCallout 
                      variant="warning"
                      title={t('gov.ai.partial_reading')}
                    />
                  )}
                  <MarkdownText text={aiAnalysis} />
                </>
              )}
            </div>
          </ExecutiveNarrative>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {triggeredRules.map((rule) => (
              <GovernanceInsightPanel 
                key={rule.id}
                principleId={rule.principle.id}
                misalignment={rule.misalignment}
                impact={rule.impact}
                recommendation={rule.recommendation}
              />
            ))}
            {triggeredRules.length === 0 && (
              <div className="col-span-1 xl:col-span-2 flex flex-col items-center justify-center p-12 bg-success/5 border border-success/20 rounded-md text-success">
                <ShieldCheck size={48} className="mb-4 opacity-50" />
                <h4 className="text-body-md font-medium tracking-tight mb-1 uppercase">{t('gov.ai.healthy_axis')}</h4>
                <p className="text-[10px] font-medium opacity-80 text-center w-full max-w-2xl uppercase tracking-widest">{t('gov.ai.healthy_desc')}</p>
              </div>
            )}
          </div>
      </ExecutiveSurface>
    </div>
  );
}
