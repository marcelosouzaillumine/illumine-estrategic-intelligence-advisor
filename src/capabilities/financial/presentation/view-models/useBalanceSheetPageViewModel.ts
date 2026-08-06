// @ts-nocheck
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SandboxWarningOverlay } from '../../../../components/executive-interaction/SandboxWarningOverlay';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BookOpen, Database, TrendingUp, TrendingDown, Info, BarChart3, PieChart as PieChartIcon, AlertCircle, Activity, Target, AlertTriangle, Lightbulb, Zap, ShieldCheck, Gem, Crosshair, Layers, PiggyBank, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { cn, formatCurrency, formatValue } from '../../../../lib/utils';
import { StatusBadge, PageHeader } from '../../../../components/Common';
import { BalanceSheetDataSourceStatus } from '../../../../components/pages/balance-sheet/BalanceSheetDataSourceStatus';
import { BalanceSheetYearFilter } from '../../../../components/pages/balance-sheet/BalanceSheetYearFilter';
import { BalanceSheetActionToolbar } from '../../../../components/pages/balance-sheet/BalanceSheetActionToolbar';


import { BalanceSheetCapitalEfficiencySection } from '../../../../components/pages/balance-sheet/BalanceSheetCapitalEfficiencySection';
import { BalanceSheetLiquiditySection } from '../../../../components/pages/balance-sheet/BalanceSheetLiquiditySection';
import { BalanceSheetWorkingCapitalSection } from '../../../../components/pages/balance-sheet/BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from '../../../../components/pages/balance-sheet/BalanceSheetAssetQualitySection';
import { BalanceSheetCapitalStructureSection } from '../../../../components/pages/balance-sheet/BalanceSheetCapitalStructureSection';
import { BalanceSheetInstitutionalContextSection } from '../../../../components/pages/balance-sheet/BalanceSheetInstitutionalContextSection';
import { BalanceSheetTechnicalLayerSection } from '../../../../components/pages/balance-sheet/BalanceSheetTechnicalLayerSection';
import { BalanceSheetExecutiveViewModelBuilder } from '../../../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';
import { FinancialAnalyticsBuilder } from '../../../../core/runtime/executive-consolidation/builders/FinancialAnalyticsBuilder';
import { BalanceSheetAuditLayerSection } from '../../../../components/pages/balance-sheet/BalanceSheetAuditLayerSection';
import { BalanceSheetWaterfallChartSection } from '../../../../components/pages/balance-sheet/BalanceSheetWaterfallChartSection';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveStrategicTensionEngine } from '../../../../core/runtime/executive-consolidation/ExecutiveStrategicTensionEngine';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { BalanceSheetEvolutionAnalysisSection } from '../../../../components/pages/balance-sheet/BalanceSheetEvolutionAnalysisSection';
import { BalanceSheetCompositionChartsSection } from '../../../../components/pages/balance-sheet/BalanceSheetCompositionChartsSection';
import { ExecutiveExposureCard } from '../../../../components/ui/executive-exposure-card';
import { BalanceSheetExecutiveSynthesisSection } from '../../../../components/pages/balance-sheet/BalanceSheetExecutiveSynthesisSection';
import { BalanceSheetStructuralTablesSection } from '../../../../components/pages/balance-sheet/BalanceSheetStructuralTablesSection';
import { BalanceSheetCapitalPreservationSection } from '../../../../components/pages/balance-sheet/BalanceSheetCapitalPreservationSection';
import { BalanceSheetWaterfallInputPoint } from '../../../../components/pages/balance-sheet/types';
import { BPStrategicDiagnosisAdapter } from '../../../../components/pages/balance-sheet/adapters/BPStrategicDiagnosisAdapter';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useAnnualFinancialData, useAllFinancialData } from '../../../../hooks/useFinancialData';
import { ImportFinancialModal } from '../../../../components/modals/ImportFinancialModal';
import { ManualFinancialModal } from '../../../../components/modals/ManualFinancialModal';
import { buildBPHierarchy } from '../../../../lib/bpEngine';
import { calculateDreCascade, generateInitialDreState } from '../../../../lib/dreCascade';
import { FiduciaryRuntimeAdapter, PresentationLayer, ExecutiveIntelligenceReport, ExecutiveLabelResolver } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveLocaleEnforcer } from '../../../../core/enforcement/ExecutiveLocaleEnforcer';
import { InstitutionalDecisionOS } from "../../../../../packages/intelligence/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS";
import { DashboardStateBuilder } from "../../../../../packages/intelligence/executive-intelligence-layer/src/presentation/DashboardStateBuilder";
import { FirestoreAuthAdapter } from '../../../../adapters/persistence/FirestoreAuthAdapter';
import { useInstitutionalAuth } from '../../../../core/security/auth/InstitutionalAuthProvider';
import { BalanceSheetApplicationService } from '../../application/BalanceSheetApplicationService';
import { financialAnalysisService } from '../../application/usecases/BalanceSheetIntelligenceUseCase';

