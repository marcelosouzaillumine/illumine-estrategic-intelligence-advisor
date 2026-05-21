import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Loader2, Upload, Trash2, Plus, FileText, Database, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
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
import { cn, formatCurrency, formatValue } from '../../lib/utils';
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

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
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
  const { dbData: dbDataDLPA, docIds: docIdsDLPA, loading: loadingDLPA, refetch: refetchDLPA } =
    useAnnualFinancialData(selectedClient, filterYear, 'DLPA');

  // ── Busca histórico (todos os dados do cliente) ──────────────────────────────
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient);

  const loading = loadingDLPA;
  const dbData = dbDataDLPA;
  const docIds = docIdsDLPA;

  const rows = useMemo(() => {
    return dbData;
  }, [dbData]);

  const getValue = (source: any[], name: string) => {
    const search = name.toLowerCase();
    return source.find(s => (s.conta || s.category || '').toLowerCase().includes(search))?.val || 0;
  };

  const ll = getValue(rows, 'Lucro Líquido');
  const div = Math.abs(getValue(rows, 'Dividendos'));
  const res = Math.abs(getValue(rows, 'Reservas'));
  const final = getValue(rows, 'Saldo Final');

  const dlpaIndices = [
    { name: 'Lucro do Exercício', val: ll, unit: 'R$', desc: 'Resultado líquido apurado no período', color: 'text-emerald-600' },
    { name: 'Dividendos/JCP', val: div, unit: 'R$', desc: 'Parcela destinada aos acionistas/sócios', color: 'text-blue-600' },
    { name: 'Retenção de Lucros', val: final, unit: 'R$', desc: 'Saldo que permanece no patrimônio', color: 'text-purple-600' },
    { name: 'Payout Ratio', val: ll > 0 ? (div / ll) * 100 : 0, unit: '%', desc: 'Percentual do lucro distribuído', color: 'text-slate-900' },
  ];

  // ── Histórico para Gráfico ────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return [5, 4, 3, 2, 1, 0].map(offset => {
      const y = filterYear - offset;
      const yearEntries = allHistoryData.filter((d: any) => d.year === y && (d.type === 'DLPA' || d.type === 'DRE'));
      
      let lucro = 0; let dividendos = 0;

      if (yearEntries.length > 0) {
        lucro = yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('lucro líquido')).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
        dividendos = Math.abs(yearEntries.filter(d => (d.conta || d.category || '').toLowerCase().includes('dividendos')).reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0));
      } else {
        lucro = 0; dividendos = 0;
      }

      return {
        year: y.toString(),
        lucro,
        dividendos
      };
    }).filter(d => d.lucro !== 0 || d.dividendos !== 0);
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
        where('type',     '==', 'DLPA'),
        where('year',     '==', filterYear)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
      showToast('success', `${snap.docs.length} registro(s) excluído(s) com sucesso.`);
      refetchDLPA();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };

  const actionButtons = (
    <div className="flex items-center gap-3">
      <div className="flex bg-card p-1 rounded-md border border-border items-center mr-2 shadow-sm">
        <Calendar size={12} className="ml-2 text-secondary" />
        <select
          onChange={(e) => setFilterYear(Number(e.target.value))}
          value={filterYear}
          className="bg-transparent px-3 py-1 text-[10px] font-medium uppercase tracking-widest outline-none cursor-pointer text-foreground appearance-none pr-1"
        >
          {Array.from({ length: 21 }, (_, i) => 2010 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowManualModal(true)}
        className="px-4 py-2 bg-success/10 hover:bg-success text-success hover:text-white border border-success/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Plus size={14} /> Lançar Dados
      </button>

      <button
        onClick={() => setShowImportModal(true)}
        className="px-4 py-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Upload size={14} /> Importar
      </button>

      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="px-4 py-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
      >
        <Trash2 size={14} /> Excluir
      </button>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Demonstração de Lucros ou Prejuízos Acumulados Contábil (DLPA)" 
        subtitle="Análise das variações no patrimônio líquido originadas de lucros."
        icon={FileText}
        color="executive"
      />
      
      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-3">
            {(loading || loadingHistory) && <Loader2 size={14} className="animate-spin text-secondary" />}
            <Database size={14} className={dbData.length > 0 ? 'text-success' : 'text-muted-foreground/30'} />
            <span className={cn('text-[10px] font-medium uppercase tracking-[0.2em]', dbData.length > 0 ? 'text-success' : 'text-muted-foreground/40')}>
              {dbData.length > 0 ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actionButtons}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {dlpaIndices.map((idx, i) => (
          <KpiCard 
            key={i}
            title={idx.name}
            value={formatValue(idx.val, '')}
            suffix={idx.unit === '%' ? '%' : 'R$'}
            icon={FileText}
            status={idx.val >= 0 ? 'Verde' : 'Vermelho'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Evolução da Distribuição</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Lucro Líquido vs Dividendos</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Lucro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Dividendos</span>
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
                <Bar dataKey="lucro" name="Lucro" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dividendos" name="Dividendos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h3 className="text-lg font-black mb-1">Destaques</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Políticas de Reservas</p>
          
          <div className="space-y-6 flex-1">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reservas Constituídas</p>
                <p className="text-sm font-bold">{formatCurrency(res)}</p>
                <p className="text-[9px] text-white/30 font-medium mt-1 italic">Retenção legal e estatutária</p>
             </div>
             
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Saldo para Próximo Ciclo</p>
                <p className="text-sm font-bold">{formatCurrency(final)}</p>
                <p className="text-[9px] text-white/30 font-medium mt-1 italic">Acumulado disponível</p>
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
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detalhamento da DLPA</h4>
          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
            Composição de Lucros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição da Conta</th>
                <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row: any, i: number) => (
                <tr key={i} className={cn('hover:bg-slate-50 transition-colors group', row.isTotal ? 'bg-slate-50/10 font-bold' : '')}>
                  <td className="py-2.5 md:py-4 px-5 md:px-8">
                    <span className={cn('block overflow-visible break-words', row.isTotal ? 'text-secondary' : 'pl-4 text-muted-foreground font-medium')}>
                      {row.conta || row.category}
                    </span>
                  </td>
                  <td className={cn("py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", (row.val || 0) < 0 ? "text-rose-500" : "text-slate-700")}>
                    {formatCurrency(row.val || row.valor || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExecutiveCommentary
        reportType="DLPA"
        clientId={selectedClient}
        year={filterYear}
        month={1}
      />

      {showImportModal && (
        <ImportFinancialModal
          type="DLPA"
          clientId={selectedClient}
          year={filterYear}
          clients={clients}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            refetchDLPA();
            showToast('success', 'Dados importados com sucesso!');
          }}
        />
      )}

      {showManualModal && (
        <ManualFinancialModal
          type="DLPA"
          clientId={selectedClient}
          year={filterYear}
          onClose={() => setShowManualModal(false)}
          onSuccess={() => {
            setShowManualModal(false);
            refetchDLPA();
            showToast('success', 'Dados salvos com sucesso!');
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Excluir Dados?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">
              Esta ação removerá todos os registros da DLPA para o ano <strong>{filterYear}</strong> deste cliente. Esta ação não pode ser desfeita.
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

