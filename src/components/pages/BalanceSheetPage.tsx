import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SandboxWarningOverlay } from '../executive-interaction/SandboxWarningOverlay';
import { createPortal } from 'react-dom';
import { Calendar, Loader2, Upload, Trash2, Plus, BookOpen, Database, TrendingUp, TrendingDown, Info, BarChart3, PieChart as PieChartIcon, AlertCircle, Activity, Target, AlertTriangle, Lightbulb, Zap, ShieldCheck, Gem, Crosshair, Layers, PiggyBank, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { StatusBadge, PageHeader } from '../Common';
import { useLanguage } from '../../contexts/LanguageContext';

import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';

import { ExecutiveCommentary } from '../ExecutiveCommentary';
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

  const indicatorsByFamily = useMemo(() => {
    const families: Record<string, any[]> = {
      'Liquidez': [],
      'Capital de Giro': [],
      'Estrutura de Capital': [],
      'Imobilização': []
    };
    financialIndicators.forEach(ind => {
      if (families[ind.family]) {
        families[ind.family].push(ind);
      }
    });
    return families;
  }, [financialIndicators]);

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

  const ativoData = useMemo(() => {
    return comparativeAnalysis.filter((r: any) => 
      (r.tipo || r.type || '').toLowerCase().includes('ativo') && r.level === 2 && r.val > 0
    ).map((r: any) => ({ name: r.name, value: r.val })).sort((a: any, b: any) => b.value - a.value);
  }, [comparativeAnalysis]);

  const passivoData = useMemo(() => {
    return comparativeAnalysis.filter((r: any) => 
      (r.tipo || r.type || '').toLowerCase().includes('passivo') && !((r.tipo || r.type || '').toLowerCase().includes('patrimônio') || (r.tipo || r.type || '').toLowerCase().includes('pl')) && r.level === 2 && r.val > 0
    ).map((r: any) => ({ name: r.name, value: r.val })).sort((a: any, b: any) => b.value - a.value);
  }, [comparativeAnalysis]);

  const waterfallData = useMemo(() => {
    if (!bpSummary) return [];
    return [
      { name: 'Ativo Circulante', value: bpSummary.ativoCirculante, isPositive: true },
      { name: 'Passivo Circulante', value: -bpSummary.passivoCirculante, isPositive: false },
      { name: 'Capital de Giro Líquido', value: bpSummary.ativoCirculante - bpSummary.passivoCirculante, isTotal: true }
    ];
  }, [bpSummary]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

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

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loadingBP || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={financialEntries.length > 0 ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', financialEntries.length > 0 ? 'text-success' : 'text-muted-foreground/40')}>
              {financialEntries.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
            <Calendar size={12} className="ml-2 text-secondary" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
            >
              {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-3 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        {hasData && patrimonialIntelligenceReport ? (
          <>

            <div className="space-y-6 mb-12">
              
              {/* --- 1. PATRIMONIAL THESIS & BOARD ADVISORY --- */}
              {(executiveReport as any)?.governanceStatus?.isValid && (() => {
                const hasParecer = patrimonialIntelligenceReport.boardAdvisory?.fullText?.trim() && patrimonialIntelligenceReport.boardAdvisory.fullText !== 'Parecer não gerado.';
                return (
                  <div className={cn("grid grid-cols-1 gap-6 mb-6", hasParecer ? "lg:grid-cols-2" : "lg:grid-cols-1")}>
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 md:p-12 shadow-2xl hover:shadow-indigo-900/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-center border border-border">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                      <span className="inline-block px-4 py-1.5 rounded-full border border-primary bg-primary text-[10px] font-black uppercase tracking-widest text-primary mb-6 self-start">Tese Patrimonial</span>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-white max-w-4xl leading-relaxed">
                        {patrimonialIntelligenceReport.patrimonialHealth || 'Estrutura patrimonial em avaliação.'}
                      </h3>
                    </div>

                    {hasParecer && (
                    <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 border border-border flex flex-col justify-center transition-all duration-500 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
                      <div className="relative z-10">

                      <span className="inline-block px-4 py-1.5 rounded-full border border-border bg-slate-50 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 self-start">Parecer do Conselho</span>
                      {patrimonialIntelligenceReport.boardAdvisory?.fullText ? (
                        <div className="text-sm md:text-base font-semibold text-muted-foreground leading-relaxed space-y-4">
                          {patrimonialIntelligenceReport.boardAdvisory.fullText.includes('Recomendação:') ? (
                            <>
                              <p>{patrimonialIntelligenceReport.boardAdvisory.fullText.split('Recomendação:')[0].trim()}</p>
                              <p><strong>Recomendação:</strong> {patrimonialIntelligenceReport.boardAdvisory.fullText.split('Recomendação:')[1].trim()}</p>
                            </>
                          ) : (
                            <p>{patrimonialIntelligenceReport.boardAdvisory.fullText}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm md:text-base font-semibold text-muted-foreground leading-relaxed">Parecer não gerado.</p>
                      )}
                      </div>
                    </div>
                  )}
                  </div>
                );
              })()}

              {/* --- 7. PLANO EXECUTIVO --- */}
              {(executiveReport as any)?.governanceStatus?.isValid && (
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <h3 className="text-2xl font-black text-muted-foreground mb-6 relative z-10">Plano Executivo Consolidado</h3>
                
                <div className="relative z-10">
                  {patrimonialIntelligenceReport.executivePlan && patrimonialIntelligenceReport.executivePlan.includes('|') ? (
                    <div className="border-l-4 rounded-r-3xl rounded-l-md p-8 flex flex-col shadow-sm transition-all hover:shadow-md bg-slate-50 border-accent">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b border-primary pb-4 gap-4">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Prioridade Estratégica</h4>
                          <div className="flex items-center gap-3">
                            <span className={"text-sm font-black uppercase tracking-widest px-3 py-1 rounded-full border " + 
                              (patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                               patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverity === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                               patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverity === 'MODERATE' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                               'bg-emerald-100 text-emerald-700 border-emerald-200')
                            }>
                              {patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverity === 'CRITICAL' ? '🔴 CRÍTICA' :
                               patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverity === 'HIGH' ? '🟠 ALTA' :
                               patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverity === 'MODERATE' ? '🟡 MODERADA' : '🟢 MONITORAMENTO'}
                            </span>
                            <span className="text-lg font-bold text-muted-foreground">
                              {patrimonialIntelligenceReport.dominantRiskFamily || 'Diretriz Estratégica'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm text-right">
                          <span className="block text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Motivo Principal</span>
                          <span className="text-sm font-bold text-muted-foreground">{patrimonialIntelligenceReport.executiveInterpretation?.strategicSeverityReason || 'Análise Executiva'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {[
                          { title: 'Financeiro', plan: patrimonialIntelligenceReport.executiveInterpretation?.planFinanceiro },
                          { title: 'Operacional', plan: patrimonialIntelligenceReport.executiveInterpretation?.planOperacional },
                          { title: 'Governança', plan: patrimonialIntelligenceReport.executiveInterpretation?.planGovernanca }
                        ].map((frente, i) => {
                          if (!frente.plan) return null;
                          return (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-border shadow-md shadow-slate-200/30 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">{frente.title}</h5>
                              <span className="inline-block self-start px-3 py-1.5 bg-accent group-hover:bg-accent text-accent rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 transition-colors">
                                {frente.plan.prazo}
                              </span>
                              <p className="text-sm font-semibold text-muted-foreground leading-snug">
                                {frente.plan.acao}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">{patrimonialIntelligenceReport.executivePlan}</p>
                  )}
                </div>
              </div>
              )}

              {/* --- 2. CAPITAL PRESERVATION --- */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
                <h3 className="text-2xl font-black text-muted-foreground mb-6">Preservação de Capital</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
                  {['Loss Absorption Capacity', 'Equity Buffer', 'Survival Index', 'Capital Erosion Velocity (CEV)', 'Equity Quality Index'].map((metric, idx) => {
                    const ind = patrimonialIntelligenceReport.indicators?.find((i: any) => i.metricName === metric);
                    if (!ind) return null;
                    
                    const isCrit = ind.classification === 'CRITICAL';
                    const isWarn = ind.classification === 'ATTENTION';
                    
                    return (
                      <div key={idx} className={cn("rounded-2xl p-6 shadow-sm border-l-4 transition-all hover:shadow-md flex flex-col", isCrit ? 'bg-rose-50 border-rose-500' : isWarn ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-border')}>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{ExecutiveLabelResolver.resolve(metric, t)}</h4>
                        <div className="text-3xl font-black text-muted-foreground mb-2">
                          {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : 
                           ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : 
                           ind.format === 'string' ? ind.value : 
                           Number(ind.value).toFixed(1)}
                        </div>
                        {ind.value !== ind.classification && (
                          <div className="mb-4 flex flex-col gap-2 items-start">
                            {metric === 'Equity Quality Index' && ind.evidence?.capitalConsumedAmount && (
                              <span className="text-sm font-black text-muted-foreground">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ind.evidence.capitalConsumedAmount)}
                              </span>
                            )}
                            <span className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full inline-block border", 
                              isCrit ? 'bg-rose-100 text-rose-700 border-rose-200' : isWarn ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            )}>
                              {ExecutiveLabelResolver.resolve(ind.classification, t)}
                            </span>
                          </div>
                        )}
                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed mt-auto">{ind.rationale}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- 3. LIQUIDEZ E SOLVÊNCIA --- */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
                <h3 className="text-2xl font-black text-muted-foreground mb-6">Liquidez e Solvência</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {['Liquidez Real', 'Liquidez Instantânea Real', 'Liquidez Seca'].map((metric, idx) => {
                    const ind = patrimonialIntelligenceReport.indicators?.find((i: any) => i.metricName === metric);
                    if (!ind) return null;
                    return (
                      <div key={idx} className="bg-slate-50 border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{metric}</h4>
                        <span className="text-2xl font-black text-muted-foreground mb-2">{Number(ind.value).toFixed(2)}</span>
                        <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">{ind.rationale}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- 4. QUALIDADE DO ATIVO --- */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
                <h3 className="text-2xl font-black text-muted-foreground mb-6">Qualidade do Ativo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Asset Concentration Risk', 'Ativo - Estoques %'].map((metric, idx) => {
                    const ind = patrimonialIntelligenceReport.indicators?.find((i: any) => i.metricName === metric);
                    if (!ind) return null;
                    return (
                      <div key={idx} className="bg-slate-50 border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2">{ExecutiveLabelResolver.resolve(metric, t)}</h4>
                        <span className="text-3xl font-black text-muted-foreground mb-2 block">
                          {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : Number(ind.value).toFixed(2)}
                        </span>
                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{ind.rationale}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- 5. ESTRUTURA DE CAPITAL --- */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
                <h3 className="text-2xl font-black text-muted-foreground mb-6">Estrutura de Capital</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
                  {['Funding Capacity Ratio', 'Debt Capacity Score', 'Financial Debt-to-Equity', 'Endividamento Geral', 'Dependência de Capital de Terceiros'].map((metric, idx) => {
                    const ind = patrimonialIntelligenceReport.indicators?.find((i: any) => i.metricName === metric);
                    if (!ind) return null;
                    return (
                      <div key={idx} className="bg-slate-50 border border-border rounded-2xl p-6 shadow-sm flex flex-col">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{ExecutiveLabelResolver.resolve(metric, t)}</h4>
                        <div className="text-2xl font-black text-muted-foreground mb-2">
                          {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : ind.format === 'decimal' ? Number(ind.value).toFixed(2) : ind.value}
                        </div>

                        <p className="text-[10px] font-medium text-muted-foreground leading-relaxed mt-auto">{ind.rationale}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- 6. WORKING CAPITAL INTELLIGENCE --- */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
                <h3 className="text-2xl font-black text-muted-foreground mb-6">Inteligência de Capital de Giro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Alocação de Capital de Giro', 'Ciclo Financeiro (Estimativa Indireta)'].map((metric, idx) => {
                    const ind = patrimonialIntelligenceReport.indicators?.find((i: any) => i.metricName === metric);
                    if (!ind) return null;
                    return (
                      <div key={idx} className="bg-slate-50 border border-border rounded-2xl p-6 shadow-sm">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2">{metric}</h4>
                        <span className="text-2xl font-black text-muted-foreground mb-2 block">
                          {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : ind.format === 'decimal' ? Number(ind.value).toFixed(1) : ind.value}
                        </span>
                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">{ind.rationale}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- 1B. SCORE PATRIMONIAL (DIVERGENCE ANALYSIS) --- */}
              <div className="bg-slate-50/30 rounded-[32px] p-8 border border-border mt-12 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-muted-foreground mb-4">Análise de Divergência de Risco</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Classificação Matemática</span>
                        <span className="text-lg font-black text-muted-foreground">
                          {patrimonialIntelligenceReport.scoreBreakdown?.globalScore >= 80 ? 'Resiliente' : 
                           patrimonialIntelligenceReport.scoreBreakdown?.globalScore >= 65 ? 'Estável' : 
                           patrimonialIntelligenceReport.scoreBreakdown?.globalScore >= 50 ? 'Vulnerável' : 'Crítico'}
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Classificação Fiduciária</span>
                        <span className={patrimonialIntelligenceReport.patrimonialClassification.includes('RESILIENT') ? 'text-primary font-black text-lg' :
                           patrimonialIntelligenceReport.patrimonialClassification.includes('STABLE') ? 'text-emerald-600 font-black text-lg' :
                           patrimonialIntelligenceReport.patrimonialClassification.includes('VULNERABLE') ? 'text-amber-600 font-black text-lg' :
                           'text-rose-600 font-black text-lg'}>
                          {ExecutiveLabelResolver.resolve(patrimonialIntelligenceReport.patrimonialClassification, t)}
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Indicador de Síntese</span>
                        <span className="text-lg font-black text-muted-foreground">
                          {patrimonialIntelligenceReport.scoreBreakdown?.globalScore || 0} <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">pontos</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-rose-500/[0.03] to-transparent border border-rose-200/50 p-6 sm:p-8 rounded-[32px] relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 p-8 opacity-[0.03]">
                        <AlertTriangle size={180} strokeWidth={1} />
                      </div>
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30">
                          <AlertTriangle size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-muted-foreground tracking-tight">Ofensores Fiduciários Críticos</h4>
                          <p className="text-[11px] font-bold text-rose-600/80 uppercase tracking-[0.2em] mt-1">Matriz de Impacto Estrutural</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 relative z-10">
                        {patrimonialIntelligenceReport.indicators?.filter((i: any) => i.classification === 'CRITICAL' || i.classification === 'Crítica' || i.classification === 'Crítico').map((ind: any, i: number) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group">
                            <div className="flex items-center gap-4 w-full sm:w-[35%]">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                              <span className="text-[13px] font-black text-muted-foreground">{ExecutiveLabelResolver.resolve(ind.metricName, t)}</span>
                            </div>
                            <div className="w-full sm:w-[20%]">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-100/50 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-300">
                                {ExecutiveLabelResolver.resolve(ind.classification, t)}
                              </span>
                            </div>
                            <div className="w-full sm:w-[45%] flex items-center justify-between gap-4 pl-4 sm:border-l border-border">
                              <span className="text-xs font-bold text-muted-foreground leading-snug group-hover:text-muted-foreground transition-colors">{ExecutiveLabelResolver.resolveImpact(ind.metricName)}</span>
                              <div className="p-1.5 bg-slate-50 rounded-md text-muted-foreground group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors">
                                <AlertCircle size={14} strokeWidth={2.5} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 8. CAMADA TÉCNICA (Indicadores Financeiros Patrimoniais Brutos) --- */}
              <details className="group bg-white border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Layers size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
                    <h3 className="text-lg font-black text-muted-foreground group-open:text-primary">Camada Técnica</h3>
                  </div>
                  <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-8 border-t border-border bg-slate-50/30">
                  <div className="flex flex-col mb-6 border-b border-border pb-4">
                    <h4 className="text-sm font-black text-muted-foreground mb-2">Indicadores Quantitativos Subjacentes</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-3xl">
                      Métricas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Score Matemático.
                    </p>
                  </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {Object.entries(indicatorsByFamily).map(([family, indicators]) => (
                    <div key={family} className="space-y-4">
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">{family}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {indicators.filter(ind => !['Liquidez Real', 'Liquidez Instantânea Real', 'Liquidez Seca'].includes(ind.metricName)).map((ind, idx) => (
                          <div key={idx} className="bg-slate-50 border border-border rounded-2xl p-5 hover:shadow-md transition-all group relative cursor-help flex flex-col justify-between" title={`Rationale: ${ind.rationale}`}>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-2/3 leading-relaxed">{ExecutiveLabelResolver.resolve(ind.metricName, t)}</span>
                              <span className={cn(
                                "text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-wider border whitespace-nowrap",
                                ind.classification === 'INSUFFICIENT_DATA' ? 'bg-slate-100 text-muted-foreground border-border' :
                                'CRITICAL' === ind.severity ? 'bg-rose-50 text-rose-500 border-rose-200' :
                                'ATTENTION' === ind.severity ? 'bg-amber-50 text-amber-500 border-amber-200' :
                                'CAPITAL_IDLE_WARNING' === ind.severity ? 'bg-blue-50 text-blue-500 border-blue-200' :
                                'bg-emerald-50 text-emerald-500 border-emerald-200'
                              )}>
                                {ExecutiveLabelResolver.resolve(ind.classification, t).replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-end justify-between">
                              <span className="text-2xl font-black text-muted-foreground leading-none">
                                {ind.value === 'INSUFFICIENT_DATA' ? '—' : 
                                  (ind.format === 'percentage' ? (Number(ind.value) * 100).toFixed(1) + '%' : 
                                  ind.format === 'multiplier' ? Number(ind.value).toFixed(2) + 'x' :
                                  ind.format === 'decimal' ? Number(ind.value).toFixed(2) : 
                                  ind.format === 'currency' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(ind.value)) : 
                                  ind.value)}
                              </span>
                              {ind.confidence < 100 && (
                                <span className="text-[8px] font-bold text-muted-foreground">Confiança {ind.confidence}%</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </details>

              {/* --- 9. AUDIT LAYER (Camada Fiduciária e Rastreabilidade) --- */}
              <details className="group bg-white border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
                    <h3 className="text-lg font-black text-muted-foreground group-open:text-primary">Restrições Fiduciárias Ativas</h3>
                  </div>
                  <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-6 border-t border-border grid grid-cols-1 xl:grid-cols-2 gap-8">
                  
                  {/* Structural Risks Overrides */}
                  {executiveReport?.patrimonialStructuralRestrictions && (
                    <div className="flex flex-col">
                      <h4 className="text-sm font-black text-muted-foreground mb-4 border-b border-border pb-2">Restrições Estruturais e Tetos de Classificação</h4>
                      <div className="space-y-3 flex-1">
                        {['Liquidity Fragility Override', 'Treasury Stress Override', 'Short-Term Debt Concentration Override', 'Capital Dependency Override', 'Earnings Quality Override'].map((overrideName, idx) => {
                          const activeOverride = executiveReport.patrimonialStructuralRestrictions?.appliedOverrides?.find((o: any) => o.name === overrideName);
                          const isActive = !!activeOverride;
                          if (!isActive) return null;
                          return (
                            <div key={idx} className={cn("border rounded-xl p-3 flex items-center justify-between", isActive ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-border opacity-60')}>
                              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{ExecutiveLabelResolver.resolve(overrideName, t)}</span>
                              <div className="flex items-center gap-2">
                                {isActive && (
                                  <span className="text-[8px] font-bold text-rose-500 border border-rose-200 bg-rose-100 px-2 py-0.5 rounded-full uppercase">
                                    {ExecutiveLabelResolver.resolve(activeOverride.severity, t)}
                                  </span>
                                )}
                                <span className={cn("text-[10px] font-black uppercase tracking-wider", isActive ? 'text-rose-600' : 'text-muted-foreground')}>{isActive ? 'Em vigor' : 'Inativo'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                        <div className="text-center">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Score Matemático</span>
                          <span className="text-sm font-black text-muted-foreground">{ExecutiveLabelResolver.resolve(executiveReport.patrimonialStructuralRestrictions.originalClassification, t)}</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="text-center">
                          <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 block mb-1">Teto Aplicado</span>
                          <span className="text-sm font-black text-rose-600">{executiveReport.patrimonialStructuralRestrictions.classificationCeiling ? ExecutiveLabelResolver.resolve(executiveReport.patrimonialStructuralRestrictions.classificationCeiling, t) : 'NENHUM'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Governance Consistency */}
                  {patrimonialIntelligenceReport?.governanceConsistency && (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                        <h4 className="text-sm font-black text-muted-foreground">Validação de Consistência Institucional</h4>
                        <div className={cn("px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest", 
                          patrimonialIntelligenceReport.governanceConsistency.consistencyStatus === 'CONSISTENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          patrimonialIntelligenceReport.governanceConsistency.consistencyStatus === 'FAIL_CLOSED' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        )}>
                          Status: {ExecutiveLabelResolver.resolve(patrimonialIntelligenceReport.governanceConsistency.consistencyStatus, t)}
                        </div>
                      </div>
                      
                      {(patrimonialIntelligenceReport.governanceConsistency.detectedIssues.length > 0 || 
                        patrimonialIntelligenceReport.governanceConsistency.warnings.length > 0 || 
                        patrimonialIntelligenceReport.governanceConsistency.forcedDisclosures.length > 0) ? (
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-2">
                          {patrimonialIntelligenceReport.governanceConsistency.detectedIssues.map((issue: string, idx: number) => (
                            <div key={`issue-${idx}`} className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg">
                              <span className="text-[9px] font-black uppercase text-rose-400 tracking-widest block mb-0.5">Falha Crítica</span>
                              <span className="text-[10px] font-bold text-rose-900 leading-relaxed">{issue}</span>
                            </div>
                          ))}
                          {patrimonialIntelligenceReport.governanceConsistency.warnings.map((warning: string, idx: number) => (
                            <div key={`warn-${idx}`} className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                              <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest block mb-0.5">Alerta</span>
                              <span className="text-[10px] font-bold text-amber-900 leading-relaxed">{warning}</span>
                            </div>
                          ))}
                          {patrimonialIntelligenceReport.governanceConsistency.forcedDisclosures.map((disc: string, idx: number) => (
                            <div key={`disc-${idx}`} className="p-3 bg-primary border-l-4 border-primary rounded-r-lg">
                              <span className="text-[9px] font-black uppercase text-primary tracking-widest block mb-0.5">Comunicação Prudencial Obrigatória</span>
                              <span className="text-[10px] font-bold text-primary leading-relaxed">{disc}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 border border-border rounded-xl text-center">
                          <p className="text-xs font-bold text-muted-foreground">Nenhuma inconsistência fiduciária detectada.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>
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
          <details className="group bg-white border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden">
            <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
                <h3 className="text-lg font-black text-muted-foreground group-open:text-primary">{ExecutiveLocaleEnforcer.normalize('Executive Financial Analytics')}</h3>
              </div>
              <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <div className="p-8 border-t border-border bg-slate-50/30">
              <div className="flex flex-col mb-6 border-b border-border pb-4">
                <h4 className="text-sm font-black text-muted-foreground mb-2">Análise Estrutural Detalhada</h4>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-3xl">
                  Cálculos • Análise Horizontal e Vertical • Gráficos
                </p>
              </div>

            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
              
              {/* ── Gráficos Adicionais Executivos ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waterfall: Dinâmica de Capital de Giro */}
                <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm col-span-1 md:col-span-2 lg:col-span-1 flex flex-col">
                  <h3 className="text-lg font-black text-muted-foreground mb-1">{t('bp.working_capital.title')}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-6">{ExecutiveLocaleEnforcer.normalize('Estrutura de Liquidez e Capital de Giro')}</p>
                  
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                        <YAxis hide />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="value">
                          {waterfallData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isTotal ? '#3b82f6' : (entry.isPositive ? '#10b981' : '#ef4444')} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Heatmap: Concentração */}
                <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm flex flex-col">
                  <h3 className="text-lg font-black text-muted-foreground mb-1">Mapa de Calor: Concentração</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-6">{t('bp.working_capital.subtitle')}</p>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Estoque / Ativo Circulante</span>
                        <span className="text-sm font-bold">{bpSummary && bpSummary.ativoCirculante > 0 ? ((bpSummary.estoques / bpSummary.ativoCirculante) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-amber-500" style={{ width: `${bpSummary && bpSummary.ativoCirculante > 0 ? (bpSummary.estoques / bpSummary.ativoCirculante) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Dívida CP / Passivo Total</span>
                        <span className="text-sm font-bold">{bpSummary && bpSummary.passivoTotal > 0 ? ((bpSummary.passivoCirculante / bpSummary.passivoTotal) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-rose-500" style={{ width: `${bpSummary && bpSummary.passivoTotal > 0 ? (bpSummary.passivoCirculante / bpSummary.passivoTotal) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">PL / Ativo Total (Autonomia)</span>
                        <span className="text-sm font-bold">{bpSummary && bpSummary.ativoTotal > 0 ? ((bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary" style={{ width: `${bpSummary && bpSummary.ativoTotal > 0 ? (bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Composição do Ativo */}
                <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm">
                  <h3 className="text-lg font-black text-muted-foreground mb-1">{t('bp.assets.title')}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-6">{t('bp.assets.subtitle')}</p>
                  
                  <div className="flex items-center">
                    <div className="h-64 w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ativoData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {ativoData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 pl-4 space-y-3">
                      {ativoData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate" title={item.name}>{item.name}</p>
                             <p className="text-sm font-bold text-muted-foreground">{formatCurrency(item.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Composição do Passivo */}
                <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm">
                  <h3 className="text-lg font-black text-muted-foreground mb-1">{t('bp.liabilities.title')}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mb-6">{t('bp.liabilities.subtitle')}</p>
                  
                  <div className="flex items-center">
                    <div className="h-64 w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={passivoData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {passivoData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 pl-4 space-y-3">
                      {passivoData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate" title={item.name}>{item.name}</p>
                             <p className="text-sm font-bold text-muted-foreground">{formatCurrency(item.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Análise de Evolução e Gráficos ── */}
              {chartData.length < 2 ? (
                <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-border text-muted-foreground">
                     <TrendingDown size={32} />
                   </div>
                   <h3 className="text-lg font-black text-muted-foreground mb-2">{t('bp.empty_longitudinal')}</h3>
                   <p className="text-xs font-medium text-muted-foreground max-w-3xl leading-relaxed">
                     Esta demonstração representa apenas um ciclo financeiro e não permite inferências longitudinais sobre estabilidade, deterioração ou consolidação operacional. A inteligência de evolução requer ao menos dois exercícios.
                   </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 bg-white p-8 rounded-[40px] border border-border shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div>
                        <h3 className="text-lg font-black text-muted-foreground">{t('bp.evolution.title')}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">Comparativo de 5 Anos</p>
                      </div>
                      <div className="flex gap-5 bg-slate-50 px-4 py-2 rounded-full border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('bp.metrics.assets')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]" />
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('bp.metrics.liabilities')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('bp.metrics.equity')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-[320px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorAtivo" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPassivo" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="year" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                            dy={10}
                          />
                          <YAxis hide />
                          <Tooltip 
                            cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-slate-900/90 text-white p-5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/50">{payload[0].payload.year}</p>
                                    <div className="space-y-3">
                                      {payload.map((p: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between gap-10">
                                          <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{p.name}</span>
                                          </div>
                                          <span className="text-xs font-black tabular-nums">{formatCurrency(p.value)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area type="monotone" dataKey="ativo" name="Ativo" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtivo)" />
                          <Area type="monotone" dataKey="passivo" name="Passivo" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorPassivo)" />
                          <Area type="monotone" dataKey="pl" name="PL" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPl)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    
                    <h3 className="text-lg font-black mb-1">{t('bp.highlights.title')}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-8">Variações Significativas (YoY)</p>
                    
                    <div className="space-y-6 flex-1">
                      {majorChanges.map((change, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className={cn(
                            "p-2 rounded-xl shrink-0",
                            change.ah > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                          )}>
                            {change.ah > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{change.name || change.conta}</p>
                            <p className="text-sm font-bold">{formatCurrency(change.val)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn("text-[10px] font-black", change.ah > 0 ? "text-emerald-400" : "text-rose-400")}>
                                {change.ah > 0 ? '+' : ''}{change.ah.toFixed(2)}%
                              </span>
                              <span className="text-[9px] text-white/30 font-medium">vs ano anterior</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {majorChanges.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 opacity-50 text-center px-4">
                          <Info size={32} className="mb-3 text-muted-foreground" />
                          <p className="text-xs font-bold text-muted-foreground">
                            {chartData.length <= 2 ? "Comparação preliminar entre exercícios" : "Estabilidade Estrutural"}
                          </p>
                          <p className="text-[10px] mt-1 text-muted-foreground font-medium">
                            {chartData.length <= 2
                              ? "As variações observadas ainda representam uma base histórica limitada, insuficiente para validações conclusivas sobre estabilidade ou maturação estrutural."
                              : "A arquitetura de capital não sofreu realocações bruscas entre os ciclos avaliados."
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tabelas Detalhadas com AV/AH ── */}
              <div>
                <div className="flex items-center justify-between px-2 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-muted-foreground">{t('bp.structural.title')}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">{t('bp.structural.subtitle')}</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-border shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">AV: Análise Vertical</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-border shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">AH: Análise Horizontal</span>
                     </div>
                  </div>
                </div>

                {rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-border shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Calendar size={28} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-black text-muted-foreground">{t('bp.empty_data')}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-2">
                      Importe ou insira manualmente os dados para o ano {filterYear}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {[
                      { title: 'Ativo', data: comparativeAnalysis.filter(r => (r.tipo || r.type || '').toLowerCase().includes('ativo')), color: 'emerald' },
                      { title: 'Passivo', data: comparativeAnalysis.filter(r => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('passivo') && !t.includes('patrimônio') && !t.includes('pl'); }), color: 'blue' },
                      { title: 'Patrimônio Líquido', data: comparativeAnalysis.filter(r => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('patrimônio') || t.includes('pl'); }), color: 'primary' }
                    ].map((section, idx) => (
                      <div key={idx} className="bg-white border border-border rounded-[32px] shadow-sm overflow-hidden group">
                        <div className={cn("px-6 py-5 border-b flex items-center justify-between bg-slate-50/50", `border-${section.color}-100/50`)}>
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-6 rounded-full", `bg-${section.color}-500`)} />
                            <h4 className="text-base font-black text-muted-foreground tracking-tight">{translateLabel(section.title)}</h4>
                          </div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full", `bg-${section.color}-50 text-${section.color}-600`)}>
                            {translateLabel('Detalhamento Estrutural')}
                          </span>
                        </div>
                        
                        <div className="p-2">
                          <div className="flex items-center px-4 py-3 border-b border-border text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            <div className="flex-1">{translateLabel('Conta Contábil')}</div>
                            <div className="w-32 text-right">{translateLabel('Saldo (R$)')}</div>
                            <div className="w-24 text-right">{translateLabel('AV (%)')}</div>
                            <div className="w-28 text-right">{translateLabel('AH (%)')}</div>
                          </div>
                          
                          <div className="space-y-1 mt-2">
                            {section.data.map((row: any, i: number) => {
                              const label = translateLabel((row.name || row.conta) === 'Patrimônio Líquido' ? 'Patrimônio' : (row.name || row.conta));
                              if (!label) return null;
                              return (
                              <div key={i} className={cn(
                                "flex items-center px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-slate-50",
                                row.level === 1 ? "bg-slate-50/50" : ""
                              )}>
                                <div className="flex-1 flex items-center">
                                  <span 
                                    className={cn(
                                      "text-xs block truncate pr-4", 
                                      row.level === 1 ? "font-black text-muted-foreground" : "font-semibold text-muted-foreground"
                                    )}
                                    style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 16}px` : '0px' }}
                                  >
                                    {row.level > 1 && (
                                      <span className="inline-block w-3 h-[1px] bg-slate-300 mr-2 align-middle opacity-50" />
                                    )}
                                    {label}
                                  </span>
                                </div>
                                
                                <div className="w-32 text-right font-display text-sm font-bold text-muted-foreground tabular-nums">
                                  {formatCurrency(row.val)}
                                </div>
                                
                                <div className="w-24 text-right flex flex-col items-end justify-center">
                                  <span className={cn(
                                    "inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-black tabular-nums border",
                                    row.av > 100 ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-slate-100/50 text-muted-foreground border-border"
                                  )}>
                                    {row.av !== null && row.av !== undefined ? (row.av > 100 ? '> 100%' : `${row.av.toFixed(2)}%`) : (
                                      <span className="text-[10px] font-black text-muted-foreground tabular-nums uppercase tracking-widest">-</span>
                                    )}
                                  </span>
                                </div>
                                
                                <div className="w-28 text-right flex justify-end">
                                  {row.ah !== 0 && row.ah !== null ? (
                                    <span className={cn(
                                      "inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tabular-nums border",
                                      row.ah > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : row.ah < 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-muted-foreground border-border"
                                    )}>
                                      {row.ah > 0 ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                                      {Math.abs(row.ah).toFixed(2)}%
                                    </span>
                                  ) : (
                                     <span className="inline-flex items-center justify-center px-2 py-1 text-muted-foreground text-[10px] font-black">
                                       —
                                     </span>
                                  )}
                                </div>
                               </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
          </details>
        </div>
      )}

      {/* ── Comentário Executivo ─────────────────────────────────────────── */}
      {engineError ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-6 py-4 rounded-xl mt-6">
          <h4 className="font-bold mb-1">{t('bp.engine_failure')}</h4>
          <p className="text-sm">{engineError}</p>
          <p className="text-xs opacity-80 mt-2">bpSummary exists: {bpSummary ? 'Yes' : 'No'}</p>
</div>
      ) : null}



      {!executiveReport ? null : (
        <ExecutiveCommentary
          reportType="Balance Sheet Intelligence"
          clientId={selectedClient}
          year={filterYear}
          month={12}
          defaultNote={executiveReport.patrimonialIntelligenceReport?.executiveNarrative || 'Nenhuma narrativa disponível para este exercício.'}
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md min-w-[300px] md:min-w-[400px] shadow-2xl shrink-0">
            <h3 className="text-xl font-black text-muted-foreground mb-2">Excluir Dados?</h3>
            <p className="text-sm text-muted-foreground mb-8 font-medium">
              Esta ação removerá todos os registros do Balanço Patrimonial para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-muted-foreground hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast && typeof document !== 'undefined' && createPortal(
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>,
        document.body
      )}
    </div>
  );

}
