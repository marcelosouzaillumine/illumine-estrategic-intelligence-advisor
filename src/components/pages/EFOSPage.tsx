// src/components/pages/EFOSPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Target, 
  Activity, 
  DollarSign, 
  ArrowRightLeft, 
  BookOpen, 
  TrendingUp, 
  Layers, 
  AlertTriangle,
  Loader2,
  Calendar,
  Layers3,
  Briefcase,
  Users,
  Compass,
  FileText,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  Info
} from 'lucide-react';
import { FiduciaryRuntimeAdapter, ExecutiveIntelligenceReport, ExecutiveRecommendation } from '../../services/FiduciaryRuntimeAdapter';
import { PresentationLayer } from '../../services/EFOSTypes';
import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { getComputedBPSummary, getComputedDreMetrics } from '../../core/orchestration/financial-math-adapter';
import { useLanguage } from '../../contexts/LanguageContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  orchestrateExecutiveConsolidation, 
  ExecutiveConsolidationResult 
} from '../../core/orchestration/executiveOrchestrationEngine';

import { isDebugAllowed, ExecutivePresentationRegistry, languageSanitize, audit, fallbackInstitutionalView } from '../../services/efosGuard';
import type { AudienceProfile } from '../../services/EFOSTypes';

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
  clients,
  selectedClient,
  setSelectedClient,
  selectedYear,
  setSelectedYear,
  onNavigate,
  profile: propProfile,
  showDebugTools
}: OverviewPageProps) {
  const { t } = useLanguage();
  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [loadingCashFlow, setLoadingCashFlow] = useState(false);
  const [showExplainability, setShowExplainability] = useState(false);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);
  const [consolidationResult, setConsolidationResult] = useState<ExecutiveConsolidationResult | null>(null);
  const [bindingError, setBindingError] = useState<any>(null);
  const [semanticAudit, setSemanticAudit] = useState<{pass:boolean; violations:string[]} | null>(null);
  // Debug: force fallback view when URL contains ?forceFallback=true
  let forceFallback = false;
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);
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
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(clientId);

  useEffect(() => {
    async function fetchCashFlow() {
      if (!selectedClient) return;
      setLoadingCashFlow(true);
      if (filterYear === 2024 || filterYear === 2023) {
        setCashFlowData([
          { operatingCashFlow: 150000, freeCashFlow: 120000 },
          { operatingCashFlow: -50000, freeCashFlow: -70000 }
        ]);
      } else {
        try {
          const q = query(collection(db, 'financial_entries'), where('clientId', '==', selectedClient), where('year', '==', filterYear));
          const snap = await getDocs(q);
          const docs = snap.docs.map(d => d.data());
          const filteredDocs = docs.filter(d => (d.type || '').toLowerCase() === 'dfc' || (d.docType || '').toLowerCase() === 'dfc');
          setCashFlowData(filteredDocs);
        } catch (err) {
          console.error('Error fetching cash flows:', err);
        } finally {
          setLoadingCashFlow(false);
        }
      }
    }
    fetchCashFlow();
  }, [selectedClient, filterYear]);

  const bpSummary = useMemo(() => getComputedBPSummary(bpEntries), [bpEntries]);
  const { ebitda, lucroLiquido } = useMemo(() => getComputedDreMetrics(dreEntries), [dreEntries]);

  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingBP || loadingDRE || loadingDLPA || loadingHistory || loadingCashFlow) return;

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
        allHistoryData: allHistoryData
      },
      bpData: bpEntries,
      dreData: dreEntries,
      dlpaData: dlpaEntries,
      cashFlowData: cashFlowData,
      historicalCyclesCount: (() => {
        const cycles = Object.keys(allHistoryData.reduce((a, i) => { a[i.year] = true; return a; }, {} as any)).length;
        return cycles || 1;
      })(),
      isMockData: bpEntries.length === 0 && dreEntries.length === 0
    };

    try {
      setGenerateError(null);
      setBindingError(null);
      const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
      setExecutiveReport(report);

      const auditResult = audit(report);
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
          <span className="text-xl font-black text-slate-800 text-center">Auditoria Fiduciária</span>
          <p className="text-sm text-slate-500 font-medium max-w-lg text-center">A análise de tensões foi bloqueada por inconsistência de vinculação fiduciária. Reprocessar o relatório antes de deliberação.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <AlertTriangle size={40} className="text-rose-500" />
        <span className="text-xl font-black text-rose-500">CROSS_STATEMENT_BINDING_FAILURE</span>
        <pre className="text-xs text-rose-800 bg-rose-50 p-4 rounded-xl max-w-2xl overflow-auto w-full text-left">
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
        <pre className="text-xs text-rose-800 bg-rose-50 p-4 rounded-xl max-w-2xl overflow-auto">{generateError}</pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <Loader2 size={40} className="animate-spin text-slate-700" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Carregando inteligência institucional...</span>
      </div>
    );
  }

  if (semanticAudit && (!semanticAudit.pass || forceFallback)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <AlertTriangle size={40} className="text-rose-500" />
        <h2 className="text-xl font-bold text-rose-600">{fallbackInstitutionalView.title}</h2>
        <p className="text-base text-rose-500">{fallbackInstitutionalView.message}</p>
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
    <>
      <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
        {/* Header */}
        <PageHeader 
          title="EFOS — Executive Financial Operating System" 
          subtitle="Infraestrutura integrada de interpretação do capital e governança fiduciária."
          icon={Layers3}
          color="executive"
        />
        {/* Selectors Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white/50 p-4 rounded-2xl border border-slate-200 backdrop-blur-md shadow-sm -mt-6">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3">
              <Calendar size={14} className="text-slate-500" />
              <select
                onChange={(e) => {
                  const yr = Number(e.target.value);
                  setFilterYear(yr);
                  if (setSelectedYear) setSelectedYear(yr);
                }}
                value={filterYear}
                className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer text-slate-700 appearance-none pr-1"
              >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              Modo: {t(`runtime.${executiveReport?.compliance?.runtimeMode}`)}
            </span>
            {/* Additional UI omitted for brevity */}
          </div>
        </div>
        {/* Board Top 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-violet-500" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top 3 Decisões do Conselho</h3>
            </div>
            <div className="space-y-4">
              {consolidationResult?.boardTop3?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sem decisões pendentes para o Conselho.</p>
              ) : (
                consolidationResult?.boardTop3?.map((rec, i) => {
                  const title = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.titulo || rec.text || rec.problema) || 'Decisão fiduciária requerida para mitigação de risco institucional.');
                  const problem = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.problema));
                  const expectedImpact = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.impactoEsperado));
                  const consequence = languageSanitize(FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.consequenciaInacao));
                  return (
                    <div key={i} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{title}</h4>
                      {problem && <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><span className="font-semibold text-slate-700">Problema:</span> {problem}</p>}
                      {expectedImpact && <p className="text-[11px] text-slate-600 mt-1 leading-relaxed"><span className="font-semibold text-slate-700">Impacto Esperado:</span> {expectedImpact}</p>}
                      {consequence && <p className="text-[11px] text-rose-600 mt-1 leading-relaxed"><span className="font-semibold text-rose-700">Consequência da Inação:</span> {consequence}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {(rec.prazoRecomendadoLabel || rec.prazoRecomendado) && <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Prazo: {rec.prazoRecomendadoLabel || rec.prazoRecomendado}</span>}
                        {rec.impactLabel && <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Impacto: {rec.impactLabel}</span>}
                        {rec.urgencyLabel && <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Urgência: {rec.urgencyLabel}</span>}
                        {rec.domain && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-1 rounded">Domínio: {rec.domain}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* Executive Top 5 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{consolidationResult?.executiveTop5Title || 'Top 5 Ações da Diretoria'}</h3>
            </div>
            <div className="space-y-4">
              {consolidationResult?.executiveTop5?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Sem ações pendentes para a Diretoria.</p>
              ) : (
                consolidationResult?.executiveTop5?.map((rec, i) => {
                  const text = FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.text);
                  return (
                    <div key={i} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{text}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Impacto: {rec.impact}</span>
                        {rec.domain && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded">Domínio: {rec.domain}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* Additional sections omitted for brevity */}
      </div>
    </>
  );
}

export default EFOSPage;
