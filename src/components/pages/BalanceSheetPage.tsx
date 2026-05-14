import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, BookOpen, Database, TrendingUp, TrendingDown, Info, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
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
import { cn, formatCurrency } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';

import { ExecutiveCommentary } from '../ExecutiveCommentary';
import { ImportFinancialModal } from '../modals/ImportFinancialModal';
import { ManualFinancialModal } from '../modals/ManualFinancialModal';
import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
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

  // ── Busca dados anuais ──────────────────────────────────────────────────────
  const { dbData: dbDataBP, docIds: docIdsBP, loading: loadingBP, refetch: refetchBP } =
    useAnnualFinancialData(selectedClient, filterYear, 'Balanço Patrimonial');
  const { dbData: dbDataShort, docIds: docIdsShort, loading: loadingShort, refetch: refetchShort } =
    useAnnualFinancialData(selectedClient, filterYear, 'BP');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingBP || loadingShort;
  const dbData = dbDataBP.length > 0 ? dbDataBP : dbDataShort;
  const docIds = dbDataBP.length > 0 ? docIdsBP : docIdsShort;

  const rows = dbData.length > 0
    ? dbData.map((d: any) => ({ ...d, val: d.val ?? d.valor ?? 0 }))
    : [];

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
    const getSum = (search: string) => yearRows.find((r: any) => (r.category || r.conta || '').toLowerCase().includes(search.toLowerCase()))?.value ?? 0;
    
    // Tenta encontrar Ativo Total explicitamente ou soma Ativo Circulante + Não Circulante
    const ativoTotal = getSum('ativo total') || (getSum('ativo circulante') + getSum('ativo não circulante'));
    const passivoTotal = getSum('passivo total') || (getSum('passivo circulante') + getSum('passivo não circulante'));
    const pl = getSum('patrimônio líquido') || getSum('pl');
    
    return { ativoTotal, passivoTotal, pl };
  };

  const chartData = useMemo(() => {
    return [5, 4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const summary = getYearSummary(y);
      return {
        year: y.toString(),
        ativo: summary.ativoTotal,
        passivo: summary.passivoTotal,
        pl: summary.pl
      };
    }).filter(d => d.ativo > 0 || d.passivo > 0 || d.pl > 0);
  }, [historyByYear, filterYear]);

  // ── Divisão por Categorias ────────────────────────────────────────────────
  const isPL = (r: any) => {
    const t = (r.tipo || r.type || '').toLowerCase();
    const c = (r.conta || '').toLowerCase();
    return t === 'patrimônio líquido' || t === 'pl' || c.includes('patrimônio líquido') || c === 'pl';
  };

  const ativo = rows.filter((r: any) => (r.tipo || r.type || '').toLowerCase() === 'ativo');
  const passivo = rows.filter((r: any) => (r.tipo || r.type || '').toLowerCase() === 'passivo' && !isPL(r));
  const patrimonio = rows.filter((r: any) => isPL(r)).map(r => ({
    ...r,
    conta: r.conta.toLowerCase() === 'patrimônio líquido' ? 'Patrimônio' : r.conta
  }));

  const findAccountValue = (name: string) => {
    const search = name.toLowerCase();
    const match = rows.find((r: any) => {
      const conta = (r.conta || '').toLowerCase();
      const cleanConta = conta.replace(/^[0-9.]+\s*[-]\s*/, '').trim();
      return cleanConta === search || conta.includes(search);
    });
    return match?.val || 0;
  };

  const ac  = findAccountValue('ativo circulante');
  const pc  = findAccountValue('passivo circulante');
  const est = findAccountValue('estoques') || findAccountValue('estoque');
  const cx  = findAccountValue('caixa e equivalentes') || findAccountValue('caixa') || findAccountValue('bancos');
  const anc = findAccountValue('ativo não circulante');
  const pnc = findAccountValue('passivo não circulante');
  const ativoTotal = findAccountValue('ativo total') || (ac + anc);

  const liqCorrente = pc > 0 ? ac / pc : 0;
  const liqSeca     = pc > 0 ? (ac - est) / pc : 0;
  const liqImediata = pc > 0 ? cx / pc : 0;
  const liqGeral    = (pc + pnc) > 0 ? (ac + anc * 0.4) / (pc + pnc) : 0;

  const liquidityIndices = [
    { name: 'Liquidez Corrente',  val: liqCorrente,  desc: 'Capacidade de pagamento no curto prazo',              color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Liquidez Seca',      val: liqSeca,      desc: 'Capacidade de pagamento sem depender do estoque',     color: 'text-blue-600',    bg: 'bg-blue-50'    },
    { name: 'Liquidez Imediata',  val: liqImediata,  desc: 'Disponibilidade imediata para quitar obrigações',     color: 'text-amber-600',   bg: 'bg-amber-50'   },
    { name: 'Liquidez Geral',     val: liqGeral,     desc: 'Solvência de curto e longo prazo',                    color: 'text-purple-600',  bg: 'bg-purple-50'  },
  ];

  // ── Análise Horizontal e Vertical ───────────────────────────────────────────
  const getHistoricalValue = (y: number, accountName: string) => {
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
    return rows.map(row => {
      const val = row.val || 0;
      const prevVal = getHistoricalValue(filterYear - 1, row.conta);
      
      const av = ativoTotal > 0 ? (val / ativoTotal) * 100 : 0;
      const ah = prevVal > 0 ? ((val / prevVal) - 1) * 100 : 0;
      
      return {
        ...row,
        av,
        ah,
        prevVal
      };
    });
  }, [rows, filterYear, historyByYear, ativoTotal]);

  const majorChanges = useMemo(() => {
    return comparativeAnalysis
      .filter(a => Math.abs(a.ah) > 5 && a.val > 1000) // Relevância > 5% e > 1k
      .sort((a, b) => Math.abs(b.ah) - Math.abs(a.ah))
      .slice(0, 4);
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
      refetchShort();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };

  const actionButtons = (
    <div className="flex items-center gap-3">
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 items-center mr-2">
        <Calendar size={12} className="ml-2 text-slate-400" />
        <select
          onChange={(e) => setFilterYear(Number(e.target.value))}
          value={filterYear}
          className="bg-transparent px-3 py-1 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-700"
        >
          {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowManualModal(true)}
        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Plus size={14} /> Lançar Dados
      </button>

      <button
        onClick={() => setShowImportModal(true)}
        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Upload size={14} /> Importar
      </button>

      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Trash2 size={14} /> Excluir
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <PageHeader 
        title="Balanço Patrimonial" 
        subtitle="Análise da posição financeira e patrimonial."
        icon={BookOpen}
        color="bg-slate-900"
      />
      
      <div className="flex items-center gap-4 -mt-6 mb-8">
          <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-blue-600" />}
            <Database size={14} className={dbData.length > 0 ? 'text-emerald-500' : 'text-slate-300'} />
            <span className={cn('text-[10px] font-black uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-emerald-500' : 'text-slate-400')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>
      </div>

      {/* ── Indicadores Estratégicos (Liquidez, Estrutura e Endividamento) ── */}
      <div className="space-y-8 mb-10">
        {/* Liquidez */}
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-1">Índices de Liquidez</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liquidityIndices.map((idx, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {idx.name}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className={cn('text-2xl font-display font-bold', idx.color)}>
                    {idx.val.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Índice
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-medium mt-2 leading-tight">{idx.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estrutura e Endividamento */}
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-1">Estrutura de Capital & Endividamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: 'Endividamento Geral', 
                val: ((pc + pnc) / (ativoTotal || 1)) * 100, 
                unit: '%', 
                desc: 'Percentual do Ativo Total financiado por capital de terceiros.',
                color: 'text-slate-900'
              },
              { 
                name: 'Capitais de Terceiros / PL', 
                val: ((pc + pnc) / (patrimonio.reduce((acc, r) => acc + (r.val || 0), 0) || 1)) * 100, 
                unit: '%', 
                desc: 'Relação entre Capital de Terceiros e Capital Próprio.',
                color: 'text-slate-900'
              },
              { 
                name: 'Composição do Endivid.', 
                val: (pc / ((pc + pnc) || 1)) * 100, 
                unit: '%', 
                desc: 'Perfil da dívida: percentual vencível no curto prazo.',
                color: 'text-blue-600'
              },
              { 
                name: 'Imobilização do PL', 
                val: (anc / (patrimonio.reduce((acc, r) => acc + (r.val || 0), 0) || 1)) * 100, 
                unit: '%', 
                desc: 'Indica quanto do PL está aplicado no Ativo Não Circulante.',
                color: 'text-purple-600'
              },
            ].map((idx, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {idx.name}
                </h4>
                <div className="flex items-baseline gap-1">
                  <span className={cn('text-2xl font-display font-bold', idx.color)}>
                    {idx.val.toFixed(1)}
                  </span>
                  <span className="text-sm font-black text-slate-300">{idx.unit}</span>
                </div>
                <p className="text-[9px] text-slate-500 font-medium mt-2 leading-tight">{idx.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Análise de Evolução e Gráficos ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Evolução Patrimonial</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Comparativo de 5 Anos</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Ativo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Passivo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">PL</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/50">{payload[0].payload.year}</p>
                          <div className="space-y-1.5">
                            {payload.map((p: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-8">
                                <span className="text-[10px] font-bold text-white/70 uppercase">{p.name}</span>
                                <span className="text-xs font-black">{formatCurrency(p.value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="ativo" name="Ativo" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passivo" name="Passivo" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pl" name="PL" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
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
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{change.conta}</p>
                  <p className="text-sm font-bold">{formatCurrency(change.val)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-[10px] font-black", change.ah > 0 ? "text-emerald-400" : "text-rose-400")}>
                      {change.ah > 0 ? '+' : ''}{change.ah.toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-white/30 font-medium">vs ano anterior</span>
                  </div>
                </div>
              </div>
            ))}
            {majorChanges.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center">
                <Info size={32} className="mb-2" />
                <p className="text-xs font-bold">Sem variações bruscas detectadas</p>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-slate-900">Análise Horizontal e Vertical</h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-slate-200" />
               <span className="text-[10px] font-bold text-slate-400 uppercase">AV: Análise Vertical</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-slate-200" />
               <span className="text-[10px] font-bold text-slate-400 uppercase">AH: Análise Horizontal</span>
             </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-200" />
            </div>
            <p className="text-sm font-bold text-slate-400">Nenhum dado encontrado</p>
            <p className="text-xs text-slate-300 mt-1">
              Importe ou insira manualmente os dados para o ano {filterYear}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Seções de Tabelas */}
            {[
              { title: 'Ativo', data: comparativeAnalysis.filter(r => (r.tipo || r.type || '').toLowerCase() === 'ativo'), color: 'emerald' },
              { title: 'Passivo', data: comparativeAnalysis.filter(r => (r.tipo || r.type || '').toLowerCase() === 'passivo' && !isPL(r)), color: 'blue' },
              { title: 'Patrimônio Líquido', data: comparativeAnalysis.filter(r => isPL(r)), color: 'purple' }
            ].map((section, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
                <div className={cn("px-8 py-5 border-b border-slate-100 flex items-center justify-between", `bg-${section.color}-50/30`)}>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{section.title}</h4>
                  <span className={cn("text-[9px] font-black uppercase px-3 py-1 rounded-full", `bg-${section.color}-50 text-${section.color}-600`)}>
                    Detalhamento Estrutural
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="text-left py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conta</th>
                        <th className="text-right py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo Atual (R$)</th>
                        <th className="text-right py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AV (%)</th>
                        <th className="text-right py-4 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AH (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {section.data.map((row: any, i: number) => (
                        <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', row.level === 1 ? 'bg-slate-50/10 font-bold' : '')}>
                          <td className="py-4 px-8">
                            <span className={cn('block truncate max-w-[250px]', row.level === 1 ? 'text-primary' : 'pl-4 text-slate-600 font-medium')}>
                              {row.conta === 'Patrimônio Líquido' ? 'Patrimônio' : row.conta}
                            </span>
                          </td>
                          <td className="py-4 px-8 text-right font-mono text-slate-700">
                            {formatCurrency(row.val)}
                          </td>
                          <td className="py-4 px-8 text-right font-bold text-slate-500 text-xs">
                            {row.av.toFixed(1)}%
                          </td>
                          <td className={cn(
                            "py-4 px-8 text-right font-black text-xs",
                            row.ah > 0 ? "text-emerald-500" : row.ah < 0 ? "text-rose-500" : "text-slate-300"
                          )}>
                            {row.ah !== 0 ? (
                              <div className="flex items-center justify-end gap-1">
                                {row.ah > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {Math.abs(row.ah).toFixed(1)}%
                              </div>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            refetchShort();
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
            refetchShort();
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
          'fixed bottom-8 right-8 px-8 py-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 transition-all',
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          <p className="text-xs font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
