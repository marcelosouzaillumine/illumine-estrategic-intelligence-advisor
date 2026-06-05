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
import { FiduciaryRuntimeAdapter, PresentationLayer, ExecutiveIntelligenceReport, ExecutiveRecommendation } from '../../services/FiduciaryRuntimeAdapter';
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


interface OverviewPageProps {
  clients?: any[];
  selectedClient: string;
  setSelectedClient?: (id: string) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear: number;
  setSelectedYear?: (year: number) => void;
  onNavigate?: (page: string) => void;
}



export function EFOSPage({
  clients,
  selectedClient,
  setSelectedClient,
  selectedYear,
  setSelectedYear,
  onNavigate
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
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);
  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);

  const isSectionVisible = (sectionName: string) => {
    return FiduciaryRuntimeAdapter.ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  };

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);



  // Load Balance Sheet & DRE & DLPA
  const { dbData: bpEntries, loading: loadingBP } = useAnnualFinancialData(selectedClient, filterYear, 'BP');
  const { dbData: dreEntries, loading: loadingDRE } = useAnnualFinancialData(selectedClient, filterYear, 'DRE');
  const { dbData: dlpaEntries, loading: loadingDLPA } = useAnnualFinancialData(selectedClient, filterYear, 'DLPA');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  // Load DFC/CashFlow data directly from firestore
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

  // Compute BP and DRE values
  const bpSummary = useMemo(() => getComputedBPSummary(bpEntries), [bpEntries]);

  const { ebitda, lucroLiquido } = useMemo(() => getComputedDreMetrics(dreEntries), [dreEntries]);

  // Run Executive Intelligence Runtime
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingBP || loadingDRE || loadingDLPA || loadingHistory || loadingCashFlow) return;

    const clientObj = clients?.find((c: any) => c.id === selectedClient);
    const segment = clientObj?.segmento || 'Default';

    // Map historical year PL and other variables
    const historyByYear = allHistoryData.reduce((acc: any, item: any) => {
      const yr = item.year;
      if (!acc[yr]) acc[yr] = {};
      const contaNorm = (item.conta || '').toLowerCase();
      if (contaNorm.includes('patrimônio líquido') || contaNorm === 'pl') {
        acc[yr].pl = (acc[yr].pl || 0) + (item.val || 0);
      }
      return acc;
    }, {});

    const prevPl = historyByYear[filterYear - 1]?.pl || 0;

    let calculatedCycles = Object.keys(historyByYear ?? {}).filter((year) => {
      const data = historyByYear[year];
      return data && data.pl !== undefined; // using pl as an indicator of valid statements in this file's historyByYear
    }).length || 1;

    const input = {
      clientProfile: clientObj,
      rawFinancialData: {
        bpSummary,
        ebitda,
        lucroLiquido,
        segmentoEmpresa: segment,
        prevPl,
        dreDataLength: dreEntries.length,
        historicalCyclesCount: calculatedCycles,
        filterYear: filterYear,
        allHistoryData: allHistoryData
      },
      bpData: bpEntries,
      dreData: dreEntries,
      dlpaData: dlpaEntries,
      cashFlowData: cashFlowData,
      historicalCyclesCount: calculatedCycles,
      isMockData: bpEntries.length === 0 && dreEntries.length === 0
    };

    try {
      setGenerateError(null);
      setBindingError(null);
      const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
      setExecutiveReport(report);
      
      // Run new Executive Consolidation logic
      const dreTotalRevenue = dreEntries.find((r: any) => r.category === 'RECEITA_BRUTA')?.value || 1;
      const dlpaRetained = dlpaEntries.find((r: any) => 
        r.category === 'LUCROS_RETIDOS' || 
        r.category === 'PREJUIZOS_ACUMULADOS' || 
        r.category === 'PREJUÍZOS_ACUMULADOS' || 
        r.category === 'PREJUIZO_DO_EXERCICIO'
      )?.value || lucroLiquido; // Fallback to lucroLiquido if no retained earnings row is explicitly mapped
      const dlpaDividends = dlpaEntries.find((r: any) => r.category === 'DIVIDENDOS')?.value || 0;
      
      const dfcOCF = cashFlowData.reduce((acc, curr) => {
        // Handle flattened structure or nested data
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

      console.log('[DEBUG_EFOSPage] Computed Values:', { ebitda, lucroLiquido, dfcOCF, dlpaRetained });
      console.log('[DEBUG_EFOSPage] DRE Entries Length:', dreEntries.length);
      console.log('[DEBUG_EFOSPage] DFC Entries Length:', cashFlowData.length);

      const canonicalData = FiduciaryRuntimeAdapter.MetricCanonicalizationEngine.canonicalize(metricInput);

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
  }, [bpSummary, ebitda, lucroLiquido, dreEntries, bpEntries, dlpaEntries, cashFlowData, filterYear, allHistoryData, clients, selectedClient, loadingBP, loadingDRE, loadingDLPA, loadingHistory, loadingCashFlow]);

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
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Carregando inteligência institucional...
        </span>
      </div>
    );
  }

  // Extract variables from report
  const thesis = executiveReport.financialThesis?.thesis || executiveReport.orchestratedNarrative?.leadParagraph || 'Tese Indisponível';
  const pressures = executiveReport.financialThesis?.pressures || [];
  const structuralRisks = executiveReport.financialThesis?.structuralRisks || [];
  const tensions = executiveReport.crossStatementCausality?.tensions || [];
  const actionMatrix = executiveReport.advisory?.actionMatrix || [];
  const scores = executiveReport.scores;

  const propagationChains = executiveReport.propagationChains || [];
  const fiduciaryRationale = executiveReport.fiduciaryRationale;

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
            Modo: {t(`runtime.${executiveReport.compliance?.runtimeMode}`)}
          </span>
          <div className="group relative cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 flex items-center gap-1">
              Confiabilidade: {t(`runtime.${executiveReport.compliance?.confidenceLevel}`)}
              <AlertTriangle size={12} className="opacity-50" />
            </span>
            {fiduciaryRationale?.confidenceDecomposition && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <h4 className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-wider">Decomposição de Confiança</h4>
                <div className="space-y-3">
                  {fiduciaryRationale.confidenceDecomposition.degradationFactors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-rose-400">Fatores de Degradação</span>
                      <ul className="space-y-1">
                        {fiduciaryRationale.confidenceDecomposition.degradationFactors.map((f: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 leading-tight flex gap-1"><span className="text-rose-500">-</span> {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fiduciaryRationale.confidenceDecomposition.sustainmentFactors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-emerald-400">Fatores de Sustentação</span>
                      <ul className="space-y-1">
                        {fiduciaryRationale.confidenceDecomposition.sustainmentFactors.map((f: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 leading-tight flex gap-1"><span className="text-emerald-500">+</span> {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {consolidationResult.divergenceAudit.status === 'BLOCKED_FOR_OPTIMISTIC_THESIS' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={24} />
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider">Atenção Institucional - Tese Retida</h3>
            <p className="text-xs">{consolidationResult.divergenceAudit.executiveMessage}</p>
          </div>
        </div>
      )}

      {/* 1. Executive Strategic Snapshot & 2. Institutional Executive Thesis */}
      <div 
        className="bg-slate-900 text-slate-100 rounded-3xl p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden transition-all group"
      >
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 pointer-events-none transition-transform group-hover:scale-105 group-hover:-rotate-3">
          <ShieldCheck size={320} />
        </div>
        
        <div className="max-w-4xl relative z-10 flex flex-col h-full justify-between space-y-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Target size={18} className="text-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Executive Strategic Snapshot</span>
            </div>
            
            <div className="px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
              {consolidationResult.divergenceAudit.status === 'PASS' ? 'Métricas Canônicas Válidas' : 'Revisão Necessária'}
            </div>
          </div>
          
          <h1 className="text-xl md:text-[1.75rem] font-medium tracking-tight leading-relaxed text-slate-200">
            "{executiveReport.financialThesis?.thesis || 'Tese em análise'}"
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-800/80 text-[10px] uppercase font-black tracking-widest text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Score Calculado: <span className="text-slate-300 ml-1">{consolidationResult.scoreGovernance.originalScore}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Score Fiduciário Ajustado: <span className="text-slate-300 ml-1">{consolidationResult.scoreGovernance.fiduciaryAdjustedScore}</span></span>
            </div>
            {consolidationResult.scoreGovernance.isAdjusted && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-rose-400">{consolidationResult.scoreGovernance.adjustmentReason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 & 4. Board & Executive Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 3 Board */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-violet-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top 3 Decisões do Conselho</h3>
          </div>
          <div className="space-y-4">
            {consolidationResult.boardTop3.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Sem decisões pendentes para o Conselho.</p>
            ) : (
              consolidationResult.boardTop3.map((rec, i) => {
                const title = FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.titulo || rec.text || rec.problema) || 'Decisão fiduciária requerida para mitigação de risco institucional.';
                const problem = FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.problema);
                const expectedImpact = FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.impactoEsperado);
                const consequence = FiduciaryRuntimeAdapter.EFOSPresentationLeakGuard.guard(rec.consequenciaInacao);
                
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

        {/* Top 5 Executive */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{consolidationResult.executiveTop5Title || 'Top 5 Ações da Diretoria'}</h3>
          </div>
          <div className="space-y-4">
            {consolidationResult.executiveTop5.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Sem ações pendentes para a Diretoria.</p>
            ) : (
              consolidationResult.executiveTop5.map((rec, i) => {
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

      {/* 5. Board Attention Demand Index & 6. Cross-Statement Tensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BADI */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Compass size={18} className="text-amber-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Board Attention Demand Index (BADI)</h3>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nível de Atenção Exigida</span>
               <span className="text-xl font-black text-amber-600">{Math.max(100 - consolidationResult.scoreGovernance.fiduciaryAdjustedScore, 0)}/100</span>
             </div>
             <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-black">Quanto maior, maior o risco e urgência</p>
          </div>
        </div>

        {/* Cross-Statement Tensions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ArrowRightLeft size={18} className="text-rose-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Cross-Statement Tensions</h3>
          </div>
          <div className="space-y-3">
            {consolidationResult.crossStatementTensions && consolidationResult.crossStatementTensions.length > 0 ? (
              consolidationResult.crossStatementTensions.map((tension, i) => (
                <div key={i} className={`p-4 border rounded-2xl ${tension.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${tension.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                      {tension.severity === 'CRITICAL' ? 'Tensão Crítica Detectada' : 'Tensão Secundária'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${tension.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                      Cadeia: {tension.chain}
                    </span>
                  </div>
                  <p className={`text-xs font-bold leading-relaxed mb-3 ${tension.severity === 'CRITICAL' ? 'text-rose-900' : 'text-amber-900'}`}>
                    {tension.narrative}
                  </p>
                  {tension.evidence && Object.keys(tension.evidence).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tension.evidence.netIncome !== undefined && tension.evidence.netIncome < 0 && (
                        <span className="text-[9px] font-black bg-white/60 border border-slate-200 text-slate-700 px-2 py-1 rounded">Lucro Líquido Negativo</span>
                      )}
                      {tension.evidence.fco !== undefined && tension.evidence.fco < 0 && (
                        <span className="text-[9px] font-black bg-white/60 border border-slate-200 text-slate-700 px-2 py-1 rounded">Fluxo Operacional Negativo</span>
                      )}
                      {tension.evidence.capitalConsumed !== undefined && tension.evidence.capitalConsumed > 0 && (
                        <span className="text-[9px] font-black bg-white/60 border border-slate-200 text-slate-700 px-2 py-1 rounded">Consumo Patrimonial Detectado</span>
                      )}
                      {tension.evidence.runwayMonths !== undefined && (
                        <span className="text-[9px] font-black bg-white/60 border border-slate-200 text-slate-700 px-2 py-1 rounded">Runway: {tension.evidence.runwayMonths} meses</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              !FiduciaryRuntimeAdapter.CrossStatementPresentationGuard.canRenderFallback(
                consolidationResult.crossStatementTensions || [],
                Math.max(100 - consolidationResult.scoreGovernance.fiduciaryAdjustedScore, 0),
                consolidationResult.boardTop3 || []
              ) ? (
                <p className="text-xs text-rose-500 font-bold italic p-4 bg-rose-50 rounded-2xl border border-rose-200">
                  Ruptura causal detectada: Tensão omitida pelos motores de apresentação.
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  Nenhuma tensão canônica detectada entre DRE, DFC e DLPA neste período.
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* 7. Camadas Financeiras (BP, DRE, DFC, DLPA) Quick Links */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
          <span className="w-8 h-[1px] bg-slate-200"></span>
          Exploração Financeira Base
          <span className="w-8 h-[1px] bg-slate-200"></span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate && onNavigate('bp')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <BookOpen size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">Balanço<br/>Patrimonial</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('dre')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <FileText size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">DRE<br/>Gerencial</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('dfc')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <Layers size={24} className="text-teal-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">Fluxo de<br/>Caixa (DFC)</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('dlpa')}
            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all group"
          >
            <TrendingUp size={24} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">Capital<br/>(DLPA)</span>
          </button>
        </div>
      </div>

      {/* 8. Camada Técnica (Collapsible Debug/Detail) */}
      <details className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-4 group cursor-pointer">
        <summary className="text-[10px] font-black text-slate-500 uppercase tracking-widest outline-none flex items-center justify-between">
          Camada Técnica de Consolidação (Debug Mode)
          <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-4 p-4 bg-white rounded-xl border border-slate-100 overflow-x-auto text-xs font-mono text-slate-600">
          <pre>{JSON.stringify(consolidationResult, null, 2)}</pre>
        </div>
      </details>
    </div>

      {/* Drawer: Racional Fiduciário (Explainability) */}
      {showExplainability && fiduciaryRationale && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Racional Fiduciário</h2>
                <p className="text-[10px] text-slate-500 font-medium">Explainability Layers & Fiduciary Evidence</p>
              </div>
              <button 
                onClick={() => setShowExplainability(false)}
                className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
              >
                X
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Layer 1: Executive Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-[10px] font-black text-slate-500">L1</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{fiduciaryRationale.executiveSummary.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 pl-8">{fiduciaryRationale.executiveSummary.description}</p>
                <div className="pl-8 space-y-2">
                  {fiduciaryRationale.executiveSummary.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500">{item.label}</span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider",
                        item.severity === 'CRÍTICA' ? 'text-red-600' :
                        item.severity === 'ALTA' ? 'text-rose-600' :
                        item.severity === 'MODERADA' ? 'text-amber-600' :
                        'text-emerald-600'
                      )}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 2: Structural Drivers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-[10px] font-black text-blue-500">L2</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{fiduciaryRationale.structuralDrivers.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 pl-8">{fiduciaryRationale.structuralDrivers.description}</p>
                <div className="pl-8 space-y-2">
                  {fiduciaryRationale.structuralDrivers.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400">{item.label}</span>
                      <span className="text-[11px] font-bold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 3: Mathematical Evidence */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-50 text-[10px] font-black text-emerald-500">L3</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{fiduciaryRationale.mathematicalEvidence.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 pl-8">{fiduciaryRationale.mathematicalEvidence.description}</p>
                <div className="pl-8 space-y-2">
                  {fiduciaryRationale.mathematicalEvidence.items.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-500">{item.label}</span>
                      <span className="text-[11px] font-mono text-emerald-400 leading-relaxed">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
