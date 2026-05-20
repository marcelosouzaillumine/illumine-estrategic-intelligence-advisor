
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Loader2, 
  X, 
  TrendingUp, 
  PieChart as PieChartIcon,
  Save,
  UploadCloud
} from 'lucide-react';
import { ImportTransactionsModal } from '../modals/ImportTransactionsModal';
import { motion } from 'motion/react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { PageHeader } from '../Common';
import { SortableHeader } from '../SortableHeader';
import { DATA } from '../../data';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import { useDataTable } from '../../hooks/useDataTable';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

function KpiCardModeling({ label, value, tone = 'default', helper }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 group-hover:text-slate-500 transition-colors">{label}</p>
      <h3 className={cn(
        "text-2xl font-black tracking-tight",
        tone === 'danger' ? "text-rose-600" : tone === 'success' ? "text-emerald-600" : "text-slate-900"
      )}>{value}</h3>
      {helper && <p className="text-[10px] text-slate-400 mt-2 font-medium italic opacity-80">{helper}</p>}
    </div>
  );
}

export function ReceivablesPage({ clients, selectedClient, isMaster }: { clients: any[], selectedClient: string, isMaster?: boolean }) {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState<any | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const tableData = useMemo(() => 
    receivables.filter(p => !p.cliente?.toLowerCase().includes('total')), 
    [receivables]
  );

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sort,
    toggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: filteredReceivables,
    paginatedData: paginatedReceivables
  } = useDataTable(tableData, {
    searchFields: ['cliente', 'documento', 'categoria', 'centroCusto'],
    initialSort: { key: 'vencimento', direction: 'asc' as const },
    itemsPerPage: 10
  });

  useEffect(() => {
    if (!selectedClient) {
      setReceivables([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'receivables'),
      where('clientId', '==', selectedClient)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter(d => d.status !== 'pending' && d.status !== 'rejected');
      setReceivables(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching receivables:", error);
      setReceivables([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  const handleSave = async (data: any) => {
    try {
      const payload = {
        ...data,
        clientId: selectedClient,
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid
      };

      if (editingReceivable?.id) {
        await updateDoc(doc(db, 'receivables', editingReceivable.id), payload);
      } else {
        await addDoc(collection(db, 'receivables'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingReceivable(null);
    } catch (e: any) {
      console.error(e);
      if (editingReceivable) {
        setReceivables(prev => prev.map(p => p.id === editingReceivable.id ? { ...p, ...data } : p));
      } else {
        setReceivables(prev => [...prev, { ...data, id: Math.random().toString() }]);
      }
      setIsModalOpen(false);
      setEditingReceivable(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este título?')) return;
    try {
      if (id.length > 10) { 
        await deleteDoc(doc(db, 'receivables', id));
      } else {
        setReceivables(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
      setReceivables(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDeleteAll = async () => {
    if (!selectedClient) return;
    if (!window.confirm(`Tem certeza que deseja excluir TODOS os ${receivables.length} títulos de Contas a Receber deste cliente? Essa ação é irreversível.`)) return;
    
    setIsDeletingAll(true);
    try {
      const q = query(collection(db, 'receivables'), where('clientId', '==', selectedClient));
      const snap = await getDocs(q);
      const docs = snap.docs;
      const chunkSize = 450;
      for (let i = 0; i < docs.length; i += chunkSize) {
        const batch = writeBatch(db);
        docs.slice(i, i + chunkSize).forEach(d => batch.delete(d.ref));
        await batch.commit();
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir títulos.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  const abcData = useMemo(() => {
    const grouped = receivables.reduce((acc: any, curr) => {
      acc[curr.cliente] = (acc[curr.cliente] || 0) + curr.valor;
      return acc;
    }, {});
    
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [receivables]);

  const weeklyFlow = useMemo(() => {
    const weeks: any = {};
    receivables.forEach(p => {
      const date = new Date(p.vencimento);
      const week = `S${Math.ceil(date.getDate() / 7)}`;
      weeks[week] = (weeks[week] || 0) + p.valor;
    });
    return Object.entries(weeks).map(([name, valor]) => ({ name, valor }));
  }, [receivables]);

  const kpis = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const date30Days = new Date();
    date30Days.setDate(today.getDate() + 30);
    const date30DaysStr = date30Days.toISOString().split('T')[0];
    
    return receivables.reduce((acc, p) => {
      const valor = Number(p.valor) || 0;
      const valorAberto = Number(p.valorAberto ?? (p.status === 'Pago' ? 0 : valor)) || 0;
      acc.total += valor;
      
      let status = p.status || '';
      
      // Se não for pago, validamos se está em atraso pela data
      if (status !== 'Pago') {
        if (p.vencimento && p.vencimento < todayStr) {
          status = 'Em atraso';
        } else {
          status = 'A vencer';
        }
      }

      if (status === 'Pago') {
        acc.pago += valor;
      } else if (status === 'Em atraso') {
        acc.emAtraso += valorAberto;
      } else {
        // Status 'A vencer' - dividimos por data
        if (p.vencimento && p.vencimento <= date30DaysStr) {
          acc.aReceber30 += valorAberto;
        } else {
          acc.aReceberApos30 += valorAberto;
        }
      }
      
      return acc;
    }, { total: 0, emAtraso: 0, aReceber30: 0, aReceberApos30: 0, pago: 0 });
  }, [receivables]);

  const clientName = clients.find(c => c.id === selectedClient)?.fantasia || 'Cliente';

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Contas a Receber" 
        subtitle={`Gestão centralizada de recebimentos e fluxo de disponibilidade · ${clientName}`}
        icon={<UploadCloud size={24} />}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6">
        <div className="flex items-center gap-3">
          {receivables.length > 0 && selectedClient && (
            <button 
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
              className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-rose-400 hover:text-rose-600 hover:bg-white flex items-center gap-2"
            >
              {isDeletingAll ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              LIMPAR BASE
            </button>
          )}
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-slate-600 hover:bg-white flex items-center gap-2"
          >
            <UploadCloud size={14} /> IMPORTAR
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingReceivable(null); setIsModalOpen(true); }}
            className="px-5 md:px-8 py-2 md:py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2"
          >
            <Plus size={16} /> LANÇAR TÍTULO
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCardModeling label="Total a Receber" value={formatCurrency(kpis.aReceber30 + kpis.aReceberApos30 + kpis.emAtraso)} tone="default" />
        <KpiCardModeling label="Em Atraso" value={formatCurrency(kpis.emAtraso)} tone="danger" helper="Títulos com vencimento ultrapassado" />
        <KpiCardModeling label="A Receber (30 dias)" value={formatCurrency(kpis.aReceber30)} tone="default" />
        <KpiCardModeling label="Recebem após 30 dias" value={formatCurrency(kpis.aReceberApos30)} tone="default" />
        <KpiCardModeling label="Total Recebido" value={formatCurrency(kpis.pago)} tone="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-sm font-bold text-slate-800">Curva ABC de Clientes</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Concentração de Receitas</p>
             </div>
             <div className="p-2 bg-slate-50 rounded-xl">
               <PieChartIcon size={18} className="text-secondary" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={abcData} margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Bar dataKey="value" fill="#0e1c2c" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h3 className="text-sm font-bold text-slate-800">Fluxo de Recebimentos</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Projeção por Semana (Mês Atual)</p>
             </div>
             <div className="p-2 bg-emerald-50 rounded-xl">
               <TrendingUp size={18} className="text-emerald-500" />
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyFlow}>
                <defs>
                  <linearGradient id="colorValRec2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={v => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValRec2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar cliente ou documento..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select 
              value={filters.status || 'Todos'}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="w-full md:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none"
            >
              <option value="Todos">Todos os Status</option>
              <option value="A vencer">A vencer</option>
              <option value="Em atraso">Em atraso</option>
              <option value="Pago">Pago</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <SortableHeader label="Cliente" sortKey="cliente" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Categoria" sortKey="categoria" currentSort={sort} onSort={toggleSort} />
                <SortableHeader label="Documento" sortKey="documento" currentSort={sort} onSort={toggleSort} align="center" />
                <SortableHeader label="Emissão" sortKey="emissao" currentSort={sort} onSort={toggleSort} align="center" />
                <SortableHeader label="Vencimento" sortKey="vencimento" currentSort={sort} onSort={toggleSort} align="center" />
                <SortableHeader label="Valor" sortKey="valor" currentSort={sort} onSort={toggleSort} align="right" />
                <SortableHeader label="Status" sortKey="status" currentSort={sort} onSort={toggleSort} align="center" />
                <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={7} className="px-8 py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Carregando títulos...</p>
                  </td>
                </tr>
              ) : paginatedReceivables.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic">
                    Nenhum título encontrado.
                  </td>
                </tr>
              ) : (
                paginatedReceivables.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 md:px-8 py-2.5 md:py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{item.cliente}</span>
                        {item.centroCusto && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50 self-start mt-1">{item.centroCusto}</span>}
                      </div>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4">
                      {item.categoria ? (
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
                          {item.categoria}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic">Sem categoria</span>
                      )}
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-center">
                      <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50">{item.documento}</span>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-center text-xs text-slate-500 font-bold">{formatDate(item.emissao)}</td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs font-black text-slate-700">{formatDate(item.vencimento)}</span>
                        {item.status === 'Em atraso' && <span className="text-[8px] text-rose-500 font-black uppercase tracking-tighter animate-pulse">Vencido</span>}
                      </div>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-primary">{formatCurrency(item.valor)}</span>
                        {item.valorAberto !== undefined && item.valorAberto !== item.valor && item.status !== 'Pago' && (
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Aberto: {formatCurrency(item.valorAberto)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-center">
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter",
                        item.status === 'Pago' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        item.status === 'Em atraso' ? "bg-rose-50 text-rose-600 border border-rose-100" :
                        "bg-blue-50 text-blue-600 border border-blue-100"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingReceivable(item); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ReceivableModal 
          receivable={editingReceivable}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {isImportModalOpen && (
        <ImportTransactionsModal
          collectionName="receivables"
          selectedClient={selectedClient}
          clients={clients}
          isMaster={isMaster}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => setIsImportModalOpen(false)}
        />
      )}
    </div>
  );
}

function ReceivableModal({ receivable, onClose, onSave }: any) {
  const [formData, setFormData] = useState(receivable || {
    cliente: '',
    documento: '',
    emissao: new Date().toISOString().split('T')[0],
    vencimento: '',
    valor: 0,
    valorAberto: 0,
    status: 'A vencer',
    categoria: '',
    centroCusto: ''
  });

  const [touched, setTouched] = useState<any>({});
  
  const validate = () => {
    const errors: any = {};
    if (!formData.cliente) errors.cliente = 'Obrigatório';
    if (!formData.documento) errors.documento = 'Obrigatório';
    if (!formData.vencimento) errors.vencimento = 'Obrigatório';
    if (formData.valor <= 0) errors.valor = 'Valor inválido';
    return errors;
  };

  const errors = validate();

  const handleSave = () => {
    setTouched({ cliente: true, documento: true, vencimento: true, valor: true });
    if (Object.keys(errors).length === 0) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{receivable ? 'Editar Título' : 'Lançar Título'}</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Registro de Contas a Receber</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Cliente / Devedor</label>
            <input 
              type="text" 
              placeholder="Ex: Convênio Estrela"
              value={formData.cliente}
              onChange={e => setFormData({ ...formData, cliente: e.target.value })}
              className={cn(
                "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                touched.cliente && errors.cliente ? "border-red-500" : "border-slate-100 focus:bg-white focus:ring-2 focus:ring-secondary/10"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nº Documento</label>
              <input 
                type="text" 
                placeholder="Ex: FAT-2026"
                value={formData.documento}
                onChange={e => setFormData({ ...formData, documento: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.documento && errors.documento ? "border-red-500" : "border-slate-100 focus:bg-white"
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Valor do Título</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400 uppercase">R$</span>
                <input 
                  type="number" 
                  value={formData.valor}
                  onChange={e => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                  className={cn(
                    "w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                    touched.valor && errors.valor ? "border-red-500" : "border-slate-100 focus:bg-white"
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Valor em Aberto</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400 uppercase">R$</span>
              <input 
                type="number" 
                value={formData.valorAberto ?? formData.valor}
                onChange={e => setFormData({ ...formData, valorAberto: parseFloat(e.target.value) || 0 })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Categoria / Receita</label>
              <input 
                type="text" 
                placeholder="Ex: Consultas Particulares"
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Centro de Custo / Unidade</label>
              <input 
                type="text" 
                placeholder="Ex: Unidade Centro"
                value={formData.centroCusto}
                onChange={e => setFormData({ ...formData, centroCusto: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Data Emissão</label>
              <input 
                type="date" 
                value={formData.emissao}
                onChange={e => setFormData({ ...formData, emissao: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Data Vencimento</label>
              <input 
                type="date" 
                value={formData.vencimento}
                onChange={e => setFormData({ ...formData, vencimento: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.vencimento && errors.vencimento ? "border-red-500" : "border-slate-100 focus:bg-white"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status do Recebimento</label>
            <div className="flex gap-3">
              {['A vencer', 'Em atraso', 'Pago'].map(s => (
                <button
                  key={s}
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    formData.status === s 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all">Cancelar</button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Salvar Título
          </button>
        </div>
      </motion.div>
    </div>
  );
}
