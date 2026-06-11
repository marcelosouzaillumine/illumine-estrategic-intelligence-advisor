import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BookOpen, Database, TrendingUp, TrendingDown, Info, BarChart3, PieChart as PieChartIcon, AlertCircle, Activity, Target, AlertTriangle, Lightbulb, Zap, ShieldCheck, Gem, Crosshair, Layers, PiggyBank, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { StatusBadge, PageHeader } from '../Common';
import { BalanceSheetDataSourceStatus } from './balance-sheet/BalanceSheetDataSourceStatus';
import { BalanceSheetYearFilter } from './balance-sheet/BalanceSheetYearFilter';
import { BalanceSheetActionToolbar } from './balance-sheet/BalanceSheetActionToolbar';
import { BalanceSheetBoardAdvisory } from './balance-sheet/BalanceSheetBoardAdvisory';
import { BalanceSheetExecutivePlan } from './balance-sheet/BalanceSheetExecutivePlan';
import { BalanceSheetLiquiditySection } from './balance-sheet/BalanceSheetLiquiditySection';
import { BalanceSheetWorkingCapitalSection } from './balance-sheet/BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from './balance-sheet/BalanceSheetAssetQualitySection';
import { BalanceSheetCapitalStructureSection } from './balance-sheet/BalanceSheetCapitalStructureSection';
import { BalanceSheetInstitutionalContextSection } from './balance-sheet/BalanceSheetInstitutionalContextSection';
import { BalanceSheetRiskDivergenceSection } from './balance-sheet/BalanceSheetRiskDivergenceSection';
import { BalanceSheetTechnicalLayerSection } from './balance-sheet/BalanceSheetTechnicalLayerSection';
import { BalanceSheetAuditLayerSection } from './balance-sheet/BalanceSheetAuditLayerSection';
import { BalanceSheetWaterfallChartSection } from './balance-sheet/BalanceSheetWaterfallChartSection';
import { BalanceSheetEvolutionAnalysisSection } from './balance-sheet/BalanceSheetEvolutionAnalysisSection';
import { BalanceSheetCompositionChartsSection } from './balance-sheet/BalanceSheetCompositionChartsSection';
import { ExecutiveExposureCard } from '../ui/executive-exposure-card';
import { BalanceSheetExecutiveSynthesisSection } from './balance-sheet/BalanceSheetExecutiveSynthesisSection';
import { BalanceSheetStructuralTablesSection } from './balance-sheet/BalanceSheetStructuralTablesSection';
import { BalanceSheetCapitalPreservationSection } from './balance-sheet/BalanceSheetCapitalPreservationSection';
import { mapIndicatorsToViewModels, mapInstitutionalContextToViewModel, mapRiskDivergenceToViewModel, mapTechnicalLayerToViewModel, mapAuditLayerToViewModel, mapFinancialAnalyticsToViewModels } from './balance-sheet/mappers';

import { useLanguage } from '../../contexts/LanguageContext';

import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';


