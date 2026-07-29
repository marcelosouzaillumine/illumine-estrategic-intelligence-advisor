import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, TrendingUp, AlertTriangle, Zap, ChevronRight, ShieldCheck, Activity, Target, LayoutDashboard, Users, Globe, ShoppingBag, Lightbulb, Loader2, Sparkles, ArrowRight, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { ExecutiveChart, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartYAxis, ExecutiveChartTooltip } from '../ui/executive-chart';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { calculateDreCascade } from '../../lib/dreCascade';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardSkeleton } from '../ui/skeletons';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { Semaphore, ControlBar } from '../Common';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { PageHeader } from '../ui/page-header';
import { SectionHeader } from '../ui/section-header';
import { SemanticCard } from '../ui/semantic-card';
import { MetricGrid } from '../ui/metric-tile';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveHeading } from '../ui/executive-heading';
import { PageSection } from '../ui/page-section';
import { ExecutiveCallout } from '../ui/executive-callout';
import { ExecutiveNarrative } from '../ui/executive-narrative';
import { NarrativeStack } from '../ui/narrative-stack';
import { formatCurrency, formatValue, cn, getThemeColors } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useDashboardPageViewModel } from '../../viewmodels/useDashboardPageViewModel';
import { ExecutiveText } from '../ui/executive-typography';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { FULL_MONTH_LABELS, MONTH_LABELS } from '../../constants';
import { Button } from '../ui/button';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { useHistoricalDemonstracoes } from '../../hooks/useHistoricalDemonstracoes';
import { useInstitutionalContext } from '../../hooks/useInstitutionalContext';
import { DataAccessContext } from '../../core/security/data-access-context';
import { governanceService } from '../../services/governanceService';
import { getFinancialEntries } from '../../services/cashFlowService';
import { useLanguage } from '../../contexts/LanguageContext';
import { matchFinancialKey } from '../../utils/financialKeyNormalizer';
import { DashboardEvolutionChart } from './dashboard/DashboardEvolutionChart';
import { ExecutiveIntelligenceShell } from '../executive/ExecutiveIntelligenceShell';
import { ExecutiveDecisionSurface } from '../executive/ExecutiveDecisionSurface';
import { ExecutiveInsightsPanel } from '../executive/ExecutiveInsightsPanel';
import { ExecutiveAgentActionSurface } from '../executive/ExecutiveAgentActionSurface';
import { ExecutiveExperienceComposer } from '@illumine/executive-experience-composer';

const AXIS_DATA = [
  { 
    id: 'governanca_estrategica', 
    name: 'Governança Corporativa', 
    icon: ShieldCheck, 
    color: 'bg-primary', 
    mainKpi: 'Maturidade de Governança',
    suffix: '%' 
  },
  { 
    id: 'saude_financeira', 
    name: 'Saúde Financeira', 
    icon: Activity, 
    color: 'bg-success', 
    mainKpi: 'EBITDA',
    suffix: '' 
  },
  { 
    id: 'eficiencia_operacional', 
    name: 'Eficiência Operacional', 
    icon: Target, 
    color: 'bg-info', 
    mainKpi: 'Margem Operacional',
    suffix: '%' 
  },
  { 
    id: 'capital_pessoas', 
    name: 'Capital & Pessoas', 
    icon: Users, 
    color: 'bg-warning', 
    mainKpi: 'Produtividade por Colaborador',
    suffix: '' 
  },
  { 
    id: 'posicionamento_mercado', 
    name: 'Mercado & Cliente', 
    icon: Globe, 
    color: 'bg-purple-500', 
    mainKpi: 'Market Share Estimado',
    suffix: '%' 
  },
  { 
    id: 'inovacao_tecnologia', 
    name: 'Inovação & Digital', 
    icon: Lightbulb, 
    color: 'bg-amber-500', 
    mainKpi: 'Índice de Digitalização',
    suffix: '%' 
  }
];