// Ensure ToastType is available
export type ToastType = { type: 'success' | 'error'; message: string } | null;

export function useBalanceSheetPageViewModel({ clients, selectedClient, selectedYear }: any) {

  const { translateLabel, t } = useLanguage();
  const { session } = useInstitutionalAuth();
  const userRole = session?.role || 'BOARD_MEMBER';
  const [filterYear, setFilterYear] = useState<number>(Number(selectedYear) || new Date().getFullYear());
  const profile = useMemo(() => FiduciaryRuntimeAdapter.getProfile(FiduciaryRuntimeAdapter.mapOfficialRoleToProfileId(userRole)), [userRole]);
  const [densityLevel, setDensityLevel] = useState<PresentationLayer>(profile.defaultDensity);
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showCamada2, setShowCamada2] = useState(false);
  const [showCamada3, setShowCamada3] = useState(false);
  const [showFullStressTests, setShowFullStressTests] = useState(false);

  

  useEffect(() => {
    if (selectedYear) setFilterYear(Number(selectedYear));
  }, [selectedYear]);

  // ── Busca dados anuais (BP) ────────────────────────────────────────────────
  const { dbData: financialEntries, loading, error, refetch } = useAnnualFinancialData(selectedClient, filterYear, 'BP');


  // ── Busca dados operacionais (DRE) ─────────────────────────────────────────
  // ── Busca dados operacionais (DRE Contábil) ─────────────────────────────────────────
  const { dbData: dreDbData } = useAnnualFinancialData(selectedClient, filterYear, 'DRE');
  const { dbData: dlpaDbData } = useAnnualFinancialData(selectedClient, filterYear, 'DLPA');
  const { dbData: cashFlowDbData } = useAnnualFinancialData(selectedClient, filterYear, 'DFC');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory, historicalFinancialSeries } = useAllFinancialData(selectedClient);

  const loadingBP = loading;

  const { flatNodes: rows, summary: bpSummary } = useMemo(() => {
    if (financialEntries.length > 0) {
      const aggregated: any = {};
      financialEntries.forEach((d: any) => {
        const type = (d.tipo || d.type || '').trim().toLowerCase();
        const category = (d.conta || d.category || '').trim();
        const key = `${type}_${category.toLowerCase()}`;
        
        if (!aggregated[key]) {
          aggregated[key] = { 
            ...d, 
            val: (d.val ?? d.valor ?? d.value ?? 0),
            conta: category,
            level: d.level ?? 1
          };
        } else {
          if (aggregated[key].val === 0 && (d.val ?? d.valor ?? d.value ?? 0) !== 0) {
             aggregated[key].val = (d.val ?? d.valor ?? d.value ?? 0);
          }
        }
      });
      const arr = Object.values(aggregated) as any[];
      arr.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
      return buildBPHierarchy(arr);
    }
    return { flatNodes: [] as any[], summary: {} as any };
  }, [financialEntries]);

  // ── Local Mapper for specific indicators ─────────────────────────────────
  const mapIndicatorsToViewModels = ({ indicators, metricNames, resolveLabel }: any) => {
    if (!indicators) return [];
    return indicators
      .filter((i: any) => metricNames.includes(i.metricName))
      .map((i: any) => {
        let tone: 'success' | 'warning' | 'critical' | 'neutral' = 'neutral';
        const c = String(i.classification).toUpperCase();
        if (['CRITICAL', 'SEVERE', 'TREASURY_STRESS', 'SHORT_TERM_PRESSURE'].includes(c)) tone = 'critical';
        else if (['WARNING', 'ATTENTION'].includes(c)) tone = 'warning';
        return {
          familyName: i.family || '',
          label: resolveLabel(i.metricName),
          formula: '',
          value: i.value !== null && i.value !== undefined ? String(i.value) : '—',
          classificationLabel: resolveLabel(i.classification || ''),
          purpose: '', limitations: '', referenceRange: '', methodologicalNotes: '',
          origin: { sourceEngine: 'LocalMapper', sourceRule: 'Fallback', confidence: 100, lastValidatedAt: new Date().toISOString() }
        };
      });
  };

  // ── Processamento Histórico ────────────────────────────────────────────────
  const historyByYear = useMemo(() => {
    const years = [filterYear, filterYear - 1, filterYear - 2, filterYear - 3, filterYear - 4, filterYear - 5];
    const data: any = {};
    
    years.forEach(y => {
      const yearEntries = allHistoryData.filter((d: any) => d.year === y && (d.type === 'Balanço Patrimonial' || d.type === 'BP'));
      if (yearEntries.length > 0) {
        data[y] = yearEntries;
      } else {
        data[y] = [];
      }
    });
    return data;
  }, [allHistoryData, selectedClient, filterYear]);

    const majorChanges: any[] = [];
    const refetchBP = refetch;

    const getYearSummary = (y: number) => {
      const yearRows = historyByYear[y] || [];
  
      const getSumRobust = (source: any[], possibleNames: string[]) => {
        const match = source.find(s => {
          const sName = (s.category || s.conta || '').toLowerCase();
          const cleanName = sName.replace(/^[0-9.]+\s*[-]\s*/, '').replace(/^[(-/+)\s]+/, '').trim();
          return possibleNames.some(p => cleanName === p || cleanName.includes(p));
        });
        return match?.value || match?.val || match?.valor || 0;
      };
  
      let ativoTotal = getSumRobust(yearRows, ['ativo total', 'total do ativo']);
      if (!ativoTotal) {
        const ac = getSumRobust(yearRows, ['ativo circulante', 'circulante']);
        const anc = getSumRobust(yearRows, ['ativo não circulante', 'não circulante']);
        ativoTotal = ac + anc;
      }
      if (!ativoTotal) {
        const ativoRows = yearRows.filter((r: any) => (r.type || r.tipo || r.entryType || '').toLowerCase() === 'ativo');
        ativoTotal = ativoRows.reduce((acc, r) => acc + (r.value || r.val || r.valor || 0), 0);
      }
  
      let passivoTotal = getSumRobust(yearRows, ['passivo total', 'total do passivo']);
      if (!passivoTotal) {
        const pc = getSumRobust(yearRows, ['passivo circulante', 'circulante']);
        const pnc = getSumRobust(yearRows, ['passivo não circulante', 'não circulante']);
        passivoTotal = pc + pnc;
      }
      if (!passivoTotal) {
        const passivoRows = yearRows.filter((r: any) => (r.type || r.tipo || r.entryType || '').toLowerCase() === 'passivo' && !((r.category || r.conta || '').toLowerCase().includes('patrimônio')));
        passivoTotal = passivoRows.reduce((acc, r) => acc + (r.value || r.val || r.valor || 0), 0);
      }
  
      let pl = getSumRobust(yearRows, ['patrimônio líquido', 'pl', 'total do patrimônio líquido', 'patrimônio']);
      if (!pl) {
        const plRows = yearRows.filter((r: any) => {
          const t = (r.type || r.tipo || r.entryType || '').toLowerCase();
          const c = (r.category || r.conta || '').toLowerCase();
          return t === 'patrimônio líquido' || t === 'pl' || c.includes('patrimônio líquido') || c === 'pl';
        });
        pl = plRows.reduce((acc, r) => acc + (r.value || r.val || r.valor || 0), 0);
      }
      
      return { ativoTotal, passivoTotal, pl };
    };

  const chartData = useMemo(() => {
    return [5, 4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const summary = getYearSummary(y);
      
      let passivoExigivel = summary.passivoTotal;
      if (summary.passivoTotal > 0 && Math.abs(summary.passivoTotal - summary.ativoTotal) < 1) {
          passivoExigivel = summary.passivoTotal - summary.pl;
      }
      
      return {
        year: y.toString(),
        ativo: summary.ativoTotal,
        passivo: passivoExigivel,
        pl: summary.pl
      };
    }).filter(d => d.ativo > 0 || d.passivo > 0 || d.pl > 0);
  }, [historyByYear, filterYear]);

  const {
    ativoTotal,
    ativoCirculante: ac,
    ativoNaoCirculante: anc,
    passivoTotal,
    passivoCirculante: pc,
    passivoNaoCirculante: pnc,
    patrimonioLiquido: plValue,
    isBalanced,
    divergence,
    caixaEquivalentes: cx,
    estoques: est,
    clientes,
    fornecedores,
    passivosFinanceiros,
    capitalSocial,
    lucrosPrejuizos: valorPrejuizo,
    altaConversibilidade: valAltaConversibilidade,
    mediaConversibilidade: valMediaConversibilidade,
    baixaConversibilidade: valBaixaConversibilidade,
    restritaConversibilidade: valConversibilidadeRestrita,
    creditosSocios
  } = bpSummary || {} as any;

  const intelligenceOutput = useMemo(() => {
    if (!bpSummary) return null;
    const output = financialAnalysisService.analyzeBalanceSheet(bpSummary);
    
    // Map the new 5-axis ExecutiveIntelligenceOutput to the legacy format expected by the React components
    if (output && output.meta) {
      return {
        indicators: output.reasoning.facts || [],
        diagnostics: output.reasoning.findings || [],
        insights: output.reasoning.insights || [],
        recommendations: output.decision.recommendations || [],
        confidence: output.governance.confidence,
        assurance: output.governance.validation,
        executiveNarrative: (output.governance.evidence as any)?.executiveNarrative,
        ...output.governance.evidence // Spread legacy fields if any components depend on them
      };
    }
    
    return output;
  }, [bpSummary]);

  const financialIndicators = useMemo(() => {
    return intelligenceOutput?.indicators || [];
  }, [intelligenceOutput]);

  const diagnostics = intelligenceOutput;

  const parseMetricStr = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    let s = String(val).replace(/[^\d.,-]/g, '');
    if (s.includes(',') && s.includes('.')) {
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
        s = s.replace(/\./g, '').replace(',', '.');
      } else {
        s = s.replace(/,/g, '');
      }
    } else if (s.includes(',')) {
      s = s.replace(',', '.');
    }
    return parseFloat(s) || 0;
  };

  const { ebitda, lucroLiquido } = useMemo(() => {
    if (dreDbData.length === 0) return { ebitda: 0, lucroLiquido: 0 };

    const mappedRows = dreDbData
      .filter((r: any) => r.dreTipo !== 'SINTETICA') 
      .map((r: any) => {
        if (r.parentId) return r; 
        const cat = (r.category || r.conta || '').toLowerCase();
        if (
          cat.includes('receita líquida') || cat.includes('receita operacional líquida') ||
          cat.includes('lucro bruto') || cat === 'ebitda' || cat === 'ebit' ||
          cat.includes('resultado operacional líquido') || cat.includes('lajida') ||
          cat.includes('lucro líquido') || cat.includes('lair') || cat.includes('resultado antes')
        ) return null;

        let parentId = '';
        if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') ||
            (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
          parentId = 'ROB';
        } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
          parentId = 'DED';
        } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
          parentId = 'CUSTOS';
        } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
          parentId = 'DEP_AMORT';
        } else if (cat.includes('financeir') || cat.includes('juros') || cat.includes('encargo')) {
          parentId = 'RESULT_FIN';
        } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
          parentId = 'PROV_IR_CSLL';
        } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais') || cat.includes('outras receitas e despesas')) {
          parentId = 'OUTRAS_REC_DESP';
        } else {
          parentId = 'DESP_OPER';
        }
        return { ...r, parentId, value: r.val || r.valor || r.value || 0 };
      })
      .filter(Boolean);

    const allRows = [
      ...generateInitialDreState(),
      ...mappedRows.map((r: any) => {
        const val = parseMetricStr(r.value || r.val);
        return {
          ...r,
          val,
          value: val
        };
      })
    ];

    const cascadeResult = calculateDreCascade(allRows);
    const directEbitda = cascadeResult.find(r => r.id === 'EBITDA')?.computedValue || 0;
    const directLucro = cascadeResult.find(r => r.id === 'LUCRO_LIQ')?.computedValue || 0;
    return { ebitda: directEbitda, lucroLiquido: directLucro };
  }, [dreDbData]);
  
  const ENGINE_VERSION = 'v1.2.0';
  const inputHash = bpSummary ? `${bpSummary.ativoTotal}_${bpSummary.passivoTotal}_${ebitda}_${lucroLiquido}` : 'no-data';
  const analysisKey = `${selectedClient}:bp:${filterYear}:${ENGINE_VERSION}:${inputHash}`;

  const [reportsCache, setReportsCache] = useState<Record<string, ExecutiveIntelligenceReport>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [engineError, setEngineError] = useState<string | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      if (!bpSummary || Object.keys(bpSummary).length === 0 || !hasBalanceSheetData) return;
      
      setIsGenerating(true);
      setEngineError(null);

      const prevPl = getHistoricalValue(filterYear - 1, 'patrimônio líquido') || getHistoricalValue(filterYear - 1, 'pl') || 0;
      const clientObj = clients?.find((c: any) => c.id === selectedClient);
      const industry = clientObj?.segmentoAtuacao || clientObj?.segmento || clientObj?.industry || 'Geral';
      
      const prevEbitda = getHistoricalValue(filterYear - 1, 'ebitda') || getHistoricalValue(filterYear - 1, 'lajida') || 0;
      const prevCaixa = getHistoricalValue(filterYear - 1, 'caixa') || getHistoricalValue(filterYear - 1, 'disponibilidades') || 0;
      
      let calculatedCycles = Object.keys(historyByYear ?? {}).filter((year) => {
        const data = historyByYear[year];
        return data && data.length > 0;
      }).length || 1;

      const input = {
        clientProfile: clientObj,
        rawFinancialData: {
          bpSummary,
          ebitda,
          lucroLiquido,
          industry,
          segmentoEmpresa: industry,
          prevPl,
          prevEbitda,
          prevCaixa,
          dreDataLength: dreDbData.length,
          historicalCyclesCount: calculatedCycles
        },
        historicalSeries: historicalFinancialSeries?.series || [],
        bpData: financialEntries,
        dreData: dreDbData,
        dlpaData: dlpaDbData,
        cashFlowData: cashFlowDbData,
        historicalCyclesCount: calculatedCycles,
        isMockData: financialEntries.length === 0
      };

      try {
        const runtimeStart = performance.now();
        const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);
        const runtimeEnd = performance.now();
        
        console.log(`[TELEMETRY] Runtime Execution Time: ${(runtimeEnd - runtimeStart).toFixed(2)}ms`);
        console.log(`[TELEMETRY] Historical Payload Size: ${input.historicalSeries?.length || 0} years`);
        console.log(`[TELEMETRY] Temporal Mode: ${report.compliance.runtimeMode}`);
        console.log(`[TELEMETRY] Trend C...: ${report.compliance.confidenceLevel}`);
        
        setReportsCache(prev => ({ ...prev, [analysisKey]: report }));
      } catch (err: any) {
        console.error("Executive Runtime Falhou:", err);
        setEngineError(err.message || 'Erro desconhecido na engine executiva');
      } finally {
        setIsGenerating(false);
      }
    }

    runAnalysis();
  }, [bpSummary, ebitda, lucroLiquido, filterYear, dreDbData.length, dlpaDbData, cashFlowDbData, financialEntries, historyByYear, historicalFinancialSeries, clients, selectedClient, analysisKey]);

  const hasBalanceSheetData = financialEntries.length > 0 && !!bpSummary && (bpSummary.ativoTotal !== 0 || bpSummary.passivoTotal !== 0 || bpSummary.patrimonioLiquido !== 0);
  const executiveReport = reportsCache[analysisKey] || null;

  const resilienciaGlobal = executiveReport?.scores.composite || 0;
  const patrimonialIntelligenceReport = executiveReport?.patrimonialIntelligenceReport;
  const maturidade = executiveReport?.institutionalView?.maturity?.stageLabel || executiveReport?.context.stage || 'Pendente';

  console.log('[DEBUG-BALANCE-SHEET] executiveReport:', !!executiveReport);
  console.log('[DEBUG-BALANCE-SHEET] patrimonialIntelligenceReport:', !!patrimonialIntelligenceReport);
  console.log('[DEBUG-BALANCE-SHEET] governanceStatus:', (executiveReport as any)?.governanceStatus);
  console.log('[DEBUG-BALANCE-SHEET] scoreBreakdown:', patrimonialIntelligenceReport?.scoreBreakdown);

  function getHistoricalValue(y: number, accountName: string) {
    const yearRows = historyByYear[y] || [];
    const search = accountName.toLowerCase();
    const match = yearRows.find((r: any) => {
      const conta = (r.category || r.conta || '').toLowerCase();
      const cleanConta = conta.replace(/^[0-9.]+\s*[-]\s*/, '').trim();
      return cleanConta === search || conta.includes(search);
    });
    return match?.value || match?.val || 0;
  };

  const comparativeAnalysis = useMemo(() => {
    return rows.map((row: any) => {
      const val = parseMetricStr(row.value !== undefined ? row.value : (row.val || 0));
      const rowName = row.name || row.conta || row.category || '';
      const prevVal = getHistoricalValue(filterYear - 1, rowName);
      
      const av = ativoTotal > 0 ? (val / ativoTotal) * 100 : 0;
      const ah = prevVal > 0 ? ((val / prevVal) - 1) * 100 : 0;
      
      return {
        ...row,
        val,
        name: rowName,
        av,
        ah,
        prevVal
      };
    });
  }, [rows, filterYear, historyByYear, ativoTotal]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async () => {
    if (!FirestoreAuthAdapter.isAuthenticated()) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }

    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      await BalanceSheetApplicationService.deleteFinancialData(selectedClient, filterYear);
      showToast('success', `Registro(s) excluído(s) com sucesso.`);
      refetch();
      
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };

  const isSectionVisible = (sectionName: string) => {
    return FiduciaryRuntimeAdapter.ExecutiveInformationDensityFramework.isSectionVisible(sectionName, densityLevel);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const ativoData = useMemo(() => {
    const raw = comparativeAnalysis.filter((r: any) => 
      (r.tipo || r.type || '').toLowerCase().includes('ativo') && r.level === 2 && r.val > 0
    ).map((r: any) => ({ name: r.name, value: r.val })).sort((a: any, b: any) => b.value - a.value);
    return raw.map((item, idx) => ({ ...item, fill: COLORS[idx % COLORS.length] }));
  }, [comparativeAnalysis]);

  const passivoData = useMemo(() => {
    const raw = comparativeAnalysis.filter((r: any) => 
      (r.tipo || r.type || '').toLowerCase().includes('passivo') && !((r.tipo || r.type || '').toLowerCase().includes('patrimônio') || (r.tipo || r.type || '').toLowerCase().includes('pl')) && r.level === 2 && r.val > 0
    ).map((r: any) => ({ name: r.name, value: r.val })).sort((a: any, b: any) => b.value - a.value);
    return raw.map((item, idx) => ({ ...item, fill: COLORS[idx % COLORS.length] }));
  }, [comparativeAnalysis]);

  const waterfallData = useMemo(() => {
    if (!bpSummary) return [];
    const data: BalanceSheetWaterfallInputPoint[] = [
      { name: 'Ativo Circulante', value: bpSummary.ativoCirculante, variant: 'success' },
      { name: 'Passivo Circulante', value: -bpSummary.passivoCirculante, variant: 'critical' },
      { name: 'Capital de Giro Líquido', value: bpSummary.ativoCirculante - bpSummary.passivoCirculante, variant: 'primary' }
    ];
    return data;
  }, [bpSummary]);

  const financialAnalyticsViewModel = useMemo(() => {
    return FinancialAnalyticsBuilder.build(
      waterfallData,
      ativoData,
      passivoData,
      chartData,
      majorChanges,
      {
        ativo: comparativeAnalysis.filter((r: any) => (r.tipo || r.type || '').toLowerCase().includes('ativo')),
        passivo: comparativeAnalysis.filter((r: any) => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('passivo') && !t.includes('patrimônio') && !t.includes('pl'); }),
        patrimonioLiquido: comparativeAnalysis.filter((r: any) => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('patrimônio') || t.includes('pl'); })
      },
      bpSummary || { ativoTotal: 0, patrimonioLiquido: 0 },
      translateLabel,
      (value: number) => {
        if (value === null || value === undefined) return 'R$ 0';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
      }
    );
  }, [waterfallData, ativoData, passivoData, chartData, majorChanges, comparativeAnalysis, bpSummary, translateLabel]);

  const executiveViewModel = useMemo(() => {
    if (!hasBalanceSheetData) return null;
    return BalanceSheetExecutiveViewModelBuilder.build(executiveReport || {}, 'safe', filterYear, bpSummary, financialIndicators);
  }, [executiveReport, filterYear, bpSummary, financialIndicators, hasBalanceSheetData]);

  const presentationModel = useMemo(() => {
    if (!hasBalanceSheetData || !bpSummary) return null;
    const financialData = {
      assets: bpSummary.ativoTotal,
      liabilities: bpSummary.passivoTotal,
      equity: bpSummary.patrimonioLiquido,
      liquidity: bpSummary.passivoCirculante > 0 ? (bpSummary.ativoCirculante / bpSummary.passivoCirculante) : 0,
      ebitda: ebitda || 0,
      revenue: ebitda * 3 // fallback
    };
    const boardPackage = InstitutionalDecisionOS.runSession(
      { 
        id: 'q-1', 
        text: 'Avaliação Patrimonial', 
        questionType: 'UNKNOWN', 
        askedBy: 'System', 
        askedAt: new Date(),
        decisionContext: { currentState: 'Sessão Automática', constraints: [], strategicMoment: 'N/A' },
        businessProblem: 'N/A', decisionToEnable: 'N/A', strategicHypothesis: 'N/A', financialImpact: 'N/A',
        timeHorizon: 'N/A', decisionMaker: 'System', decisionCriteria: [], successDefinition: 'N/A',
        nonNegotiables: [], stakeholders: []
      },
      financialData
    );
    return boardPackage.assessments.financialAssessment;
  }, [bpSummary, ebitda, hasBalanceSheetData]);

  const strategicTensions = useMemo(() => {
    if (!bpSummary || !financialIndicators) return [];
    return ExecutiveStrategicTensionEngine.evaluate(financialIndicators);
  }, [financialIndicators, bpSummary]);

  const evidenceTrace = useMemo(() => {
    return executiveViewModel?.evidenceTrace || [];
  }, [executiveViewModel]);


  return {
    state: {
      filterYear,
      densityLevel,
      toast,
      deleting,
      showDeleteConfirm,
      showImportModal,
      showManualModal,
      showCamada2,
      showCamada3,
      showFullStressTests,
      userRole,
      isGenerating,
      engineError
    },
    computed: {
      profile,
      financialEntries,
      dreDbData,
      dlpaDbData,
      cashFlowDbData,
      allHistoryData,
      loadingBP,
      rows,
      bpSummary,
      ebitda,
      lucroLiquido,
      executiveViewModel,
      assessment: presentationModel,
      financialAnalyticsViewModel,
      loadingHistory,
      historicalFinancialSeries,
      t,
      hasBalanceSheetData,
      executiveReport,
      patrimonialIntelligenceReport,
      strategicTensions,
      financialIndicators,
      ativoTotal,
      passivoTotal,
      plValue,
      ac,
      anc,
      pc,
      pnc,
      isBalanced,
      divergence,
      cx,
      est,
      clientes,
      fornecedores,
      passivosFinanceiros,
      capitalSocial,
      valorPrejuizo,
      valAltaConversibilidade,
      valMediaConversibilidade,
      valBaixaConversibilidade,
      valConversibilidadeRestrita,
      creditosSocios,
      chartData,
      historyByYear,
      comparativeAnalysis,
      ativoData,
      passivoData,
      COLORS,
      resilienciaGlobal,
      maturidade,
      diagnostics
    },
    actions: {
      setFilterYear,
      setDensityLevel,
      setToast,
      setDeleting,
      setShowDeleteConfirm,
      setShowImportModal,
      setShowManualModal,
      setShowCamada2,
      setShowCamada3,
      setShowFullStressTests,
      refetchBP,
      handleDelete,
      translateLabel,
      showToast,
      isSectionVisible,
      setIsGenerating,
      setEngineError
    }
  };
}
