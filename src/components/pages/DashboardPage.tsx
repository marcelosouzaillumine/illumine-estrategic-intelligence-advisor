import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { ResponsiveContainer } from "recharts";

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
  ExecutiveChart,
  ExecutiveChartGrid,
  ExecutiveChartXAxis,
  ExecutiveChartYAxis,
  ExecutiveChartTooltip
} from '../ui/executive-chart';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { calculateDreCascade } from '../../lib/dreCascade';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardSkeleton } from '../ui/skeletons';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { Semaphore, KpiCard, KpiValue, ControlBar } from '../Common';
import { PageHeader } from '../ui/page-header';
import { SectionHeader } from '../ui/section-header';
import { SemanticCard } from '../ui/semantic-card';
import { MetricTile, MetricGrid } from '../ui/metric-tile';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { PageSection } from '../ui/page-section';
import { ExecutiveCallout } from '../ui/executive-callout';
import { ExecutiveNarrative } from '../ui/executive-narrative';
import { NarrativeStack } from '../ui/narrative-stack';
import { formatCurrency, formatValue, cn, getThemeColors } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
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
    id: 'dashboard_cultura', 
    name: 'Cultura Organizacional', 
    icon: Users, 
    color: 'bg-primary', 
    mainKpi: 'eNPS',
    suffix: '' 
  },
  { 
    id: 'dashboard_gestao', 
    name: 'Administração e Finanças', 
    icon: BarChartIcon, 
    color: 'bg-surface', 
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
    color: 'bg-surface-low', 
    mainKpi: 'OEE (Eficiência)',
    suffix: '%' 
  },
];