import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade, generateInitialDreState } from '../../lib/dreCascade';
import { FiduciaryRuntimeAdapter, PresentationLayer, ExecutiveIntelligenceReport, ExecutiveLabelResolver } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveLocaleEnforcer } from '../../core/enforcement/ExecutiveLocaleEnforcer';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = { type: 'success' | 'error'; message: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────
export function BalanceSheetPage({ clients, selectedClient, selectedYear }: any) {
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

  // --- TELEMETRY ---
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  renderCount.current += 1;
  
  useEffect(() => {
    console.log(`[TELEMETRY] BalanceSheetPage render #${renderCount.current} at ${performance.now() - startTime.current}ms`);
  });
  // -----------------

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

  const financialIndicators = useMemo(() => {
    if (!bpSummary) return [];
    const bpCalc = FiduciaryRuntimeAdapter.BalanceSheetFinancialMetricsEngine.calculateIndicators(bpSummary);
    return bpCalc;
  }, [bpSummary]);

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
  
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      if (!bpSummary) return;

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
        console.log(`[TELEMETRY] Trend Confidence: ${report.compliance.confidenceLevel}`);
        
        setEngineError(null);
        setExecutiveReport(report);
      } catch (err: any) {
        console.error("Executive Runtime Falhou:", err);
        setEngineError(err.message || 'Erro desconhecido na engine executiva');
      }
    }

    runAnalysis();
  }, [bpSummary, ebitda, lucroLiquido, filterYear, dreDbData.length, dlpaDbData, cashFlowDbData, financialEntries, historyByYear, historicalFinancialSeries, clients, selectedClient]);

  const hasData = financialEntries.length > 0;
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
    if (!auth.currentUser) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }

    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const types = ['Balanço Patrimonial', 'BP'];
      const docIds: string[] = [];
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', selectedClient),
        where('type', 'in', types),
        where('year', '==', filterYear)
      );
      const snap = await getDocs(q);
      snap.docs.forEach((d) => docIds.push(d.id));

      await Promise.all(docIds.map((id) => deleteDoc(doc(db, 'financial_entries', id))));
      showToast('success', `${docIds.length} registro(s) excluído(s) com sucesso.`);
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
    return [
      { name: 'Ativo Circulante', value: bpSummary.ativoCirculante, fill: '#34d399' },
      { name: 'Passivo Circulante', value: -bpSummary.passivoCirculante, fill: '#fb7185' },
      { name: 'Capital de Giro Líquido', value: bpSummary.ativoCirculante - bpSummary.passivoCirculante, fill: '#60a5fa' }
    ];
  }, [bpSummary]);

  const financialAnalyticsViewModel = useMemo(() => {
    return mapFinancialAnalyticsToViewModels({
      waterfallData,
      ativoData,
      passivoData,
      chartData,
      majorChanges,
      comparativeAnalysis: {
        ativo: comparativeAnalysis.filter((r: any) => (r.tipo || r.type || '').toLowerCase().includes('ativo')),
        passivo: comparativeAnalysis.filter((r: any) => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('passivo') && !t.includes('patrimônio') && !t.includes('pl'); }),
        patrimonioLiquido: comparativeAnalysis.filter((r: any) => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('patrimônio') || t.includes('pl'); })
      },
      bpSummary: bpSummary || { ativoTotal: 0, patrimonioLiquido: 0 },
      translateLabel,
      formatCurrency: (value: number) => {
        if (value === null || value === undefined) return 'R$ 0';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
      }
    });
  }, [waterfallData, ativoData, passivoData, chartData, majorChanges, comparativeAnalysis, bpSummary, translateLabel]);



  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      {(executiveReport?.isSandbox || executiveReport?.isDemonstrative) && (
        <SandboxWarningOverlay type={executiveReport.isSandbox ? 'sandbox' : 'demonstrative'} />
      )}
      <PageHeader 
        title="Balanço Patrimonial" 
        subtitle="Análise da posição financeira, estrutura de capital e solvência patrimonial."
        icon={BookOpen}
        color="executive"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <StatusBadge status={executiveReport?.isSandbox || executiveReport?.isDemonstrative ? 'SANDBOX' : (executiveReport?.canonicalState?.status || (hasData ? 'Ativo' : 'UNAVAILABLE'))} />
            <BalanceSheetDataSourceStatus hasRealData={hasData} loading={loadingBP} />
          </div>
          <BalanceSheetYearFilter filterYear={filterYear} onChangeYear={setFilterYear} />
        </div>

        <BalanceSheetActionToolbar onLaunchData={() => setShowManualModal(true)} onImport={() => setShowImportModal(true)} onDelete={() => setShowDeleteConfirm(true)} />
      </div>

      <div className="space-y-6 mb-12">
        {hasData && patrimonialIntelligenceReport ? (
          <>

            {/* --- 0. INSTITUTIONAL CONTEXT --- */}
            <BalanceSheetInstitutionalContextSection 
              context={mapInstitutionalContextToViewModel(executiveReport?.context, maturidade)} 
            />

            <div className="space-y-6 mb-12">
              
              {/* --- 1. PATRIMONIAL THESIS & BOARD ADVISORY --- */}
              {patrimonialIntelligenceReport?.boardAdvisory && (() => {
                const hasParecer = patrimonialIntelligenceReport.boardAdvisory?.fullText?.trim() && patrimonialIntelligenceReport.boardAdvisory.fullText !== 'Parecer não gerado.';
                return (
                  <BalanceSheetBoardAdvisory 
                    hasParecer={hasParecer}
                    patrimonialHealth={patrimonialIntelligenceReport.patrimonialHealth}
                    boardAdvisoryFullText={patrimonialIntelligenceReport.boardAdvisory?.fullText}
                  />
                );
              })()}

              {/* --- 7. PLANO EXECUTIVO --- */}
              {patrimonialIntelligenceReport?.executivePlan && (
              <BalanceSheetExecutivePlan
                executivePlan={patrimonialIntelligenceReport.executivePlan}
                dominantRiskFamily={patrimonialIntelligenceReport.dominantRiskFamily}
                executiveInterpretation={patrimonialIntelligenceReport.executiveInterpretation}
              />
              )}

              {/* --- 2. CAPITAL PRESERVATION --- */}
              <BalanceSheetCapitalPreservationSection 
                indicators={patrimonialIntelligenceReport.indicators}
                t={t}
              />

              {/* --- 3. LIQUIDEZ E SOLVÊNCIA --- */}
              <BalanceSheetLiquiditySection 
                indicators={patrimonialIntelligenceReport.indicators}
              />

              {/* --- 4. QUALIDADE DO ATIVO --- */}
              <BalanceSheetAssetQualitySection 
                indicators={mapIndicatorsToViewModels({
                  indicators: patrimonialIntelligenceReport.indicators,
                  metricNames: ['Asset Concentration Risk', 'Ativo - Estoques %'],
                  resolveLabel: (metric) => ExecutiveLabelResolver.resolve(metric, t)
                })}
              />

              {/* --- 5. ESTRUTURA DE CAPITAL --- */}
              <BalanceSheetCapitalStructureSection 
                indicators={mapIndicatorsToViewModels({
                  indicators: patrimonialIntelligenceReport.indicators,
                  metricNames: ['Funding Capacity Ratio', 'Debt Capacity Score', 'Financial Debt-to-Equity', 'Endividamento Geral', 'Dependência de Capital de Terceiros'],
                  resolveLabel: (metric) => ExecutiveLabelResolver.resolve(metric, t)
                })}
              />

              {/* --- 6. WORKING CAPITAL INTELLIGENCE --- */}
              <BalanceSheetWorkingCapitalSection 
                indicators={patrimonialIntelligenceReport.indicators}
              />

              {/* --- 1B. SCORE PATRIMONIAL (DIVERGENCE ANALYSIS) --- */}
              <BalanceSheetRiskDivergenceSection 
                viewModel={mapRiskDivergenceToViewModel({
                  globalScore: patrimonialIntelligenceReport.scoreBreakdown?.globalScore,
                  patrimonialClassification: patrimonialIntelligenceReport.patrimonialClassification,
                  indicators: patrimonialIntelligenceReport.indicators,
                  resolveLabel: (key: string) => ExecutiveLabelResolver.resolve(key, t),
                  resolveImpact: (metric: string) => ExecutiveLabelResolver.resolveImpact(metric)
                })}
              />

              {/* --- 8. CAMADA TÉCNICA (Indicadores Financeiros Patrimoniais Brutos) --- */}
              <BalanceSheetTechnicalLayerSection 
                viewModel={mapTechnicalLayerToViewModel({
                  indicators: financialIndicators,
                  resolveLabel: (key) => ExecutiveLabelResolver.resolve(key, t)
                })}
              />

              {/* --- 9. AUDIT LAYER (Camada Fiduciária e Rastreabilidade) --- */}
              <BalanceSheetAuditLayerSection 
                viewModel={mapAuditLayerToViewModel({
                  structuralRestrictions: executiveReport?.patrimonialStructuralRestrictions,
                  governanceConsistency: patrimonialIntelligenceReport?.governanceConsistency,
                  resolveLabel: (key: string) => ExecutiveLabelResolver.resolve(key, t)
                })}
              />
            </div>

          </>
        ) : (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-12 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
             <div className="relative z-10 flex flex-col items-center justify-center w-full">
               <h3 className="text-3xl font-black mb-4">Inteligência Patrimonial</h3>
               <p className="text-primary max-w-[600px] w-full mx-auto font-medium leading-relaxed">Não há dados suficientes ou relatórios gerados para exibir o dashboard patrimonial no momento.</p>
             </div>
          </div>
        )}
      </div>
{/* =========================================================
          CAMADA 3: {ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics').toUpperCase()}
          Detalhamento granular, gráficos e tabelas
      ========================================================= */}
      {hasData && (
        <div className="mb-12">
          <details className="group bg-card border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden">
            <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-surface-container/30/50 transition-colors">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
                <h3 className="text-lg font-black text-primary group-open:text-primary">{ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics')}</h3>
              </div>
              <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <div className="p-8 border-t border-border bg-surface-container/30/30">
              <div className="flex flex-col mb-6 border-b border-border pb-4">
                <h4 className="text-sm font-black text-primary mb-2">Análise Estrutural Detalhada</h4>
                <p className="text-sm text-foreground/68 font-normal">
                  Cálculos • Análise Horizontal e Vertical • Gráficos
                </p>
              </div>

            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
              
              {/* ── Gráficos Adicionais Executivos ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waterfall: Dinâmica de Capital de Giro */}
                <BalanceSheetWaterfallChartSection 
                  viewModel={financialAnalyticsViewModel.waterfall} 
                  formatCurrency={(value: number) => {
                    if (value === null || value === undefined) return 'R$ 0';
                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
                  }}
                />

                {/* Heatmap: Concentração */}
                <ExecutiveExposureCard
                  title="Mapa de Calor: Concentração"
                  subtitle={t('bp.working_capital.subtitle')}
                  metrics={[
                    {
                      label: 'Estoque / Ativo Circulante',
                      percentage: bpSummary && bpSummary.ativoCirculante > 0 ? (bpSummary.estoques / bpSummary.ativoCirculante) * 100 : 0,
                      colorClass: 'bg-amber-500/80'
                    },
                    {
                      label: 'Dívida CP / Passivo Total',
                      percentage: bpSummary && bpSummary.passivoTotal > 0 ? (bpSummary.passivoCirculante / bpSummary.passivoTotal) * 100 : 0,
                      colorClass: 'bg-rose-500/80'
                    },
                    {
                      label: 'PL / Ativo Total (Autonomia)',
                      percentage: bpSummary && bpSummary.ativoTotal > 0 ? (bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100 : 0,
                      colorClass: 'bg-blue-500/80'
                    }
                  ]}
                />

                {/* Composição do Ativo e Passivo */}
                <BalanceSheetCompositionChartsSection 
                  viewModel={financialAnalyticsViewModel.composition}
                  formatCurrency={(value: number) => {
                    if (value === null || value === undefined) return 'R$ 0';
                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
                  }}
                />
              </div>

              {/* ── Análise de Evolução e Gráficos ── */}
              <BalanceSheetEvolutionAnalysisSection
                viewModel={financialAnalyticsViewModel.evolution}
                formatCurrency={(value: number) => {
                  if (value === null || value === undefined) return 'R$ 0';
                  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
                }}
              />

              {/* ── Tabelas Detalhadas com AV/AH ── */}
              <BalanceSheetStructuralTablesSection
                viewModel={financialAnalyticsViewModel.structuralTables}
              />

            </div>
          </div>
          </details>
        </div>
      )}

      {/* ── Comentário Executivo ─────────────────────────────────────────── */}
      {engineError ? (
        <div className="bg-critical-soft border border-rose-200 text-rose-600 px-6 py-4 rounded-xl mt-6">
          <h4 className="font-bold mb-1">{t('bp.engine_failure')}</h4>
          <p className="text-sm">{engineError}</p>
          <p className="text-xs opacity-80 mt-2">bpSummary exists: {bpSummary ? 'Yes' : 'No'}</p>
</div>
      ) : null}



      {!executiveReport ? null : (
        <BalanceSheetExecutiveSynthesisSection 
          executiveNarrative={executiveReport.patrimonialIntelligenceReport?.executiveNarrative || 'Nenhuma narrativa disponível para este exercício.'}
        />
      )}

      {/* Modals */}
      {showImportModal && typeof document !== 'undefined' && createPortal(
        <ImportFinancialModal
          type="Balanço Patrimonial"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchBP();
            
            showToast('success', 'Dados importados com sucesso!');
          }}
        />,
        document.body
      )}

      {showManualModal && typeof document !== 'undefined' && createPortal(
        <ManualFinancialModal
          type="Balanço Patrimonial"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchBP();
            
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />,
        document.body
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <ExecutiveSurface 
            variant="default" 
            elevation="lg" 
            padding="none" 
            className="rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shrink-0"
          >
            <h3 className="text-xl font-black text-primary mb-2">Excluir Dados?</h3>
            <p className="text-sm text-secondary mb-8 font-medium">
              Esta ação removerá todos os registros do Balanço Patrimonial para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-surface-container/30 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-critical-soft0 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </ExecutiveSurface>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-success-soft0 text-white' : 'bg-critical-soft0 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>,
        document.body
      )}
    </div>
  );

}
