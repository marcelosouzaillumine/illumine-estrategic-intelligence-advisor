import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, BookOpen, Database, TrendingUp, TrendingDown, Info, BarChart3, PieChart as PieChartIcon, AlertCircle, Activity } from 'lucide-react';
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
import { PageHeader, KpiCard } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';

import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateFinancialMetrics } from '../../lib/financial-engine';
import { calculateScores } from '../../lib/score-engine';
import { generateAdvisory } from '../../lib/advisory-engine';
import { calculateDreCascade } from '../../lib/dreCascade';
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

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais (BP) ────────────────────────────────────────────────
  const { dbData, docIds, loading: loadingBP, refetch: refetchBP } =
    useAnnualFinancialData(selectedClient, filterYear, 'Balanço Patrimonial');

  // ── Busca dados operacionais (DRE) ─────────────────────────────────────────
  const { dbData: dreDbData } = useAnnualFinancialData(selectedClient, filterYear, 'DRE');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingBP;

  const { flatNodes: rows, summary: bpSummary } = useMemo(() => {
    if (dbData.length > 0) {
      const aggregated: any = {};
      dbData.forEach((d: any) => {
        // Usa o docId para evitar colisão entre documentos diferentes, mas como o useAnnualFinancialData 
        // agora retorna apenas 1 documento (ou deveria), a principal fonte de duplicatas são 
        // contas com nomes repetidos dentro do próprio documento (ou legados).
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
          // Em vez de somar duplicatas (o que corrompe o valor de Ativo Circulante se houverem dois lançamentos),
          // vamos apenas manter a versão já extraída (a primeira). A não ser que seja zero, aí usamos a nova.
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
  }, [dbData]);

  // ── Processamento Histórico ────────────────────────────────────────────────
  const historyByYear = useMemo(() => {
    const years = [filterYear, filterYear - 1, filterYear - 2, filterYear - 3, filterYear - 4, filterYear - 5];
    const data: any = {};
    
    years.forEach(y => {
      // Tenta dados do banco primeiro
      const yearEntries = allHistoryData.filter((d: any) => d.year === y && (d.type === 'Balanço Patrimonial' || d.type === 'BP'));
      if (yearEntries.length > 0) {
        data[y] = yearEntries;
      } else {
        data[y] = [];
      }
    });
    return data;
  }, [allHistoryData, selectedClient, filterYear]);

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
      
      // No Brasil, "Total do Passivo" costuma incluir o PL (pois Ativo = Passivo + PL).
      // Para o gráfico ficar correto com 3 barras (Ativo, Passivo, PL), a barra de "Passivo" deve ser apenas o Exigível.
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

  // ── Extração de Variáveis via Engine Contábil ──────────────────────────────
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

  // -- Operacional (DRE) --
  const { ebitda, lucroLiquido } = useMemo(() => {
    if (dreDbData.length === 0) return { ebitda: 0, lucroLiquido: 0 };
    const cascadeResult = calculateDreCascade(dreDbData);
    const directEbitda = cascadeResult.find(r => r.id === 'EBITDA')?.computedValue || 0;
    const directLucro = cascadeResult.find(r => r.id === 'LUCRO_LIQ')?.computedValue || 0;
    return { ebitda: directEbitda, lucroLiquido: directLucro };
  }, [dreDbData]);
  
  // ── Engine de Inteligência Financeira (Centralizada) ──────────────────────
  const { metrics, scores, causalInsights } = useMemo(() => {
    const prevPl = getHistoricalValue(filterYear - 1, 'patrimônio líquido') || getHistoricalValue(filterYear - 1, 'pl') || 0;
    
    const baseMetrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido);
    const scoreMetrics = calculateScores(bpSummary, baseMetrics, dreDbData.length, prevPl);
    const advisory = generateAdvisory(bpSummary, baseMetrics, scoreMetrics);

    return { metrics: baseMetrics, scores: scoreMetrics, causalInsights: advisory };
  }, [bpSummary, ebitda, lucroLiquido, filterYear, dreDbData.length, historyByYear]);

  const {
    liqCorrente, liqSeca, liqImediata, liqGeral, liquidezReal,
    ncg, concentracaoEstoque, qualidadeEndividamento, dependenciaBancaria,
    autonomiaFinanceira, indiceDescapitalizacao, cgl, saldoTesouraria
  } = metrics;

  const {
    hsLiquidez, hsEstrutura, hsCapitalGiro, hsPatrimonial, hsEvolucao,
    hsQualidadeAtivos, hsOperacional, resilienciaGlobal
  } = scores;

  const maturidade = causalInsights.maturidade;

  const hasData = metrics.hasData;

  const formatKpiValue = (val: number, isCurrency: boolean = false, suffix: string = '') => {
    if (!hasData) return '—';
    return isCurrency ? formatCurrency(val) : val.toFixed(2);
  };
  
  const getKpiStatus = (condition: boolean) => {
    if (!hasData) return 'Neutro';
    return condition ? 'Verde' : 'Vermelho';
  };

  const liquidityIndices = [
    { name: 'Liquidez Corrente',  val: liqCorrente,  desc: 'Capacidade de pagamento no curto prazo',              status: liqCorrente >= 1.2 ? 'Verde' : liqCorrente >= 0.8 ? 'Amarelo' : 'Vermelho' },
    { name: 'Liquidez Seca',      val: liqSeca,      desc: 'Capacidade de pagamento sem depender do estoque',     status: liqSeca >= 1.0 ? 'Verde' : liqSeca >= 0.8 ? 'Amarelo' : 'Vermelho' },
    { name: 'Liquidez Imediata',  val: liqImediata,  desc: 'Disponibilidade imediata para quitar obrigações',     status: liqImediata >= 0.5 ? 'Verde' : liqImediata >= 0.1 ? 'Amarelo' : 'Vermelho' },
    { name: 'Liquidez Geral',     val: liqGeral,     desc: 'Solvência de curto e longo prazo',                    status: liqGeral >= 1.2 ? 'Verde' : liqGeral >= 1.0 ? 'Amarelo' : 'Vermelho' },
    { name: 'Liquidez Real',      val: liquidezReal, desc: 'Liquidez purgada de ativos de difícil realização',    status: liquidezReal >= 1.0 ? 'Verde' : liquidezReal >= 0.5 ? 'Amarelo' : 'Vermelho' },
  ];

  // ── Análise Horizontal e Vertical ───────────────────────────────────────────
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

  const majorChanges = useMemo(() => {
    const changes = [];
    const filtered = comparativeAnalysis
      .filter(a => Math.abs(a.ah) > 5 && a.val > 1000) // Relevância > 5% e > 1k
      .sort((a, b) => Math.abs(b.ah) - Math.abs(a.ah));
      
    filtered.forEach(item => {
      // Remove redundâncias (ex: "Fornecedores" e "Fornecedores Nacionais" com o mesmo valor)
      const isRedundant = changes.some(u => {
        const uName = (u.name || u.conta || '').toLowerCase();
        const itemName = (item.name || item.conta || '').toLowerCase();
        return u.val === item.val && 
        Math.abs(u.ah - item.ah) < 0.1 &&
        (uName.includes(itemName.split(' ')[0]) || itemName.includes(uName.split(' ')[0]));
      });
      if (!isRedundant) changes.push(item);
    });
    
    return changes.slice(0, 4);
  }, [comparativeAnalysis]);

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
      const idsToDelete: string[] = [...docIds];

      for (const t of types) {
        const q = query(
          collection(db, 'financial_entries'),
          where('clientId', '==', selectedClient),
          where('type',     '==', t),
          where('year',     '==', filterYear)
        );
        const snap = await getDocs(q);
        snap.docs.forEach((d) => {
          if (!idsToDelete.includes(d.id)) idsToDelete.push(d.id);
        });
      }

      await Promise.all(idsToDelete.map((id) => deleteDoc(doc(db, 'financial_entries', id))));
      showToast('success', `${idsToDelete.length} registro(s) excluído(s) com sucesso.`);
      refetchBP();
      
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };


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
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={dbData.length > 0 ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-success' : 'text-muted-foreground/40')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
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



      
      {/* ── Validação Contábil (Engine) ── */}
      {dbData.length > 0 && bpSummary && !bpSummary.isBalanced && (
        <div className="mb-12 bg-rose-50 border-2 border-rose-200 rounded-[32px] p-8 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 text-rose-600 relative z-10">
            <AlertCircle size={32} strokeWidth={2.5} />
            <h3 className="text-2xl font-black tracking-tight">Desbalanceamento Patrimonial Detectado</h3>
          </div>
          <p className="text-rose-800 font-medium relative z-10">
            A consolidação identificou que a equação contábil fundamental (Ativo = Passivo + Patrimônio Líquido) não foi atendida.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 relative z-10">
            <div className="bg-white/60 p-4 rounded-2xl border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Ativo</span>
              <div className="text-lg font-black text-slate-900 mt-1">{formatCurrency(bpSummary.ativoTotal)}</div>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Passivo + PL</span>
              <div className="text-lg font-black text-slate-900 mt-1">{formatCurrency(bpSummary.passivoTotal + bpSummary.patrimonioLiquido)}</div>
            </div>
            <div className="bg-rose-100 p-4 rounded-2xl border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Divergência Encontrada</span>
              <div className="text-xl font-black text-rose-700 mt-1">{formatCurrency(bpSummary.divergence)}</div>
            </div>
          </div>
          <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mt-2 relative z-10">
            Verifique o arquivo importado ou revise as linhas inseridas manualmente.
          </p>
        </div>
      )}

      {/* ── Resiliência e Maturidade (Health Scores) ── */}
      <div className={cn("mb-12", dbData.length > 0 && bpSummary && !bpSummary.isBalanced ? "opacity-50 pointer-events-none grayscale" : "")}>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-slate-700/50 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
          
          <div className="w-full md:w-auto md:flex-1 flex flex-col items-center md:items-start z-10 text-center md:text-left mb-10 md:mb-0 md:mr-10">
            <h3 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Score Patrimonial</h3>
            <p className="text-sm md:text-base text-indigo-100/80 font-medium leading-relaxed w-full">
              Índice composto que avalia a saúde estrutural, folga de caixa, proteção contra choques de curto prazo e a qualidade do financiamento de longo prazo.
            </p>
            
            <div className={cn("px-6 py-3 mt-8 rounded-full border shadow-inner backdrop-blur-sm text-xs font-bold uppercase tracking-wider inline-flex", 
              resilienciaGlobal >= 81 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
              resilienciaGlobal >= 61 ? 'bg-indigo-500/5 text-indigo-300 border-indigo-500/10' : 
              resilienciaGlobal >= 41 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
              resilienciaGlobal >= 21 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-red-600/20 text-red-400 border-red-500/30')}>
              Nível {maturidade}
            </div>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center shrink-0 z-10">
            {/* SVG Gradients */}
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

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Liquidez (25%)', val: hsLiquidez, color: 'emerald', explicacao: `Memória de Cálculo:\nLiquidez Corrente (${liqCorrente.toFixed(2)}) e Real (${liquidezReal.toFixed(2)}). Pondera a capacidade de honrar passivos curtos com ativos altamente conversíveis.` },
            { label: 'Estrutura (25%)', val: hsEstrutura, color: 'blue', explicacao: `Memória de Cálculo:\nQualidade do Endividamento (${(qualidadeEndividamento * 100).toFixed(2)}% curto prazo) e Dependência Bancária (${(dependenciaBancaria * 100).toFixed(2)}%). Penaliza alta concentração no curto prazo.` },
            { label: 'Cap. Giro (20%)', val: hsCapitalGiro, color: 'amber', explicacao: `Memória de Cálculo:\nNCG (${formatCurrency(ncg)}) vs AC (${formatCurrency(ac)}) e Concentração de Estoques (${(concentracaoEstoque * 100).toFixed(2)}%).` },
            { label: 'Solidez (20%)', val: hsPatrimonial, color: 'purple', explicacao: `Memória de Cálculo:\nAutonomia Financeira (${(autonomiaFinanceira * 100).toFixed(2)}%) e Índice de Descapitalização (${(indiceDescapitalizacao * 100).toFixed(2)}%). Mede a proteção do passivo pelo capital próprio.` },
            { label: 'Evolução (10%)', val: hsEvolucao, color: 'indigo', explicacao: `Memória de Cálculo:\nCrescimento YoY do Patrimônio Líquido frente ao ano anterior.` }
          ].map((hs, i) => (
            <div key={i} title={hs.explicacao} className={cn("border rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-help", 
              hasData ? "bg-slate-950 border-white/5 hover:border-white/10" : "bg-slate-100 border-slate-200"
            )}>
              {hasData && <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[40px] -mr-16 -mt-16 pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-70", `bg-${hs.color}-500/30`)} />}
              
              <div className="relative z-10">
                <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-4 block", hasData ? "text-white/40 group-hover:text-white/60 transition-colors" : "text-slate-400")}>{hs.label}</span>
                <div className="mt-8">
                  <span className={cn("text-4xl font-black tracking-tighter drop-shadow-md", hasData ? "text-white" : "text-slate-300")}>{hasData ? hs.val.toFixed(0) : '—'}</span>
                  <div className={cn("w-full h-1.5 rounded-full mt-4 overflow-hidden shadow-inner", hasData ? "bg-white/5" : "bg-slate-200")}>
                    <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", hasData ? `bg-${hs.color}-500` : "bg-transparent")} style={{ width: `${hasData ? hs.val : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Inteligência Patrimonial (Leitura Causal) ── */}
      <div className="mb-12">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 pl-2">Notas Explicativas & Advisory</h3>
        <div className="grid grid-cols-1 gap-6">
          {causalInsights ? (
            <div className="col-span-full space-y-6">
              {/* Card 1: Diagnóstico Executivo */}
              <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 relative z-10">Diagnóstico Executivo</h4>
                <p className="text-lg md:text-xl font-medium leading-relaxed relative z-10">{causalInsights.diagnostico}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fragilidades */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4">Fragilidades Estruturais</h4>
                  <ul className="space-y-3">
                    {causalInsights.fragilidades.map((f: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                        <span className="text-rose-500 mt-0.5 shrink-0">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Implicações Estratégicas */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">Implicações Estratégicas</h4>
                  <ul className="space-y-3">
                    {causalInsights.estrategico.map((e: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                        <span className="text-indigo-500 mt-0.5 shrink-0">•</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recomendações Executivas */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-[32px] p-8 border border-slate-200 shadow-sm md:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Recomendações Executivas (Action Plan)</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {causalInsights.recomendacoesExecutivas.map((p: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-700 font-bold bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impacto Estratégico Esperado */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm md:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Impacto Estratégico Esperado</h4>
                  <div className="space-y-3">
                    {causalInsights.impactosEsperados.map((imp: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 md:w-1/3 shrink-0">{imp.acao}</span>
                        <span className="text-sm font-medium text-slate-700">{imp.impacto}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prioridades Estratégicas */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm md:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Prioridades Estratégicas (Nível de Urgência)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {causalInsights.prioridadesEstrategicas.map((p: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">{p.nome}</p>
                        <p className={cn("text-sm font-black", 
                          p.status === 'Crítico' ? 'text-rose-600' : 
                          p.status === 'Atenção' ? 'text-amber-500' : 
                          p.status === 'Monitorar' ? 'text-blue-500' : 
                          'text-emerald-500'
                        )}>{p.status}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tendência e ICE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                  {/* Índice de Continuidade Empresarial */}
                  <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-800/50 blur-[50px] rounded-full" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 relative z-10">Índice de Continuidade Empresarial</h4>
                    <div className="flex items-end gap-3 relative z-10">
                      <span className={cn("text-5xl font-black tracking-tighter", 
                        causalInsights.indiceContinuidade.color === 'emerald' ? 'text-emerald-400' :
                        causalInsights.indiceContinuidade.color === 'amber' ? 'text-amber-400' :
                        causalInsights.indiceContinuidade.color === 'blue' ? 'text-blue-400' :
                        'text-rose-400'
                      )}>{scores.indiceContinuidade}</span>
                      <span className="text-sm font-bold text-slate-300 pb-2">/ 100</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-2 relative z-10">{causalInsights.indiceContinuidade.status}</p>
                  </div>

                  {/* Tendência */}
                  <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col items-start justify-center gap-4">
                    <div className="shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                      <TrendingUp className="text-slate-500" size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Tendência Projetada</h4>
                      <p className="text-sm font-bold text-slate-800">{causalInsights.tendencia}</p>
                    </div>
                  </div>
                </div>

                {/* Liquidity Quality Intelligence (LQI) */}
                <div className="bg-emerald-900/5 rounded-[32px] p-8 border border-emerald-100 shadow-sm md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Activity className="text-emerald-600" size={16} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Liquidity Quality Intelligence</h4>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-emerald-100/50 shadow-sm mb-6">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Diagnóstico de Sustentabilidade</p>
                    <p className="text-sm font-bold text-slate-800">{causalInsights.liquidityQuality.diagnostico}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Risco de Estrangulamento</p>
                      <p className={cn("text-sm font-bold", causalInsights.liquidityQuality.riscoEstrangulamento.includes('Imediato') ? 'text-rose-500' : causalInsights.liquidityQuality.riscoEstrangulamento.includes('Latente') ? 'text-amber-500' : 'text-emerald-500')}>{causalInsights.liquidityQuality.riscoEstrangulamento}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Qualidade do Capital de Giro</p>
                      <p className={cn("text-sm font-bold", causalInsights.liquidityQuality.qualidadeCapitalGiro.includes('Baixa') ? 'text-rose-500' : 'text-emerald-500')}>{causalInsights.liquidityQuality.qualidadeCapitalGiro}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-emerald-100/30 flex flex-col items-center text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">Alta Conv.</span>
                      <span className="text-xs font-bold mt-1 text-slate-700">{formatCurrency(causalInsights.liquidityQuality.metricas.alta)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100/30 flex flex-col items-center text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-500">Média Conv.</span>
                      <span className="text-xs font-bold mt-1 text-slate-700">{formatCurrency(causalInsights.liquidityQuality.metricas.media)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100/30 flex flex-col items-center text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-500">Baixa Conv.</span>
                      <span className="text-xs font-bold mt-1 text-slate-700">{formatCurrency(causalInsights.liquidityQuality.metricas.baixa)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100/30 flex flex-col items-center text-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-rose-500">Restrita</span>
                      <span className="text-xs font-bold mt-1 text-slate-700">{formatCurrency(causalInsights.liquidityQuality.metricas.restrita)}</span>
                    </div>
                  </div>
                </div>

                {/* Elasticidade Financeira */}
                <div className="bg-indigo-900/5 rounded-[32px] p-8 border border-indigo-100 shadow-sm md:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-6">Elasticidade Financeira (Capacidade Estrutural)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Absorção de Choques</p>
                      <p className={cn("text-sm font-bold", causalInsights.elasticidadeFinanceira.capacidadeAbsorcaoChoques.includes('Nula') ? 'text-rose-500' : causalInsights.elasticidadeFinanceira.capacidadeAbsorcaoChoques.includes('Moderada') ? 'text-amber-500' : 'text-emerald-500')}>{causalInsights.elasticidadeFinanceira.capacidadeAbsorcaoChoques}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Dependência Operacional</p>
                      <p className={cn("text-sm font-bold", causalInsights.elasticidadeFinanceira.dependenciaOperacao.includes('sufocado') ? 'text-rose-500' : 'text-emerald-500')}>{causalInsights.elasticidadeFinanceira.dependenciaOperacao}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Necessidade de Equity</p>
                      <p className={cn("text-sm font-bold", causalInsights.elasticidadeFinanceira.necessidadeCapitalizacao.includes('Emergencial') ? 'text-rose-500' : causalInsights.elasticidadeFinanceira.necessidadeCapitalizacao.includes('Recomendada') ? 'text-amber-500' : 'text-emerald-500')}>{causalInsights.elasticidadeFinanceira.necessidadeCapitalizacao}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Resiliência Estrutural</p>
                      <p className={cn("text-sm font-bold", causalInsights.elasticidadeFinanceira.resilienciaEstrutural === 'Frágil' ? 'text-rose-500' : causalInsights.elasticidadeFinanceira.resilienciaEstrutural === 'Adequada' ? 'text-amber-500' : 'text-emerald-500')}>{causalInsights.elasticidadeFinanceira.resilienciaEstrutural}</p>
                    </div>
                  </div>
                </div>

                {/* Predição Sistêmica (Risco e Sobrevivência) */}
                <div className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-lg md:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Projeção de Risco e Sobrevivência</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Horizonte de Pressão</p>
                      <p className={cn("text-sm font-bold", causalInsights.predicao.horizontePressao.includes('Curto Prazo') ? 'text-rose-400' : causalInsights.predicao.horizontePressao.includes('Médio Prazo') ? 'text-amber-400' : 'text-emerald-400')}>{causalInsights.predicao.horizontePressao}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Risco de Ruptura</p>
                      <p className={cn("text-sm font-bold", causalInsights.predicao.riscoRuptura.includes('Alto') ? 'text-rose-400' : causalInsights.predicao.riscoRuptura.includes('Moderado') ? 'text-amber-400' : 'text-emerald-400')}>{causalInsights.predicao.riscoRuptura}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Dependência de Geração</p>
                      <p className={cn("text-sm font-bold", causalInsights.predicao.dependenciaGeracao.includes('Alta') ? 'text-rose-400' : 'text-emerald-400')}>{causalInsights.predicao.dependenciaGeracao}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Sensibilidade a Choques</p>
                      <p className={cn("text-sm font-bold", causalInsights.predicao.sensibilidadeChoques.includes('Alta') ? 'text-rose-400' : causalInsights.predicao.sensibilidadeChoques.includes('Moderada') ? 'text-amber-400' : 'text-emerald-400')}>{causalInsights.predicao.sensibilidadeChoques}</p>
                    </div>
                  </div>
                </div>

                {/* Sensibilidade Operacional (Simulação de Estresse) */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm md:col-span-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Sensibilidade Operacional (Testes de Estresse)</h4>
                  <div className="space-y-4">
                    {causalInsights.estresse.map((s: any, idx: number) => (
                      <div key={idx} className={cn(
                        "p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4 transition-all hover:shadow-md",
                        s.status === 'danger' ? "bg-rose-50/50 border-rose-100" : s.status === 'warning' ? "bg-amber-50/50 border-amber-100" : "bg-emerald-50/50 border-emerald-100"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                          s.status === 'danger' ? "bg-rose-100 text-rose-600 border-rose-200" : s.status === 'warning' ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-emerald-100 text-emerald-600 border-emerald-200"
                        )}>
                          {s.status === 'danger' ? <TrendingDown size={18} strokeWidth={2.5} /> : s.status === 'warning' ? <AlertCircle size={18} strokeWidth={2.5} /> : <TrendingUp size={18} strokeWidth={2.5} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.cenario}</p>
                          <p className={cn("text-sm font-semibold", s.status === 'danger' ? 'text-rose-900' : s.status === 'warning' ? 'text-amber-900' : 'text-emerald-900')}>{s.impacto}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="col-span-full py-12 text-center opacity-50 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
               <Database size={32} className="mx-auto mb-4 text-slate-400" />
               <p className="text-sm font-bold text-slate-500">Aguardando consolidação dos demonstrativos contábeis para emissão do parecer executivo estrutural.</p>
             </div>
          )}
        </div>
      </div>

      {/* ── Indicadores Estratégicos Originais e Expandidos ── */}
      <div className="space-y-8 mb-10">
        <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-1">Inteligência de Capital de Giro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard title="Capital de Giro Líquido" value={formatKpiValue(cgl, true)} suffix="" icon={Database} status={getKpiStatus(cgl > 0)} />
            <KpiCard title="Necessidade de Giro (NCG)" value={formatKpiValue(ncg, true)} suffix="" icon={TrendingUp} status={getKpiStatus(ncg < cgl)} />
            <KpiCard title="Saldo de Tesouraria" value={formatKpiValue(saldoTesouraria, true)} suffix="" icon={BookOpen} status={getKpiStatus(saldoTesouraria > 0)} />
        </div>

        <div>
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-1">Índices de Liquidez (Tradicional e Real)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">

            {liquidityIndices.map((idx, i) => (
              <KpiCard 
                key={i}
                title={idx.name}
                value={formatKpiValue(idx.val)}
                suffix=""
                icon={TrendingUp}
                status={hasData ? idx.status : 'Pendente'}
              />
            ))}
          </div>
        </div>
      </div>
            {/* ── Análise de Evolução e Gráficos ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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
          
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Database size={18} className="text-white" />
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inteligência de Dados</p>
               <p className="text-[10px] font-medium text-white/70 italic">Análise baseada em 5 ciclos históricos</p>
             </div>
          </div>
        </div>
      </div>

            {/* ── Tabelas Detalhadas com AV/AH ─────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 mb-2">
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
            {/* Seções de Tabelas */}
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
                  {/* Header Row */}
                  <div className="flex items-center px-4 py-3 border-b border-slate-100/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <div className="flex-1">Conta Contábil</div>
                    <div className="w-32 text-right">Saldo (R$)</div>
                    <div className="w-24 text-right">AV (%)</div>
                    <div className="w-28 text-right">AH (%)</div>
                  </div>
                  
                  {/* Data Rows */}
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
                          {row.av > 100 && (
                            <span className="text-[7.5px] font-bold uppercase tracking-widest text-rose-500 mt-1 opacity-70" title={`Representa ${row.av.toFixed(2)}% do Ativo (Passivo a Descoberto)`}>
                              Passivo a Descoberto
                            </span>
                          )}
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
