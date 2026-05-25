import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { ExecutivePerspectiveSection } from '../ExecutivePerspectiveSection';

import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';

import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade } from '../../lib/dreCascade';
import { executiveRuntime, ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
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

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = { type: 'success' | 'error'; message: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────
export function BalanceSheetPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
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
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais (BP) ────────────────────────────────────────────────
  const { dbData: financialEntries, loading, error, refetch } = useAnnualFinancialData(selectedClient, selectedYear, 'BP');


  // ── Busca dados operacionais (DRE) ─────────────────────────────────────────
  const { dbData: dreDbData } = useAnnualFinancialData(selectedClient, filterYear, 'DRE');

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
    const refetchBP = () => {};

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

  const { ebitda, lucroLiquido } = useMemo(() => {
    if (dreDbData.length === 0) return { ebitda: 0, lucroLiquido: 0 };
    const cascadeResult = calculateDreCascade(dreDbData);
    const directEbitda = cascadeResult.find(r => r.id === 'EBITDA')?.computedValue || 0;
    const directLucro = cascadeResult.find(r => r.id === 'LUCRO_LIQ')?.computedValue || 0;
    return { ebitda: directEbitda, lucroLiquido: directLucro };
  }, [dreDbData]);
  
  const [executiveReport, setExecutiveReport] = useState<ExecutiveIntelligenceReport | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      if (!bpSummary) return;

      const prevPl = getHistoricalValue(filterYear - 1, 'patrimônio líquido') || getHistoricalValue(filterYear - 1, 'pl') || 0;
      const clientObj = clients?.find((c: any) => c.id === selectedClient);
      const industry = clientObj?.segmentoAtuacao || clientObj?.segmento || clientObj?.industry || 'Geral';
      
      const prevEbitda = getHistoricalValue(filterYear - 1, 'ebitda') || getHistoricalValue(filterYear - 1, 'lajida') || 0;
      const prevCaixa = getHistoricalValue(filterYear - 1, 'caixa') || getHistoricalValue(filterYear - 1, 'disponibilidades') || 0;
      
      let calculatedCycles = Object.keys(historyByYear).length || 1;
      if (clientObj?.dataFundacao) {
        let fundacaoYear = null;
        if (clientObj.dataFundacao.includes('/')) {
          const parts = clientObj.dataFundacao.split('/');
          if (parts.length === 3) fundacaoYear = parseInt(parts[2]);
        } else if (clientObj.dataFundacao.includes('-')) {
          const parts = clientObj.dataFundacao.split('-');
          if (parts.length >= 1) fundacaoYear = parseInt(parts[0]);
        }
        
        if (fundacaoYear && !isNaN(fundacaoYear)) {
          calculatedCycles = Math.max(1, filterYear - fundacaoYear);
        }
      }

      const input = {
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
        dreData: dreDbData,
        historicalCyclesCount: calculatedCycles,
        isMockData: financialEntries.length === 0
      };

      try {
        const runtimeStart = performance.now();
        // DUMMY RENDERER: Chamamos a Single Source of Truth
        const report = executiveRuntime.generateExecutiveReport(input);
        const runtimeEnd = performance.now();
        
        console.log(`[TELEMETRY] Runtime Execution Time: ${(runtimeEnd - runtimeStart).toFixed(2)}ms`);
        console.log(`[TELEMETRY] Historical Payload Size: ${input.historicalSeries?.length || 0} years`);
        console.log(`[TELEMETRY] Temporal Mode: ${report.compliance.runtimeMode}`);
        console.log(`[TELEMETRY] Trend Confidence: ${report.compliance.confidenceLevel}`);
        
        setExecutiveReport(report);
      } catch (err) {
        console.error("Executive Runtime Falhou:", err);
      }
    }

    runAnalysis();
  }, [bpSummary, ebitda, lucroLiquido, filterYear, dreDbData.length, historyByYear, clients, selectedClient]);

  const hasData = executiveReport?.compliance.confidenceLevel !== 'LOW_CONFIDENCE';
  const resilienciaGlobal = executiveReport?.scores.composite || 0;
  const maturidade = executiveReport?.context.stage || 'Pendente';

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
      const val = row.value !== undefined ? row.value : (row.val || 0);
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
              {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
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

      <div className={cn("space-y-6 mb-12", financialEntries.length > 0 && bpSummary && (!bpSummary.isBalanced || executiveReport?.severity.level === 'CRÍTICO' || executiveReport?.severity.level === 'COLAPSO') ? "opacity-50 pointer-events-none grayscale" : "")}>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <h3 className="text-2xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 z-10">Score Patrimonial</h3>
            <div className={cn("px-4 py-1.5 mt-2 mb-8 rounded-full border shadow-inner backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest inline-flex z-10", 
              resilienciaGlobal >= 81 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
              resilienciaGlobal >= 61 ? 'bg-indigo-500/5 text-indigo-300 border-indigo-500/10' : 
              resilienciaGlobal >= 41 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
              resilienciaGlobal >= 21 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-red-600/20 text-red-400 border-red-500/30')}>
              Nível {maturidade}
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center shrink-0 z-10">
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="score-gradient-patrimonial" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={resilienciaGlobal >= 80 ? "#6366f1" : resilienciaGlobal >= 50 ? "#f59e0b" : "#ef4444"} />
                    <stop offset="100%" stopColor={resilienciaGlobal >= 80 ? "#818cf8" : resilienciaGlobal >= 50 ? "#fbbf24" : "#f87171"} />
                  </linearGradient>
                </defs>
              </svg>
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]" viewBox="0 0 192 192">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/80" />
                <circle cx="96" cy="96" r="84" stroke="url(#score-gradient-patrimonial)" strokeWidth="12" fill="transparent" 
                  strokeDasharray="528" 
                  strokeDashoffset={528 - (528 * resilienciaGlobal) / 100}
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-6xl font-black text-white filter drop-shadow-sm leading-none absolute">{hasData ? resilienciaGlobal.toFixed(0) : '—'}</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest absolute bottom-9">/ 100</span>
              </div>
            </div>
          </div>
          
          {/* Diagnóstico Executivo Consolidado e Tendências */}
          <div className="lg:col-span-2 flex flex-col gap-6">
             <ExecutivePerspectiveSection intelligenceReport={executiveReport} loading={!executiveReport} className="h-full border-none shadow-xl" />
          </div>
        </div>
      </div>



      {/* =========================================================
          CAMADA 3: EXECUTIVE FINANCIAL ANALYTICS
          Detalhamento granular, gráficos e tabelas
      ========================================================= */}
      {hasData && (
        <div className="mb-12">
          <button 
            onClick={() => setShowCamada3(!showCamada3)}
            className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[24px] transition-all group"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md">3</div>
               <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900">Executive Financial Analytics</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cálculos • AV / AH • Gráficos</p>
               </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors border border-slate-100">
               {showCamada3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {showCamada3 && (
            <div className="space-y-12 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              
              {/* Detailed Progress Bars */}
              <div>
                <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-1">Decomposição do Score Patrimonial</h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {executiveReport?.decomposition.map((hs, i) => (
                    <div key={i} title={hs.explanation} className={cn("border rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group cursor-help", 
                      "bg-white border-slate-200 shadow-sm hover:shadow-md transition-all"
                    )}>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block text-slate-500">{hs.label}</span>
                      <div>
                        <span className="text-3xl font-black tracking-tighter text-slate-800">{hs.value.toFixed(0)}</span>
                        <div className="w-full h-1.5 rounded-full mt-3 overflow-hidden bg-slate-100">
                          <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", `bg-${hs.severityColor}-500`)} style={{ width: `${hs.value}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Gráficos Adicionais Executivos ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waterfall: Dinâmica de Capital de Giro */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm col-span-1 md:col-span-2 lg:col-span-1 flex flex-col">
                  <h3 className="text-lg font-black text-slate-900 mb-1">Dinâmica do Capital de Giro</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-6">Waterfall de Liquidez Corrente</p>
                  
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
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
                  <h3 className="text-lg font-black text-slate-900 mb-1">Mapa de Calor: Concentração</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-6">Riscos de Exposição</p>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Estoque / Ativo Circulante</span>
                        <span className="text-sm font-bold">{bpSummary && bpSummary.ativoCirculante > 0 ? ((bpSummary.estoques / bpSummary.ativoCirculante) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-amber-500" style={{ width: `${bpSummary && bpSummary.ativoCirculante > 0 ? (bpSummary.estoques / bpSummary.ativoCirculante) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Dívida CP / Passivo Total</span>
                        <span className="text-sm font-bold">{bpSummary && bpSummary.passivoTotal > 0 ? ((bpSummary.passivoCirculante / bpSummary.passivoTotal) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-rose-500" style={{ width: `${bpSummary && bpSummary.passivoTotal > 0 ? (bpSummary.passivoCirculante / bpSummary.passivoTotal) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">PL / Ativo Total (Autonomia)</span>
                        <span className="text-sm font-bold">{bpSummary && bpSummary.ativoTotal > 0 ? ((bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-indigo-500" style={{ width: `${bpSummary && bpSummary.ativoTotal > 0 ? (bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Composição do Ativo */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-1">Composição do Ativo</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-6">Distribuição de Capital Investido</p>
                  
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
                             <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 truncate" title={item.name}>{item.name}</p>
                             <p className="text-sm font-bold text-slate-800">{formatCurrency(item.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Composição do Passivo */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-1">Composição do Passivo</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-6">Origem de Capital de Terceiros</p>
                  
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
                             <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 truncate" title={item.name}>{item.name}</p>
                             <p className="text-sm font-bold text-slate-800">{formatCurrency(item.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Análise de Evolução e Gráficos ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Evolução Patrimonial</h3>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mt-1">Comparativo de 5 Anos</p>
                    </div>
                    <div className="flex gap-5 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ativo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Passivo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PL</span>
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
                  
                  <h3 className="text-lg font-black mb-1">Destaques da Evolução</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Variações Significativas (YoY)</p>
                  
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
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{change.name || change.conta}</p>
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
                        <Info size={32} className="mb-3 text-slate-300" />
                        <p className="text-xs font-bold text-slate-400">Estabilidade Estrutural</p>
                        <p className="text-[10px] mt-1 text-slate-500 font-medium">A arquitetura de capital não sofreu realocações bruscas entre os ciclos avaliados.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Tabelas Detalhadas com AV/AH ── */}
              <div>
                <div className="flex items-center justify-between px-2 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Análise Estrutural Detalhada</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">Composição Horizontal e Vertical</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AV: Análise Vertical</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AH: Análise Horizontal</span>
                     </div>
                  </div>
                </div>

                {rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Calendar size={28} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-black text-slate-500">Nenhum dado encontrado</p>
                    <p className="text-xs font-medium text-slate-400 mt-2">
                      Importe ou insira manualmente os dados para o ano {filterYear}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {[
                      { title: 'Ativo', data: comparativeAnalysis.filter(r => (r.tipo || r.type || '').toLowerCase().includes('ativo')), color: 'emerald' },
                      { title: 'Passivo', data: comparativeAnalysis.filter(r => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('passivo') && !t.includes('patrimônio') && !t.includes('pl'); }), color: 'blue' },
                      { title: 'Patrimônio Líquido', data: comparativeAnalysis.filter(r => { const t = (r.tipo || r.type || '').toLowerCase(); return t.includes('patrimônio') || t.includes('pl'); }), color: 'purple' }
                    ].map((section, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden group">
                        <div className={cn("px-6 py-5 border-b flex items-center justify-between bg-slate-50/50", `border-${section.color}-100/50`)}>
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-6 rounded-full", `bg-${section.color}-500`)} />
                            <h4 className="text-base font-black text-slate-900 tracking-tight">{section.title}</h4>
                          </div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full", `bg-${section.color}-50 text-${section.color}-600`)}>
                            Detalhamento Estrutural
                          </span>
                        </div>
                        
                        <div className="p-2">
                          <div className="flex items-center px-4 py-3 border-b border-slate-100/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <div className="flex-1">Conta Contábil</div>
                            <div className="w-32 text-right">Saldo (R$)</div>
                            <div className="w-24 text-right">AV (%)</div>
                            <div className="w-28 text-right">AH (%)</div>
                          </div>
                          
                          <div className="space-y-1 mt-2">
                            {section.data.map((row: any, i: number) => (
                              <div key={i} className={cn(
                                "flex items-center px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-slate-50",
                                row.level === 1 ? "bg-slate-50/50" : ""
                              )}>
                                <div className="flex-1 flex items-center">
                                  <span 
                                    className={cn(
                                      "text-xs block truncate pr-4", 
                                      row.level === 1 ? "font-black text-slate-800" : "font-semibold text-slate-500"
                                    )}
                                    style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 16}px` : '0px' }}
                                  >
                                    {row.level > 1 && (
                                      <span className="inline-block w-3 h-[1px] bg-slate-300 mr-2 align-middle opacity-50" />
                                    )}
                                    {(row.name || row.conta) === 'Patrimônio Líquido' ? 'Patrimônio' : (row.name || row.conta)}
                                  </span>
                                </div>
                                
                                <div className="w-32 text-right font-display text-sm font-bold text-slate-700 tabular-nums">
                                  {formatCurrency(row.val)}
                                </div>
                                
                                <div className="w-24 text-right flex flex-col items-end justify-center">
                                  <span className={cn(
                                    "inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-black tabular-nums border",
                                    row.av > 100 ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-slate-100/50 text-slate-500 border-slate-200/50"
                                  )}>
                                    {row.av > 100 ? '> 100%' : `${row.av.toFixed(2)}%`}
                                  </span>
                                </div>
                                
                                <div className="w-28 text-right flex justify-end">
                                  {row.ah !== 0 ? (
                                    <span className={cn(
                                      "inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tabular-nums border",
                                      row.ah > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : row.ah < 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-200"
                                    )}>
                                      {row.ah > 0 ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                                      {Math.abs(row.ah).toFixed(2)}%
                                    </span>
                                  ) : (
                                     <span className="inline-flex items-center justify-center px-2 py-1 text-slate-300 text-[10px] font-black">
                                       —
                                     </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── Comentário Executivo ─────────────────────────────────────────── */}
      <ExecutiveCommentary
        reportType="BP"
        clientId={selectedClient}
        year={filterYear}
        month={1}
      />

      {/* Modals */}
      {showImportModal && (
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
        />
      )}

      {showManualModal && (
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
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros do Balanço Patrimonial para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
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
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed bottom-8 right-8 px-5 md:px-8 py-2.5 md:py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}
    </div>
  );

}
