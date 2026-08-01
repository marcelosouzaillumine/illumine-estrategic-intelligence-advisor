// src/components/pages/EFOSPage.tsx




import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Target, Activity, DollarSign, ArrowRightLeft, BookOpen, TrendingUp, Layers, AlertTriangle, Loader2, Calendar, Layers3, Briefcase, Users, Compass, FileText, ArrowLeft, ChevronDown, CheckCircle, Info } from 'lucide-react';
import { FiduciaryRuntimeAdapter, ExecutiveIntelligenceReport, ExecutiveRecommendation } from '../../services/FiduciaryRuntimeAdapter';
import { PresentationLayer } from '../../services/EFOSTypes';
import { useInstitutionalAuth } from '../../hooks/useInstitutionalAuth';
import { cn, formatCurrency } from '../../lib/utils';
import { useLocation } from 'react-router-dom';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { getComputedBPSummary, getComputedDreMetrics } from '../../core/orchestration/financial-math-adapter';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEFOSPageAdapter } from '../../adapters/ui/useEFOSPageAdapter';
import { orchestrateExecutiveConsolidation, ExecutiveConsolidationResult } from '../../core/orchestration/executiveOrchestrationEngine';
import { isDebugAllowed, ExecutivePresentationRegistry, languageSanitize, audit, fallbackInstitutionalView } from '../../services/efosGuard';
import { ExecutiveSemanticRegistry } from '../../lib/executive-semantic-registry';
import type { AudienceProfile } from '../../services/EFOSTypes';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useEFOSPageViewModel } from '../../viewmodels/useEFOSPageViewModel';
import { ExecutiveIntelligenceShell } from '../executive/ExecutiveIntelligenceShell';

interface OverviewPageProps {
  clients?: any[];
  selectedClient: string;
  setSelectedClient?: (id: string) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear: number;
  setSelectedYear?: (year: number) => void;
  onNavigate?: (page: string) => void;
  profile?: string;
  showDebugTools?: boolean;
}

