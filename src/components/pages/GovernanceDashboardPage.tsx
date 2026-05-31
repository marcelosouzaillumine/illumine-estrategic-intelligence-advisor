
import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Activity, Globe, ShoppingBag, 
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
import { useHistoricalDemonstracoes } from '../../hooks/useHistoricalDemonstracoes';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { useTemporalRuntime } from '../../hooks/useTemporalRuntime';
import { TemporalExecutiveScoreboard } from '../temporal/TemporalExecutiveScoreboard';
import { TemporalEarlyWarningBanner } from '../temporal/TemporalEarlyWarningBanner';
import { TemporalAdvisoryCard } from '../temporal/TemporalAdvisoryCard';
import { GovernanceTrajectoryGraph } from '../temporal/GovernanceTrajectoryGraph';
import { InstitutionalResilienceTimeline } from '../temporal/InstitutionalResilienceTimeline';
import { TemporalHeatmapPanel } from '../temporal/TemporalHeatmapPanel';
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
    { label: t('gov.kpi.net_profit'), value: getIndicatorValue('Margem Líquida'), suffix: '%', status: getIndicatorValue('Margem Líquida') > 10 ? 'positive' : 'neutral', icon: BarChart3 },
    { label: t('gov.kpi.ebitda_margin'), value: getIndicatorValue('Margem EBITDA'), suffix: '%', status: getIndicatorValue('Margem EBITDA') > 20 ? 'positive' : 'neutral', icon: Zap },
    { label: t('gov.kpi.transparency_index'), value: getIndicatorValue('Índice de Transparência', 0), suffix: '%', status: getIndicatorValue('Índice de Transparência') > 80 ? 'positive' : 'neutral', icon: Globe },
    { label: t('gov.kpi.churn_rate'), value: getIndicatorValue('Churn Rate', 0), suffix: '%', status: getIndicatorValue('Churn Rate') < 5 ? 'positive' : 'negative', icon: ShieldAlert }
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
      status: getIndicatorValue('Maturidade de Governança') > 70 ? 'positive' : 'neutral', 
      icon: ShieldCheck,
      color: 'bg-slate-800'
    },
    { 
      id: 'dashboard_cultura' as Page,
      label: t('gov.snapshot.culture'), 
      kpi: t('gov.kpi_short.enps'), 
      value: getIndicatorValue('eNPS', 0), 
      status: getIndicatorValue('eNPS') > 50 ? 'positive' : 'neutral', 
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      id: 'dashboard_gestao' as Page,
      label: t('gov.snapshot.finance'), 
      kpi: t('gov.kpi_short.ebitda'), 
      value: getIndicatorValue('Margem EBITDA', 0), 
      suffix: '%', 
      status: getIndicatorValue('Margem EBITDA') > 20 ? 'positive' : 'neutral', 
      icon: BarChart3,
      color: 'bg-indigo-500'
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
      color: 'bg-emerald-500'
    },
    { 
      id: 'dashboard_operacional' as Page,
      label: t('gov.snapshot.operations'), 
      kpi: t('gov.kpi_short.oee'), 
      value: getIndicatorValue('OEE', 0), 
      suffix: '%', 
      status: 'neutral', 
      icon: Activity,
      color: 'bg-amber-500'
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
  const isBlocked = runtimeOutput?.inferences?.['ExecutiveDecisionEngine']?.metrics?.blockedInferences?.length > 0;

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
    const axisPrinciples = GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Governança Corporativa');
    const { narrative, auditTrail } = await orchestrateGovernanceNarrative({
      clientName: 'Sua Empresa',
      industry: 'Geral',
      metrics: flatMetrics,
      topPrinciples: axisPrinciples.map(p => p.name),
      scenarios: axisPrinciples.map(p => p.situationalScenario).filter(Boolean) as string[]
    });
    console.log('Governance Audit Trail:', auditTrail);
    setAuditTrail(auditTrail);
    setAiAnalysis(narrative);
    setLoadingAi(false);
  };

  const [isYTD, setIsYTD] = useState(false);
  const hasData = dbIndicators.length > 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!loading && !hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 animate-executive-fade">
         <div className="relative">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-10 animate-pulse" />
            <div className="w-40 h-40 rounded-[48px] bg-slate-900 flex items-center justify-center text-secondary shadow-2xl relative z-10 border border-white/5">
              <ShieldCheck size={80} strokeWidth={1} />
            </div>
         </div>
         
         <div className="text-center space-y-4 w-full max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">{t('gov.empty.title')}</h2>
            <p className="text-slate-500 w-full max-w-2xl mx-auto font-medium leading-relaxed">
              {t('gov.empty.desc_1')} <strong>{t(`common.months.${selectedMonth || 1}`)} {selectedYear}</strong>. 
              {t('gov.empty.desc_2')}
            </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-2 border border-slate-200 shadow-sm h-[40px]">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                !isYTD ? "text-secondary" : "text-slate-400"
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
                isYTD ? "text-secondary" : "text-slate-400"
              )}>
                {t('common.yearly')}
              </span>
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-md border border-slate-200 rounded-2xl p-1 shadow-sm h-[40px]">
              <div className={cn("flex items-center px-4 py-2", !isYTD && "border-r border-slate-100")}>
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
                    {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                      <option key={i} value={i + 1} className="bg-white">{label}</option>
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

      <div className="flex items-center justify-start gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
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
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                    <option key={i} value={i + 1}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Strategic KPIs Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Radar Analysis */}
        <div className="card-premium p-12 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-h3 font-medium text-foreground tracking-tight">{t('gov.radar.title')}</h3>
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">{t('gov.radar.subtitle')}</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground">
               <PieIcon size={20} />
            </div>
          </div>
          <div className="w-full h-[400px] overflow-visible flex items-center justify-center">
             <ResponsiveContainer width="100%" height={380}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                   <defs>
                      {/* Premium colorful radial & linear gradients */}
                      <linearGradient id="radarScoreGrad" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.65} />
                         <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.45} />
                         <stop offset="100%" stopColor="#E07A5F" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="radarTargetGrad" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                         <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
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
                     stroke="#10b981"
                     fill="url(#radarTargetGrad)"
                     fillOpacity={0.2}
                     strokeWidth={1.5}
                     strokeDasharray="4 4"
                     dot={{ r: 3.5, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
                   />
                   
                   <Radar
                     name={t('gov.radar.score')}
                     dataKey="score"
                     stroke="#8b5cf6"
                     fill="url(#radarScoreGrad)"
                     fillOpacity={0.55}
                     strokeWidth={2.5}
                     dot={{ r: 4.5, stroke: '#8b5cf6', strokeWidth: 1.5, fill: '#fff' }}
                   />
                   
                   <Tooltip 
                     contentStyle={{ 
                       borderRadius: '12px', 
                       border: '1px solid var(--color-border)', 
                       backgroundColor: 'var(--color-card)', 
                       boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15)' 
                     }}
                     itemStyle={{ color: 'var(--color-foreground)', fontWeight: '700', fontSize: '11px' }}
                   />
                </RadarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-surface-container p-12 rounded-md border border-border shadow-inner flex flex-col justify-between">
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

              <div className="space-y-6">
                 {[
                   { title: t('gov.insights.mock1.title'), text: t('gov.insights.mock1.text'), icon: Scale },
                   { title: t('gov.insights.mock2.title'), text: t('gov.insights.mock2.text'), icon: Zap },
                   { title: t('gov.insights.mock3.title'), text: t('gov.insights.mock3.text'), icon: Users }
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-6 p-6 bg-card rounded-md border border-border shadow-sm hover:shadow-md transition-all group cursor-default">
                      <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                         {(() => {
                           const Icon = insight.icon;
                           return <Icon size={20} />;
                         })()}
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest">{insight.title}</h4>
                         <p className="text-body-sm text-muted-foreground leading-relaxed font-medium italic">{insight.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <button className="btn-executive w-full mt-10">
              {t('gov.btn.export_monthly')}
           </button>
        </div>
      </div>

      {/* Area Snapshots Grid */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
           <div>
              <h3 className="text-h2 font-medium text-foreground tracking-tight">{t('gov.health.title')}</h3>
              <p className="text-muted-foreground text-body-sm font-medium uppercase tracking-widest mt-1">{t('gov.health.subtitle')}</p>
           </div>
           <button className="btn-ghost flex items-center gap-2">
              {t('gov.btn.view_all')} <ChevronRight size={14} />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
           {areaSnapshots.map((area, idx) => (
             <KpiCard
               key={idx}
               title={area.label}
               value={formatValue(area.value, '')}
               suffix={area.suffix || (area.isCur ? 'R$' : '')}
               icon={area.icon}
               status={area.status === 'positive' ? t('gov.status.positive') : t('gov.status.neutral')}
               trend={area.status === 'positive' ? t('gov.trend.healthy') : t('gov.trend.attention')}
               onClick={() => onNavigate(area.id)}
               className="group"
             />
           ))}
        </div>
      </div>

      {/* Perspectiva Governança Aplicada ao Eixo de Governança */}
      <div className="card-premium p-12 overflow-hidden relative shadow-sm">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-border pb-8">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-md bg-surface-container text-primary border border-border">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-h2 font-medium text-foreground tracking-tight leading-none mb-2">{t('gov.perspective.title')}</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{t('gov.perspective.subtitle')}</p>
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
            <div className="mb-10 bg-surface-container p-8 rounded-md border border-border text-foreground font-medium leading-relaxed text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck size={64} />
              </div>
              <div className="flex items-center gap-2 mb-4 text-primary font-medium uppercase tracking-widest text-[10px]">
                <Zap size={14} /> {t('gov.ai.strategic_reading')}
              </div>
              <div className="whitespace-pre-wrap relative z-10 text-xs text-muted-foreground font-medium italic">
                {auditTrail?.complianceStatus === 'non_compliant' ? (
                  <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-md mb-8 flex items-start gap-4 text-left not-italic">
                    <ShieldAlert className="text-red-500 shrink-0" size={24} />
                    <div>
                      <h3 className="text-red-500 font-bold text-lg mb-2">{t('gov.ai.blocked_title')}</h3>
                      <p className="text-red-400 font-medium leading-relaxed">
                        {t('gov.ai.blocked_desc')}
                      </p>
                      {auditTrail.warnings?.length > 0 && (
                        <ul className="mt-4 list-disc list-inside text-red-400/80 text-sm">
                          {auditTrail.warnings.map((w: any, i: number) => (
                            <li key={i}>
                              {typeof w === 'string' ? w : t(w.labelKey, w.args)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {auditTrail?.complianceStatus === 'partially_compliant' && (
                      <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-md mb-8 flex items-center gap-3 text-left not-italic">
                        <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
                        <p className="text-yellow-500 font-bold text-sm">{t('gov.ai.partial_reading')}</p>
                      </div>
                    )}
                    <MarkdownText text={aiAnalysis} />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-12 bg-success/5 border border-success/20 rounded-md text-success">
                <ShieldCheck size={48} className="mb-4 opacity-50" />
                <h4 className="text-body-md font-medium tracking-tight mb-1 uppercase">{t('gov.ai.healthy_axis')}</h4>
                <p className="text-[10px] font-medium opacity-80 text-center w-full max-w-2xl uppercase tracking-widest">{t('gov.ai.healthy_desc')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