export function DashboardPage({ 
  selectedClient, 
  selectedMonth, 
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onNavigate
}: any) {
  const { t } = useLanguage();
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

  const { dbData: historicalData } = useHistoricalDemonstracoes(selectedClient || '', selectedYear);
  const yearsWithData = new Set(historicalData.map((d: any) => d.year)).size;
  const runtimeInput = {
    rawFinancialData: {},
    historicalCyclesCount: yearsWithData,
    isMockData: false
  };
  const { runtimeOutput } = useInstitutionalRuntime({ input: runtimeInput });

  const memoryInference = runtimeOutput?.inferences['InstitutionalMemoryEngine'];
  const isMemoryBlocked = (runtimeOutput as any)?.canonicalState?.restrictions?.length > 0;

  const { kpis: calculatedKPIs } = useRealIndicatorData(selectedClient, periodMode === 'anual' ? 0 : selectedMonth, selectedYear);

  const institutionalContext = useInstitutionalContext();
  const [accessDenied, setAccessDenied] = useState(false);
  const [denialReason, setDenialReason] = useState('');

  useEffect(() => {
    if (!selectedClient || !institutionalContext.isContextReady) return;

    let isMounted = true;
    setLoading(true);
    setAccessDenied(false);

    async function fetchData() {
      try {
        const dataAccessContext: DataAccessContext = {
          actorId: institutionalContext.actorId,
          tenantId: institutionalContext.tenantId,
          role: institutionalContext.role,
          permissions: institutionalContext.permissions,
          entityScope: institutionalContext.entityScope,
          requestedAction: 'VIEW_DASHBOARD',
          resourceType: 'FinancialData',
          resourceTenantId: institutionalContext.isLegacyContext ? institutionalContext.legacyTenantId || selectedClient : selectedClient,
          visibilityPolicy: 'INTERNAL',
          auditRequirement: false
        };

        const [indicators, entries] = await Promise.all([
          governanceService.getDashboardIndicators(dataAccessContext, selectedClient),
          getFinancialEntries(dataAccessContext, selectedClient)
        ]);

        if (!isMounted) return;

        setAllYearIndicators(indicators);
        setAllFinancialEntries(entries);

        let current: any[] = [];
        if (periodMode === 'anual') {
          const yearData = indicators.filter((i: any) => i.ano === selectedYear);
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
          current = indicators.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
        }
        setDbIndicators(current);
      } catch (error: any) {
        if (!isMounted) return;
        console.error('Governance Error in Dashboard:', error);
        setAccessDenied(true);
        setDenialReason(error.message || 'Acesso negado.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedClient, selectedYear, selectedMonth, periodMode, institutionalContext]);

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
    if (isMemoryBlocked) return 'Pendente'; // Bloqueado pelo Institutional Memory

    const diff = currentValue - prevInd.val;
    return (runtimeOutput as any)?.canonicalState?.trend === 'DETERIORATING' ? 'Em Queda' : (runtimeOutput as any)?.canonicalState?.trend === 'IMPROVING' ? 'Em Alta' : 'Estável';
  }, [dbIndicators, allYearIndicators, selectedMonth, selectedYear, getIndicatorValue, isMemoryBlocked]);

  const getIndicatorStatus = useCallback((name: string) => {
    const ind = dbIndicators.find((i: any) => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    if (ind?.sem) return ind.sem;

    const trend = getIndicatorTrend(name);
    if (trend === 'Pendente') return 'Pendente';
    return (runtimeOutput as any)?.canonicalState?.status === 'HEALTHY' ? 'Verde' : (runtimeOutput as any)?.canonicalState?.status === 'WARNING' ? 'Amarelo' : 'Vermelho';
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
        // Filter out archived entries
        const activeEntries = allFinancialEntries.filter((e: any) => e.status !== 'archived');
        
        // Separa as entradas que já estão no nível mensal (se existirem)
        const monthEntries = activeEntries.filter(
          (e: any) => (Number(e.month) === m || Number(e.mes) === m) && (Number(e.year) === y || Number(e.ano) === y)
        );
        
        let flattenedMonthEntries: any[] = [];
        monthEntries.forEach((doc: any) => {
          if (Array.isArray(doc.data)) {
            flattenedMonthEntries.push(...doc.data);
          } else {
            flattenedMonthEntries.push(doc);
          }
        });

        // Pega as entradas anuais do ano correspondente
        const annualEntries = activeEntries.filter(
          (e: any) => !e.month && !e.mes && (Number(e.year) === y || Number(e.ano) === y) && e.type === 'DRE'
        );

        let flattenedAnnualEntries: any[] = [];
        annualEntries.forEach((doc: any) => {
          if (Array.isArray(doc.data)) {
             flattenedAnnualEntries.push(...doc.data);
          } else {
             flattenedAnnualEntries.push(doc);
          }
        });

        if (flattenedAnnualEntries.length > 0) {
           // Mapeamento para garantir a estrutura correta para a DRE
           const mappedYearEntries = flattenedAnnualEntries.map((d: any) => {
             let parentId = d.parentId;
             const cat = (d.conta || d.category || '').toLowerCase();
             if (!parentId) {
                if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') || (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
                   parentId = 'ROB';
                } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
                   parentId = 'DED';
                } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
                   parentId = 'CUSTOS';
                } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
                   parentId = 'DEP_AMORT';
                } else if (cat.includes('financeir') || cat.includes('juros')) {
                   parentId = 'RESULT_FIN';
                } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
                   parentId = 'PROV_IR_CSLL';
                } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
                   parentId = 'OUTRAS_REC_DESP';
                } else {
                   parentId = 'DESP_OPER';
                }
             }
             return { ...d, parentId, value: d.val || d.valor || d.value || 0 };
           });

           const cascadeResult = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map(account => ({ ...account, value: 0 })), ...mappedYearEntries]);
           
           // Pega os valores consolidados do ano e divide por 12
           const annualRol = cascadeResult.find((r: any) => r.id === 'ROL')?.computedValue || 0;
           const annualEbitda = cascadeResult.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
           
           rec += annualRol / 12;
           ebitda += annualEbitda / 12;
        }

        // Soma também o que tiver mensal, se houver
        if (flattenedMonthEntries.length > 0) {
           const rolEntries = flattenedMonthEntries.filter((e: any) => {
             const id = (e.id || '').toUpperCase();
             if (id === 'ROL') return true;
             return matchFinancialKey(e.category || e.conta || '', ['receita operacional líquida', 'receita líquida', 'receita operacional liquida', 'receita liquida']);
           });
           const robEntries = flattenedMonthEntries.filter((e: any) => {
             const id = (e.id || '').toUpperCase();
             if (id === 'ROB') return true;
             return matchFinancialKey(e.category || e.conta || '', ['receita operacional bruta', 'faturamento bruto', 'faturamento', 'receita operacional bruta']);
           });

           rec += (rolEntries.length > 0 ? rolEntries : robEntries).reduce((sum: number, e: any) => sum + (Number(e.computedValue !== undefined ? e.computedValue : (e.value || e.valor || e.val)) || 0), 0);
             
           ebitda += flattenedMonthEntries
             .filter((e: any) => {
               const id = (e.id || '').toUpperCase();
               if (id === 'EBITDA') return true;
               return matchFinancialKey(e.category || e.conta || '', ['ebitda', 'lajida']);
             })
             .reduce((sum: number, e: any) => sum + (Number(e.computedValue !== undefined ? e.computedValue : (e.value || e.valor || e.val)) || 0), 0);
        }
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
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full animate-executive-fade">
        <ExecutiveEmptyState
          icon={<LayoutDashboard />}
          title={t('gov.empty.title_select_company')}
          description={t('gov.empty.desc_select_company')}
        />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full animate-executive-fade">
        <ExecutiveEmptyState
          icon={<AlertTriangle />}
          title={t('gov.empty.access_denied_title')}
          description={denialReason}
          className="border-destructive/20"
        />
      </div>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <ExecutivePageTemplate
      header={{
        title: t('dashboard.main.title'),
        description: t('dashboard.main.subtitle')
      }}
    >
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

      {isMemoryBlocked && (
        <ExecutiveCallout variant="critical" title={t('dashboard.warning.inference_title')}>
          {t('dashboard.warning.inference_desc')}
        </ExecutiveCallout>
      )}

      {/* Strategic Summary Bar */}
      <MetricGrid columns={4}>
        {[
          { label: t('dashboard.kpi.net_revenue'), value: getIndicatorValue('Receita Líquida'), key: 'Receita Líquida', isCur: true, icon: TrendingUp },
          { label: t('dashboard.kpi.ebitda'), value: getIndicatorValue('EBITDA'), key: 'EBITDA', isCur: true, icon: Zap },
          { label: t('dashboard.kpi.net_profit'), value: getIndicatorValue('Lucro Líquido'), key: 'Lucro Líquido', isCur: true, icon: PieChartIcon },
          { label: t('dashboard.kpi.estimated_value'), value: (getIndicatorValue('EBITDA') * 12 * 6.5), key: 'EBITDA', isCur: true, icon: Target },
        ].map((item, idx) => {
          const status = getIndicatorStatus(item.key) || (item.value === 0 ? 'Pendente' : 'Verde');
          const variant = status === 'Verde' ? 'success' : status === 'Amarelo' ? 'warning' : status === 'Vermelho' ? 'critical' : 'default';
          const trendLabel = getIndicatorTrend(item.key);
          const trendDirection = trendLabel === 'Em Alta' ? 'up' : trendLabel === 'Em Queda' ? 'down' : 'neutral';

          return (
            <MetricTile 
              key={idx}
              label={item.label}
              value={formatValue(item.value, item.isCur ? 'R$' : '')}
              icon={item.icon}
              variant={idx === 3 ? 'insight' : variant as any}
              trend={{
                value: trendLabel,
                direction: trendDirection
              }}
            />
          );
        })}
      </MetricGrid>

      {/* The Pilares de Gestão Hub */}
      <PageSection
        title={t('dashboard.hub.title')}
        description={t('dashboard.hub.subtitle')}
        actions={
          <div className="flex items-center gap-2 px-5 py-2 bg-secondary/5 border border-secondary/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{t('dashboard.hub.executive_view')}</p>
          </div>
        }
      >
        <MetricGrid columns={4}>
          {AXIS_DATA.map((axis) => {
            const val = getIndicatorValue(axis.mainKpi);
            const status = getIndicatorStatus(axis.mainKpi);
            const variant = status === 'Verde' ? 'success' : status === 'Amarelo' ? 'warning' : status === 'Vermelho' ? 'critical' : 'default';
            const trendLabel = getIndicatorTrend(axis.mainKpi);
            const trendDirection = trendLabel === 'Em Alta' ? 'up' : trendLabel === 'Em Queda' ? 'down' : 'neutral';

            return (
              <MetricTile 
                key={axis.id}
                label={axis.name}
                value={`${formatValue(val, '')}${axis.suffix}`}
                icon={axis.icon}
                variant={variant as any}
                trend={{
                  value: trendLabel,
                  direction: trendDirection
                }}
                onClick={() => onNavigate(axis.id)}
              />
            );
          })}
        </MetricGrid>
      </PageSection>

      {/* Mid Section: Charts and AI */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <ExecutiveSurface className="p-8 md:p-12 pb-0">
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
                  {dbIndicators.length > 0 ? t('dashboard.ai.consolidated_insight') : t('dashboard.ai.waiting_data')}
                </ExecutiveNarrative>
                
                <ExecutiveNarrative 
                  variant="summary"
                >
                  {dbIndicators.length > 0 
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
  
      {/* Bottom Insights Section */}
        <PageSection
          title={t('dashboard.guidance.title')}
          description={t('dashboard.guidance.subtitle')}
          actions={
            <Button 
              onClick={() => onNavigate('relatorio_executivo')}
              className="flex items-center gap-3 px-5 md:px-8 py-2.5 md:py-4 bg-surface-container text-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all border border-border shadow-sm shrink-0"
            >
              {t('dashboard.btn.generate_report')}
            </Button>
          }
        >
          <MetricGrid columns={3}>
            {dbIndicators.length > 0 ? (
              AXIS_DATA.slice(0, 3).map((axis, idx) => {
                const val = getIndicatorValue(axis.mainKpi);
                const status = getIndicatorStatus(axis.mainKpi);
                const variant = status === 'Verde' ? 'success' : status === 'Amarelo' ? 'warning' : status === 'Vermelho' ? 'critical' : 'default';
                const trendLabel = getIndicatorTrend(axis.mainKpi);
                const trendDirection = trendLabel === 'Em Alta' ? 'up' : trendLabel === 'Em Queda' ? 'down' : 'neutral';

                return (
                  <MetricTile 
                    key={idx}
                    label={axis.name}
                    value={`${val > 0 ? formatValue(val, '') : '0,00'}${axis.suffix}`}
                    icon={axis.icon}
                    variant={variant as any}
                    trend={{
                      value: trendLabel,
                      direction: trendDirection
                    }}
                    onClick={() => onNavigate(axis.id)}
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
        </PageSection>
      </div>
    </ExecutivePageTemplate>
  );
}
