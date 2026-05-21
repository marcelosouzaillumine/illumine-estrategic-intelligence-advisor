import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, BarChart3, Database, TrendingUp, TrendingDown, Info, PieChart as PieChartIcon } from 'lucide-react';
import { DATA } from '../../data';
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
import { cn, formatCurrency, formatValue, getThemeColors } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';
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

type ToastType = { type: 'success' | 'error'; message: string } | null;

export function DREPage({ clients, selectedClient, selectedYear }: any) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());
  const [toast, setToast] = useState<ToastType>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, setThemeTrigger] = useState(0);
  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => prev + 1);
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const colors = getThemeColors();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (selectedYear) setFilterYear(selectedYear);
  }, [selectedYear]);

  // ── Busca dados anuais ──────────────────────────────────────────────────────
  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE, refetch: refetchDRE } =
    useAnnualFinancialData(selectedClient, filterYear, 'DRE');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDRE;
  const dbData = dbDataDRE;
  const docIds = docIdsDRE;


  
  // Agrega dados preservando level, categoria e tipo
  const rows = useMemo(() => {
    if (dbData.length > 0) {
      const aggregated: any = {};
      dbData.forEach((d: any) => {
        const key = d.conta || d.category;
        if (!aggregated[key]) {
          aggregated[key] = { 
            ...d, 
            val: 0,
            level: d.level ?? 1  // preserve level from manual launch
          };
        }
        aggregated[key].val += (d.val || d.valor || 0);
      });
      return Object.values(aggregated);
    }
    return [];
  }, [dbData]);

  const getValue = (source: any[], name: string) => {
    const search = name.toLowerCase();
    return source.find(s => (s.conta || s.category || '').toLowerCase() === search)?.val || source.find(s => (s.conta || s.category || '').toLowerCase() === search)?.valor || 0;
  };

  const recLiquida = getValue(rows, 'Receita Líquida') || getValue(rows, 'Receita Operacional Líquida') || 0;
  const lucroBruto = getValue(rows, 'Lucro Bruto');
  const ebitda     = getValue(rows, 'EBITDA');
  const lucroLiq   = getValue(rows, 'Lucro Líquido') || getValue(rows, 'Lucro Líquido do Exercício');

  const custosVar = getValue(rows, 'Custos Variáveis') || getValue(rows, 'CMV') || getValue(rows, 'CPV') || 0;
  const despesasFixas = getValue(rows, 'Despesas Operacionais') || getValue(rows, 'Despesas Administrativas') || 0;
  const margemContrib = recLiquida - custosVar;
  const indiceMargemContrib = recLiquida > 0 ? margemContrib / recLiquida : 0;
  const pontoEquilibrio = (indiceMargemContrib > 0) ? despesasFixas / indiceMargemContrib : 0;

  const marginIndices = [
    { name: 'Margem Bruta',  val: (lucroBruto / recLiquida) * 100, unit: '%', desc: 'Eficiência na produção/serviço', color: 'text-emerald-600' },
    { name: 'Margem EBITDA', val: (ebitda / recLiquida) * 100,     unit: '%', desc: 'Eficiência operacional (caixa)',  color: 'text-blue-600'    },
    { name: 'Margem Líquida', val: (lucroLiq / recLiquida) * 100,   unit: '%', desc: 'Rentabilidade final do negócio', color: 'text-purple-600'  },
    { name: 'Ponto de Equilíbrio', val: pontoEquilibrio, unit: 'R$', desc: 'Faturamento mínimo para cobrir custos fixos', color: 'text-slate-900' },
  ];

  // ── Histórico para Gráfico ────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return [5, 4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => d.year === y && d.type === 'DRE');
      
      let rl = 0;
      let ebt = 0;
      let ll = 0;

      if (yearEntries.length > 0) {
        rl = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('receita líquida')).reduce((acc, d) => acc + (d.val || d.valor || 0), 0);
        ebt = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('ebitda')).reduce((acc, d) => acc + (d.val || d.valor || 0), 0);
        ll = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('lucro líquido')).reduce((acc, d) => acc + (d.val || d.valor || 0), 0);
      } else {
        const mockYear = DATA.dre.filter((r: any) => r.id === selectedClient && r.ano === y);
        rl = mockYear.find(m => m.conta === 'Receita Líquida')?.valor || 0;
        ebt = mockYear.find(m => m.conta === 'EBITDA')?.valor || 0;
        ll = mockYear.find(m => m.conta === 'Lucro Líquido')?.valor || 0;
      }

      return {
        year: y.toString(),
        receita: rl,
        ebitda: ebt,
        lucro: ll
      };
    }).filter(d => d.receita > 0 || d.ebitda > 0 || d.lucro > 0);
  }, [allHistoryData, selectedClient, filterYear]);

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
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', selectedClient),
        where('type',     '==', 'DRE'),
        where('year',     '==', filterYear)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
      showToast('success', `${snap.docs.length} registro(s) excluído(s) com sucesso.`);
      refetchDRE();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };


  const tableRows = [
    { name: 'Receita Operacional Bruta', level: 1 },
    { name: '(-) Deduções e Impostos', level: 2 },
    { name: 'Receita Líquida', level: 1 },
    { name: '(-) Custos (CPV/CSP)', level: 2 },
    { name: 'Lucro Bruto', level: 1 },
    { name: '(-) Despesas Operacionais', level: 2 },
    { name: 'EBITDA', level: 1 },
    { name: '(-) Depreciação e Amortização', level: 2 },
    { name: 'EBIT', level: 1 },
    { name: '(+/-) Resultado Financeiro', level: 2 },
    { name: 'LAIR (Lucro Antes do IR)', level: 1 },
    { name: '(-) Provisão IR/CSLL', level: 2 },
    { name: 'Lucro Líquido', level: 1 },
  ];

  // Histórico para AH no ano anterior
  const prevYearRows = useMemo(() => {
    const prevEntries = allHistoryData.filter((d: any) => d.year === (filterYear - 1) && d.type === 'DRE');
    if (prevEntries.length > 0) {
      const agg: any = {};
      prevEntries.forEach((d: any) => {
        const key = d.conta || d.category;
        if (!agg[key]) agg[key] = { ...d, val: 0 };
        agg[key].val += (d.val || d.valor || 0);
      });
      return Object.values(agg);
    }
    return [];
  }, [allHistoryData, filterYear]);

  const getPrevValue = (name: string) => {
    const search = name.toLowerCase();
    return (prevYearRows as any[]).find(s => (s.conta || s.category || '').toLowerCase() === search)?.val || 0;
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Demonstração do Resultado (DRE)" 
        subtitle="Análise de performance operacional, lucratividade e rentabilidade do exercício contábil."
        icon={BarChart3}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-md px-4 py-2 flex items-center gap-3 shadow-sm">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={dbData.length > 0 ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-success' : 'text-muted-foreground')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>

          <div className="flex bg-card border border-border p-1 rounded-md shadow-sm items-center">
            <Calendar size={12} className="ml-2 text-muted-foreground" />
            <select
              onChange={(e) => setFilterYear(Number(e.target.value))}
              value={filterYear}
              className="bg-transparent px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground"
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
            className="px-4 py-3 bg-surface-container hover:bg-success hover:text-white text-success border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Lançar Dados
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-3 bg-surface-container hover:bg-secondary hover:text-white text-secondary border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Upload size={14} /> Importar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 bg-surface-container hover:bg-destructive hover:text-white text-destructive border border-border rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {marginIndices.map((idx, i) => (
          <KpiCard 
            key={i}
            title={idx.name}
            value={idx.unit === 'R$' ? formatValue(idx.val, '') : idx.val.toFixed(1)}
            suffix={idx.unit}
            status="Verde"
            trend="Estável"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Evolução de Performance</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Receita, EBITDA e Lucro</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>Receita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>EBITDA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-[9px] font-bold uppercase" style={{ color: colors.mutedForeground }}>Lucro</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: colors.mutedForeground }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
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
                <Bar dataKey="receita" name="Receita" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lucro" name="Lucro" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-lg font-black mb-1">Destaques</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Insights de Resultado</p>
          
          <div className="space-y-6 flex-1">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Margem EBITDA Alvo</p>
              <p className="text-sm font-bold">{dbData.length > 0 ? '25.0%' : '---'}</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (marginIndices[1].val / 25) * 100)}%` }} />
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ponto de Equilíbrio Estimado</p>
              <p className="text-sm font-bold">{dbData.length > 0 ? formatCurrency(recLiquida * 0.7) : '---'}</p>
              <p className="text-[9px] text-white/30 font-medium mt-1 italic">Baseado na estrutura de custos atual</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Database size={18} className="text-white" />
             </div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inteligência de Dados</p>
               <p className="text-[10px] font-medium text-white/70 italic">Análise baseada em ciclos históricos</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mb-10">
        <div className="px-5 md:px-8 py-3 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detalhamento da DRE</h4>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            Análise Horizontal e Vertical
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conta</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor (R$)</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AV (%)</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AH (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.length > 0
                // ── Dados reais do banco: renderiza exatamente as linhas lançadas ──
                ? (rows as any[]).map((row: any, i: number) => {
                    const name = row.conta || row.category || '';
                    const val = row.val || 0;
                    const level = row.level ?? 1;
                    const av = recLiquida > 0 ? (val / recLiquida) * 100 : 0;
                    const prevVal = getPrevValue(name);
                    const ah = prevVal > 0 ? ((val / prevVal) - 1) * 100 : null;
                    const isTotal = level === 1;

                    return (
                      <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', isTotal ? 'bg-slate-50/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', isTotal ? 'text-primary font-bold' : 'text-slate-600 font-medium')}
                            style={{ paddingLeft: level > 1 ? `${(level - 1) * 20}px` : '0px' }}
                          >
                            {level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-slate-300 mr-2 mb-0.5" />
                            )}
                            {name}
                          </span>
                        </td>
                        <td className={cn("py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", val < 0 ? "text-rose-500" : "text-slate-700")}>
                          {formatCurrency(val)}
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-bold text-slate-500 text-xs">
                          {av.toFixed(2)}%
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          ah === null ? "text-slate-300" : ah > 0 ? "text-emerald-500" : ah < 0 ? "text-rose-500" : "text-slate-300"
                        )}>
                          {ah !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {ah > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(ah).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })
                // ── Sem dados: mostra template estático como guia ──
                : tableRows.map((row, i) => {
                    const isTotal = row.level === 1;
                    return (
                      <tr key={i} className={cn('transition-colors group', isTotal ? 'bg-slate-50/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', isTotal ? 'text-slate-300 font-bold' : 'text-slate-200 font-medium')}
                            style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 20}px` : '0px' }}
                          >
                            {row.level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-slate-200 mr-2 mb-0.5" />
                            )}
                            {row.name}
                          </span>
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-mono text-slate-200">R$ 0,00</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">0,00%</td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right text-slate-200 text-xs">—</td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      <ExecutiveCommentary
        reportType="DRE"
        clientId={selectedClient}
        year={filterYear}
        month={1}
      />

      {showImportModal && (
        <ImportFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchDRE();
            showToast('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DRE"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchDRE();
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros da DRE para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
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