export function EFOSPage({
  clients = [],
  selectedClient,
  setSelectedClient,
  selectedMonth = new Date().getMonth() + 1,
  selectedYear = new Date().getFullYear(),
  setSelectedYear,
  onNavigate,
  profile: propProfile,
  showDebugTools
}: OverviewPageProps) {
  const { t } = useLanguage();
  const { session } = useInstitutionalAuth();
  
  // ViewModel: useEFOSPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useEFOSPageViewModel({ clientId: selectedClient });

  const userRole = session?.role || 'BOARD_MEMBER';
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [showExplainability, setShowExplainability] = useState(false);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);
  const [consolidationResult, setConsolidationResult] = useState<ExecutiveConsolidationResult | null>(null);
  const [bindingError, setBindingError] = useState<any>(null);
  const [semanticAudit, setSemanticAudit] = useState<{pass:boolean; violations:string[]} | null>(null);
  // Debug: force fallback view when URL contains ?forceFallback=true
  let forceFallback = false;
  const location = useLocation();
  if (location && location.search) {
    const params = new URLSearchParams(location.search);
    forceFallback = params.get('forceFallback') === 'true';
  }
  const computedProfile = useMemo(() => {
    if (propProfile) return propProfile;
    return FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole));
  }, [propProfile, userRole]);
  const profile = computedProfile;

  const defaultDensity: PresentationLayer = typeof profile === 'string'
    ? (profile as PresentationLayer)
    : (profile?.defaultDensity ?? 'BOARD');

  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(defaultDensity);

  const isSectionVisible = (sectionName: string) => {
    return FiduciaryRuntimeAdapter.ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  };

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);

  // Load Balance Sheet & DRE & DLPA
  const clientId = selectedClient ?? '';
  const { dbData: bpEntries, loading: loadingBP } = useAnnualFinancialData(clientId, filterYear, 'BP');
  const { dbData: dreEntries, loading: loadingDRE } = useAnnualFinancialData(clientId, filterYear, 'DRE');
  const { dbData: dlpaEntries, loading: loadingDLPA } = useAnnualFinancialData(clientId, filterYear, 'DLPA');
  const { dbData: cashFlowDbData, loading: loadingDFC } = useAnnualFinancialData(clientId, filterYear, 'DFC');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(clientId);

  const { efosData, loading: loadingCashFlow } = useEFOSPageAdapter(selectedClient);
  const cashFlowData: any[] = cashFlowDbData && cashFlowDbData.length > 0 ? cashFlowDbData : (efosData || []);

  const bpSummary = useMemo(() => getComputedBPSummary(bpEntries), [bpEntries]);
  const { ebitda, lucroLiquido } = useMemo(() => getComputedDreMetrics(dreEntries), [dreEntries]);

  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingBP || loadingDRE || loadingDLPA || loadingDFC || loadingHistory || loadingCashFlow) return;

    const clientObj = clients?.find((c: any) => c.id === selectedClient);
    const segment = clientObj?.segmento || 'Default';

    const input = {
      clientProfile: clientObj,
      rawFinancialData: {
        bpSummary,
        ebitda,
        lucroLiquido,
        segmentoEmpresa: segment,
        prevPl: (() => {
          const acc = {} as any;
          allHistoryData.forEach(item => {
            const yr = item.year;
            if (!acc[yr]) acc[yr] = {};
            const contaNorm = (item.conta || '').toLowerCase();
            if (contaNorm.includes('patrimônio líquido') || contaNorm === 'pl') {
              acc[yr].pl = (acc[yr].pl || 0) + (item.val || 0);
            }
          });
          return acc[filterYear - 1]?.pl || 0;
        })(),
        dreDataLength: dreEntries.length,
        historicalCyclesCount: (() => {
          const cycles = Object.keys(allHistoryData.reduce((a, i) => { a[i.year] = true; return a; }, {} as any)).length;
          return cycles || 1;
        })(),
        filterYear: filterYear,
        allHistoryData: allHistoryData,
        cashFlowData: cashFlowData,
        dlpaData: dlpaEntries
      },
      bpData: bpEntries,
      dreData: dreEntries,
      dlpaData: dlpaEntries,
      cashFlowData: cashFlowData,
      historicalCyclesCount: (() => {
        const cycles = Object.keys(allHistoryData.reduce((a, i) => { a[i.year] = true; return a; }, {} as any)).length;
        return cycles || 1;
      })(),
      isMockData: (bpEntries.length === 0 && dreEntries.length === 0) || (cashFlowData.length === 0 && dlpaEntries.length === 0)
    };

    try {
      setGenerateError(null);
      setBindingError(null);
      // Generate executive report and sanitize prohibited keys
const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
const cleanReport = sanitizeReport(report);
function sanitizeReport(obj: any): any {
  if (obj == null) return obj;
  if (typeof obj === 'string') {
    // Skip prohibited string values
    return ExecutiveSemanticRegistry.PROHIBITED.has(obj) ? undefined : obj;
  }
  if (Array.isArray(obj)) {
    // Filter out prohibited strings in arrays and recursively sanitize elements
    const filtered = obj
      .map(sanitizeReport)
      .filter((v) => v !== undefined);
    return filtered;
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      if (ExecutiveSemanticRegistry.PROHIBITED.has(key)) {
        // skip prohibited key
        continue;
      }
      const sanitizedValue = sanitizeReport(obj[key]);
      if (sanitizedValue !== undefined) {
        cleaned[key] = sanitizedValue;
      }
    }
    return cleaned;
  }
  return obj;
}

      setExecutiveReport(cleanReport);

      const auditResult = audit(cleanReport);
      // Override audit result if forceFallback is enabled
      if (forceFallback) {
        setSemanticAudit({ pass: false, violations: ['forced fallback'] });
      } else {
        setSemanticAudit(auditResult);
      }

      const dreTotalRevenue = dreEntries.find((r: any) => r.category === 'RECEITA_BRUTA')?.value || 1;
      const dlpaRetained = dlpaEntries.find((r: any) =>
        r.category === 'LUCROS_RETIDOS' ||
        r.category === 'PREJUIZOS_ACUMULADOS' ||
        r.category === 'PREJUIZOS_ACUMULADOS' ||
        r.category === 'PREJUIZO_DO_EXERCICIO'
      )?.value || lucroLiquido;

      const dfcOCF = cashFlowData.reduce((acc, curr) => {
        const entries = curr.data || curr.entries || [curr];
        const fcoEntry = entries.find((e: any) =>
          ((e.category || '').toLowerCase().includes('operacional') || (e.category || '').toLowerCase().includes('operações') || (e.category || '').toLowerCase().includes('operacoes')) &&
          ((e.category || '').toLowerCase().includes('caixa') || (e.category || '').toLowerCase().includes('fco'))
        );
        return acc + (fcoEntry?.value || fcoEntry?.valor || curr.operatingCashFlow || curr.fco || 0);
      }, 0);
      const dfcFCF = cashFlowData.reduce((acc, curr) => acc + (curr.freeCashFlow || 0), 0);

      const metricInput = {
        ebitdaDre: ebitda,
        ebitdaEfos: ebitda,
        lucroLiquidoDre: lucroLiquido,
        lucroLiquidoEfos: lucroLiquido,
        fcoDfc: dfcOCF,
        fcoEfos: dfcOCF,
        caixaFinalDfc: dfcFCF,
        caixaFinalEfos: dfcFCF,
        patrimonioLiquidoBp: bpSummary?.patrimonioLiquido || 0,
        patrimonioLiquidoEfos: bpSummary?.patrimonioLiquido || 0,
        capitalConsumidoDlpa: dlpaRetained,
        capitalConsumidoEfos: dlpaRetained
      };

      const scoreInput = {
        calculatedScore: report.scores.composite,
        hasRevenue: dreTotalRevenue > 0,
        equityPositive: (bpSummary?.patrimonioLiquido || 0) > 0,
        operationalContinuity: dfcOCF >= 0 || (bpSummary?.patrimonioLiquido || 0) > 0
      };

      const crossStatementInput = {
        lucroLiquido: lucroLiquido,
        ebitda: ebitda,
        fco: dfcOCF,
        liquidezReal: (bpSummary?.ativoCirculante || 0) / (bpSummary?.passivoCirculante || 1),
        runway: dfcOCF < 0 ? Math.abs((bpSummary?.ativoCirculante || 0) / dfcOCF) : 99,
        capitalConsumido: dlpaRetained < 0 ? Math.abs(dlpaRetained) : 0
      };

      const snapshotInput = {
        isSurviving: dfcOCF >= 0,
        survivalContext: 'Análise de fluxo de caixa operacional e resiliência de tesouraria.',
        isValueCreated: lucroLiquido > 0,
        valueCreationContext: 'Análise de resultado final (DRE).',
        isCapitalProtected: (bpSummary?.patrimonioLiquido || 0) > 0,
        capitalContext: 'Análise de estrutura de capital (BP).',
        dominantRisk: report.financialThesis?.pressures?.[0] || 'Risco sistêmico.',
        priorityDecision: 'Revisão estratégica executiva.'
      };

      const rawRecs: ExecutiveRecommendation[] = report.advisory?.actionMatrix?.map((a: any) => ({
        text: a.title + ': ' + a.expectedImpact,
        type: a.category === 'Estratégico' ? 'BOARD' : 'EXECUTIVE',
        impact: a.priority === 'Alta' ? 'Muito Alto' : 'Alto'
      })) || [];

      const result = orchestrateExecutiveConsolidation(
        metricInput,
        scoreInput,
        snapshotInput,
        crossStatementInput,
        rawRecs,
        report,
        input.isMockData
      );
      setConsolidationResult(result);
    } catch (err: any) {
      if (err.message && err.message.includes('CROSS_STATEMENT_BINDING_FAILURE')) {
        try {
          const parsed = JSON.parse(err.message);
          setBindingError(parsed);
          setConsolidationResult(null);
        } catch {
          setGenerateError(err.message);
        }
      } else {
        console.error('Error generating executive report in overview:', err);
        setGenerateError(err.message || 'Erro desconhecido');
      }
    }
  }, [bpSummary, ebitda, lucroLiquido, dreEntries, bpEntries, dlpaEntries, cashFlowData, filterYear, allHistoryData, clients, selectedClient, loadingBP, loadingDRE, loadingDLPA, loadingHistory, loadingCashFlow, forceFallback]);

  const isLoading = loadingBP || loadingDRE || loadingDLPA || loadingHistory || loadingCashFlow || (!executiveReport && !generateError && !bindingError) || (!consolidationResult && !generateError && !bindingError);

  if (bindingError) {
    if (densityLevel === 'BOARD' || densityLevel === 'EXECUTIVE') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <AlertTriangle size={40} className="text-amber-500" />
          <span className="text-xl font-black text-muted-foreground text-center">Auditoria Fiduciária</span>
     <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary max-w-lg text-center">A análise de tensões foi bloqueada por inconsistência de vinculação fiduciária. Reprocessar o relatório antes de deliberação.</ExecutiveText>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <AlertTriangle size={40} className="text-rose-500" />
        <span className="text-xl font-black text-rose-500">CROSS_STATEMENT_BINDING_FAILURE</span>
        <pre className="text-xs text-rose-800 bg-critical-soft p-4 rounded-xl max-w-2xl overflow-auto w-full text-left">
          {JSON.stringify(bindingError, null, 2)}
        </pre>
      </div>
    );
  }

  if (generateError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <AlertTriangle size={40} className="text-rose-500" />
        <span className="text-xl font-black text-rose-500">Erro na Geração do Reporte</span>
        <pre className="text-xs text-rose-800 bg-critical-soft p-4 rounded-xl max-w-2xl overflow-auto">{generateError}</pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <Loader2 size={40} className="animate-spin text-muted-foreground" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Carregando inteligência institucional...</span>
      </div>
    );
  }

  if (semanticAudit && (!semanticAudit.pass || forceFallback)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <AlertTriangle size={40} className="text-rose-500" />
        <ExecutiveHeading as="h2" className="text-rose-600">{fallbackInstitutionalView.title}</ExecutiveHeading>
        <ExecutiveText as="div" variant="bodyStandard" className="text-rose-500">{fallbackInstitutionalView.message}</ExecutiveText>
      </div>
    );
  }

  // Extract variables from report
  const thesis = executiveReport?.financialThesis?.thesis || executiveReport?.orchestratedNarrative?.leadParagraph || 'Tese Indisponível';
  const pressures = executiveReport?.financialThesis?.pressures || [];
  const structuralRisks = executiveReport?.financialThesis?.structuralRisks || [];
  const tensions = executiveReport?.crossStatementCausality?.tensions || [];
  const actionMatrix = executiveReport?.advisory?.actionMatrix || [];
  const scores = executiveReport?.scores;
  const propagationChains = executiveReport?.propagationChains || [];
  const fiduciaryRationale = executiveReport?.fiduciaryRationale;

   return (
     <ExecutiveIntelligenceShell pageTitle="EFOS — Visão Executiva Integrada" pageContext="EFOSPage">
       <ExecutivePageTemplate header={{
         title: "EFOS — Executive Financial Operating System",
         description: "Infraestrutura integrada de interpretação do capital e governança fiduciária.",
       }}>
        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE INTELIGÊNCIA OPERACIONAL EFOS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: scores?.composite > 70 ? 'EFOS Saudável' : 'Atenção Fiduciária', variant: scores?.composite > 70 ? 'success' : 'warning' }}
          question="Qual a pontuação sintética de saúde financeira (EFOS Score), nível de resiliência e principais tensões cruzadas?"
          opinion="O comitê fiduciário homologa a análise EFOS, atestando a infraestrutura de dados e a interpretação sistêmica do capital."
          driver="Score composto, resiliência financeira, sustentabilidade da margem e encadeamento causal."
          implication="Visão unificada das demonstrações contábeis e mitigação proativa de riscos de insolvência."
          action="Executar as ações estratégicas recomendadas pelo painel de inteligência operacional."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* Selectors Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

           <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 bg-white border border-border rounded-xl shadow-sm flex items-center gap-3">
              <Calendar size={14} className="text-muted-foreground" />
              <select
                onChange={(e) => {
                  const yr = Number(e.target.value);
                  setFilterYear(yr);
                  if (setSelectedYear) setSelectedYear(yr);
                }}
                value={filterYear}
                className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer text-muted-foreground appearance-none pr-1"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-md border border-border">
              Modo: {t(`runtime.${executiveReport?.compliance?.runtimeMode}`)}
            </span>
          </div>
        
      </div>

         {/* EFOS KPI Cards */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <ExecutiveMetricCard density="analytical" label="Modo Runtime" value={executiveReport?.compliance?.runtimeMode || '—'} trend="neutral" />
           <ExecutiveMetricCard density="analytical" label="Ano Fiscal" value={String(filterYear)} trend="neutral" />
           <ExecutiveMetricCard density="analytical" label="Recomendações" value={String(actionMatrix?.length || 0)} trend="up" />
           <ExecutiveMetricCard density="analytical" label="Chains" value={String(propagationChains?.length || 0)} trend="neutral" />
         </div>

         <div className="mt-12 mb-8 border-t border-border pt-8" />
        {/* Board Top 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-primary-500" />
       <ExecutiveHeading as="h3" className="text-executive-secondary">Top 3 Decisões do Conselho</ExecutiveHeading>
            </div>
            <div className="space-y-4">
              {consolidationResult?.boardTop3?.length === 0 ? (
                <ExecutiveText as="div" variant="caption" className="text-muted-foreground italic">Sem decisões pendentes para o Conselho.</ExecutiveText>
              ) : (
                consolidationResult?.boardTop3?.map((rec, i) => {
                  const title = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.titulo || rec.text || rec.problema) || 'Decisão fiduciária requerida para mitigação de risco institucional.');
                  const problem = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.problema));
                  const expectedImpact = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.impactoEsperado));
                  const consequence = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.consequenciaInacao));
                  return (
                    <div key={i} className="p-4 border border-border bg-slate-50 rounded-2xl flex flex-col gap-2">
                      <ExecutiveHeading as="h4" className="text-muted-foreground">{title}</ExecutiveHeading>
                      {problem && <ExecutiveText as="div" variant="caption" className="text-muted-foreground mt-1"><span className="font-semibold text-muted-foreground">Problema:</span> {problem}</ExecutiveText>}
                      {expectedImpact && <ExecutiveText as="div" variant="caption" className="text-muted-foreground mt-1"><span className="font-semibold text-muted-foreground">Impacto Esperado:</span> {expectedImpact}</ExecutiveText>}
                      {consequence && <ExecutiveText as="div" variant="caption" className="text-rose-600 mt-1"><span className="font-semibold text-rose-700">Consequência da Inação:</span> {consequence}</ExecutiveText>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {(rec.prazoRecomendadoLabel || rec.prazoRecomendado) && <span className="text-[10px] font-bold text-muted-foreground bg-white border border-border px-2 py-1 rounded">Prazo: {rec.prazoRecomendadoLabel || rec.prazoRecomendado}</span>}
                        {rec.impactLabel && <span className="text-[10px] font-bold text-muted-foreground bg-white border border-border px-2 py-1 rounded">Impacto: {rec.impactLabel}</span>}
                        {rec.urgencyLabel && <span className="text-[10px] font-bold text-muted-foreground bg-white border border-border px-2 py-1 rounded">Urgência: {rec.urgencyLabel}</span>}
                        {rec.domain && <span className="text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2 py-1 rounded">Domínio: {rec.domain}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* Executive Top 5 */}
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
       <ExecutiveHeading as="h3" className="text-executive-secondary">{consolidationResult?.executiveTop5Title || 'Top 5 Ações da Diretoria'}</ExecutiveHeading>
            </div>
            <div className="space-y-4">
              {consolidationResult?.executiveTop5?.length === 0 ? (
                <ExecutiveText as="div" variant="caption" className="text-muted-foreground italic">Sem ações pendentes para a Diretoria.</ExecutiveText>
              ) : (
                consolidationResult?.executiveTop5?.map((rec, i) => {
                  const text = FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.text);
                  return (
                    <div key={i} className="p-4 border border-border bg-slate-50 rounded-2xl flex flex-col gap-2">
                      <ExecutiveHeading as="h4" className="text-muted-foreground">{text}</ExecutiveHeading>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-muted-foreground bg-white border border-border px-2 py-1 rounded">Impacto: {rec.impact}</span>
                        {rec.domain && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded">Domínio: {rec.domain}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <ExecutiveSummarySection 
          status={{ label: 'Sistema Operacional Fiduciário', variant: 'success' }}
          question="Como o EFOS consolida os motores de inteligência e governança fiduciária?"
          opinion="O comitê fiduciário chancela o EFOS como sistema central de orquestração do capital e pareceres executivos."
          driver="Síntese financeira, alinhamento C-Level, governança topológica e motor de recomendação."
          implication="Trilha unificada de governança para tomada de decisão em tempo real."
          action="Manter a calibração mensal dos motores preditivos e regras fiduciárias."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </ExecutivePageTemplate>
     </ExecutiveIntelligenceShell>
  );
}

export default EFOSPage;