export function DashboardPage({ 
  selectedClient, 
  onNavigate, 
  selectedYear: propSelectedYear,
  selectedMonth: propSelectedMonth
}: any) {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<number>(propSelectedYear || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(propSelectedMonth || new Date().getMonth() + 1);
  const [periodMode, setPeriodMode] = useState<'mensal' | 'anual'>('mensal');

  const { kpis: realKPIs } = useRealIndicatorData(selectedClient, selectedYear, selectedMonth);
  const { dbData: historicalData, loading: isHistoricalLoading } = useHistoricalDemonstracoes(selectedClient, selectedYear);
  const { runtimeOutput } = useInstitutionalRuntime({ input: { rawFinancialData: historicalData } });

  const getIndicatorValue = useCallback((name: string): number => {
    if (!realKPIs) return 0;
    if (name.includes('ebitda') || name.includes('EBITDA')) return realKPIs.ebitda || 0;
    if (name.includes('margem') || name.includes('Margem')) return realKPIs.margemLiquida || 0;
    if (name.includes('receita') || name.includes('Receita')) return realKPIs.revenue || 0;
    if (name.includes('lucro') || name.includes('Lucro')) return realKPIs.netProfit || 0;
    if (name.includes('liquidez') || name.includes('Liquidez')) return realKPIs.liquidezCorrente || 0;
    return 0;
  }, [realKPIs]);

  const getIndicatorStatus = useCallback((name: string): string => {
    const val = getIndicatorValue(name);
    return val > 0 ? 'Conforme' : 'Pendente';
  }, [getIndicatorValue]);

  const getIndicatorTrend = useCallback((name: string): string => {
    return 'Estável';
  }, []);

  const colors = getThemeColors();

  const evolData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    return historicalData.map(d => ({
      year: d.year,
      ReceitaLíquida: d.valor || 0,
      EBITDA: d.valor || 0,
      LucroLíquido: d.valor || 0
    }));
  }, [historicalData]);

  const composedExp = useMemo(() => {
    return ExecutiveExperienceComposer.compose({
      companyId: String(selectedClient || 'comp-1'),
      userId: 'user-c-level',
      pageId: 'DashboardPage',
      period: String(selectedYear),
      activeFinancialMetrics: { EBITDA: getIndicatorValue('EBITDA') }
    });
  }, [selectedClient, selectedYear, getIndicatorValue]);

  if (isHistoricalLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ExecutiveIntelligenceShell pageTitle="Dashboard Executivo" pageContext="DashboardPage">
      <ExecutiveDecisionSurface
        pageTitle="Dashboard Executivo"
        opportunityTitle={composedExp.decisionView.opportunityTitle}
        opportunityDetail={composedExp.decisionView.opportunityDetail}
        agentName={composedExp.decisionView.anchorAgentName}
      />
      <ExecutiveInsightsPanel pageTitle="Dashboard Executivo" />
      <ExecutiveAgentActionSurface />
      <ExecutivePageTemplate header={{
      title: t('dashboard.header.title', 'Visão Geral da Instituição'),
      description: t('dashboard.header.subtitle', 'Síntese executiva dos eixos estratégicos, saúde financeira e governança patrimonial.'),
    }}>
      {((runtimeOutput as any)?.isSandbox || (runtimeOutput as any)?.isDemonstrative) && (
        <SandboxWarningOverlay type={(runtimeOutput as any).isSandbox ? 'sandbox' : 'demonstrative'} />
      )}

      {/* Control Bar */}
      <ControlBar 
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        periodMode={periodMode}
        setPeriodMode={setPeriodMode}
        showStatusBadge={true}
        statusBadgeLabel={t('dashboard.status.active')}
      />

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE EXECUTIVA DO DASHBOARD) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Visão Consolidada', variant: 'success' }}
        question="Qual o panorama de desempenho consolidado dos 6 eixos estratégicos?"
        opinion="O comitê fiduciário homologa a síntese do dashboard executivo, validando os indicadores de saúde financeira e governança."
        driver="Métricas de liquidez, EBITDA, capital de giro, solvência, eficiência operacional e riscos."
        implication="Visibilidade integrada C-Level para tomada de decisão ágil."
        action="Revisar os eixos com farol amarelo ou vermelho e direcionar planos de ação específicos."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      {/* Strategic Summary Bar (KPI Grid Clean) */}
      <MetricGrid columns={4}>
        {[
          { label: t('dashboard.kpi.net_revenue'), value: getIndicatorValue('Receita Líquida'), key: 'Receita Líquida', isCur: true, icon: TrendingUp },
          { label: t('dashboard.kpi.ebitda'), value: getIndicatorValue('EBITDA'), key: 'EBITDA', isCur: true, icon: Zap },
          { label: t('dashboard.kpi.net_profit'), value: getIndicatorValue('Lucro Líquido'), key: 'Lucro Líquido', isCur: true, icon: PieChartIcon },
          { label: t('dashboard.kpi.estimated_value'), value: (getIndicatorValue('EBITDA') * 12 * 6.5), key: 'EBITDA', isCur: true, icon: Target },
        ].map((item, idx) => {
          const status = getIndicatorStatus(item.key) || (item.value === 0 ? 'Pendente' : 'Verde');
          const badgeVariant = status === 'Verde' ? 'success' : status === 'Amarelo' ? 'warning' : status === 'Vermelho' ? 'critical' : 'neutral';
          const trendLabel = getIndicatorTrend(item.key);

          return (
            <ExecutiveMetricCard 
              key={idx}
              label={item.label}
              value={formatValue(item.value, item.isCur ? 'R$' : '')}
              statusBadge={<ExecutiveBadge variant={badgeVariant}>{status}</ExecutiveBadge>}
              tone="neutral"
              description={<span className="text-xs text-muted-foreground font-medium">Tendência: {trendLabel}</span>}
              className="bg-card border border-border shadow-sm h-full"
            />
          );
        })}
      </MetricGrid>

      {/* --- CAMADA 2: DIRETORIA & PILARES DE GESTÃO HUB --- */}
      <PageSection
        title={t('dashboard.hub.title')}
        description={t('dashboard.hub.subtitle')}
        actions={
          <div className="flex items-center gap-2 px-5 py-2 bg-secondary/5 border border-secondary/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary">{t('dashboard.hub.executive_view')}</ExecutiveText>
          </div>
        }
      >
        <MetricGrid columns={4}>
          {AXIS_DATA.map((axis) => {
            const val = getIndicatorValue(axis.mainKpi);
            const status = getIndicatorStatus(axis.mainKpi);
            const badgeVariant = status === 'Verde' ? 'success' : status === 'Amarelo' ? 'warning' : status === 'Vermelho' ? 'critical' : 'neutral';

            return (
              <ExecutiveMetricCard 
                key={axis.id}
                label={axis.name}
                value={`${formatValue(val, '')}${axis.suffix}`}
                statusBadge={<ExecutiveBadge variant={badgeVariant}>{status}</ExecutiveBadge>}
                tone="neutral"
                description={<span className="text-xs text-muted-foreground font-medium">Eixo de Gestão</span>}
                onClick={() => onNavigate(axis.id)}
                className="bg-card border border-border shadow-sm cursor-pointer hover:border-primary/40 transition-all h-full"
              />
            );
          })}
        </MetricGrid>
      </PageSection>

      {/* Mid Section: Charts and AI */}
      <div className="mt-12 mb-8 border-t border-border pt-8">
        <ExecutiveHeading as="h2" className="mb-1">{t('dashboard.hub.title')}</ExecutiveHeading>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <ExecutiveSurface padding="xl" radius="xl" className="p-8 md:p-12 pb-0 bg-card border border-border shadow-sm">
            <div style={{ height: 400 }} className="w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <DashboardEvolutionChart data={evolData} colors={colors} formatCurrency={formatCurrency} />
              </ResponsiveContainer>
            </div>
          </ExecutiveSurface>
  
          <div className="space-y-10 h-full">
            <SemanticCard variant="insight" className="h-full flex flex-col justify-between">
              <NarrativeStack divider>
                <ExecutiveNarrative 
                  variant="insight" 
                  title={t('dashboard.ai.executive_opinion')}
                >
                  {historicalData.length > 0 ? t('dashboard.ai.consolidated_insight') : t('dashboard.ai.waiting_data')}
                </ExecutiveNarrative>
                
                <ExecutiveNarrative 
                  variant="summary"
                >
                  {historicalData.length > 0 
                    ? t('dashboard.ai.mock_correlation')
                    : t('dashboard.ai.mock_require_data')}
                </ExecutiveNarrative>
              </NarrativeStack>

              <Button 
                onClick={() => onNavigate('advisory_insights')}
                className="mt-8 w-full py-5 bg-secondary text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-card hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-secondary/10"
              >
                {t('dashboard.btn.access_advisory')} <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </SemanticCard>
          </div>
        </div>
      </div>
  
      {/* Bottom Insights Section */}
      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title={t('dashboard.guidance.title')}
        subtitle={t('dashboard.guidance.subtitle')}
        variant="analytics"
        defaultExpanded
      >
        <MetricGrid columns={3}>
          {historicalData.length > 0 ? (
            AXIS_DATA.slice(0, 3).map((axis, idx) => {
              const val = getIndicatorValue(axis.mainKpi);
              const status = getIndicatorStatus(axis.mainKpi);
              const badgeVariant = status === 'Verde' ? 'success' : status === 'Amarelo' ? 'warning' : status === 'Vermelho' ? 'critical' : 'neutral';

              return (
                <ExecutiveMetricCard 
                  key={idx}
                  label={axis.name}
                  value={`${val > 0 ? formatValue(val, '') : '0,00'}${axis.suffix}`}
                  statusBadge={<ExecutiveBadge variant={badgeVariant}>{status}</ExecutiveBadge>}
                  tone="neutral"
                  description={<span className="text-xs text-muted-foreground font-medium">Recomendação Estratégica</span>}
                  onClick={() => onNavigate(axis.id)}
                  className="bg-card border border-border shadow-sm cursor-pointer hover:border-primary/40 transition-all h-full"
                />
              );
            })
          ) : (
            <div className="col-span-3">
              <ExecutiveEmptyState
                title={t('dashboard.guidance.empty')}
                description=""
                compact
              />
            </div>
          )}
        </MetricGrid>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
    </ExecutiveIntelligenceShell>
  );
}
