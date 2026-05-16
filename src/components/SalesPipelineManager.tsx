import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Filter, 
  Download, 
  Search, 
  ChevronDown, 
  Building2, 
  Users2, 
  MapPin,
  CheckCircle2,
  X,
  Loader2,
  TrendingUp,
  Target,
  DollarSign
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatValue } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SalesPipelineEntry {
  id: string;
  clientId: string;
  vendedor: string;
  unidade: string;
  filial: string;
  etapa: string;
  valor: number;
  data: any;
  customerName: string;
}

interface SalesPipelineManagerProps {
  clientId: string;
}

const ETAPAS = [
  'Prospecção',
  'Qualificação',
  'Proposta',
  'Negociação',
  'Fechamento'
];

export function SalesPipelineManager({ clientId }: SalesPipelineManagerProps) {
  const [entries, setEntries] = useState<SalesPipelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [filterVendedor, setFilterVendedor] = useState('Todos');
  const [filterUnidade, setFilterUnidade] = useState('Todas');
  const [filterFilial, setFilterFilial] = useState('Todas');

  const [formData, setFormData] = useState({
    vendedor: '',
    unidade: '',
    filial: '',
    etapa: 'Prospecção',
    valor: '',
    customerName: ''
  });

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'sales_pipeline'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as SalesPipelineEntry));
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const uniqueVendedores = useMemo(() => ['Todos', ...new Set(entries.map(e => e.vendedor))], [entries]);
  const uniqueUnidades = useMemo(() => ['Todas', ...new Set(entries.map(e => e.unidade))], [entries]);
  const uniqueFiliais = useMemo(() => ['Todas', ...new Set(entries.map(e => e.filial))], [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchSearch = e.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.vendedor?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchVendedor = filterVendedor === 'Todos' || e.vendedor === filterVendedor;
      const matchUnidade = filterUnidade === 'Todas' || e.unidade === filterUnidade;
      const matchFilial = filterFilial === 'Todas' || e.filial === filterFilial;
      return matchSearch && matchVendedor && matchUnidade && matchFilial;
    });
  }, [entries, searchTerm, filterVendedor, filterUnidade, filterFilial]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.valor) return;

    try {
      await addDoc(collection(db, 'sales_pipeline'), {
        ...formData,
        valor: Number(formData.valor),
        clientId,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setFormData({
        vendedor: '',
        unidade: '',
        filial: '',
        etapa: 'Prospecção',
        valor: '',
        customerName: ''
      });
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta oportunidade?')) return;
    try {
      await deleteDoc(doc(db, 'sales_pipeline', id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').slice(1); // Skip header
      const batch = writeBatch(db);

      rows.forEach(row => {
        const [customerName, vendedor, unidade, filial, etapa, valor] = row.split(',').map(s => s.trim());
        if (customerName && valor) {
          const newDocRef = doc(collection(db, 'sales_pipeline'));
          batch.set(newDocRef, {
            customerName,
            vendedor,
            unidade,
            filial,
            etapa: ETAPAS.includes(etapa) ? etapa : 'Prospecção',
            valor: Number(valor),
            clientId,
            createdAt: serverTimestamp()
          });
        }
      });

      await batch.commit();
      alert('Importação concluída com sucesso!');
    };
    reader.readAsText(file);
  };

  const stats = useMemo(() => {
    const totalValue = filteredEntries.reduce((acc, curr) => acc + curr.valor, 0);
    const winRate = entries.length > 0 ? (entries.filter(e => e.etapa === 'Fechamento').length / entries.length) * 100 : 0;
    const avgTicket = filteredEntries.length > 0 ? totalValue / filteredEntries.length : 0;

    return [
      { label: 'Volume Total', value: totalValue, icon: DollarSign, isCur: true },
      { label: 'Oportunidades', value: filteredEntries.length, icon: Target },
      { label: 'Ticket Médio', value: avgTicket, icon: TrendingUp, isCur: true },
      { label: 'Win Rate Global', value: winRate, icon: CheckCircle2, suffix: '%' },
    ];
  }, [filteredEntries, entries]);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-display font-black text-slate-900">
                {stat.isCur ? formatValue(stat.value, 'R$') : stat.value.toLocaleString()}
                {stat.suffix}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary border border-white/10">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-black uppercase tracking-widest">Pipeline de Vendas</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Gestão granular e segmentada de oportunidades comerciais.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl cursor-pointer transition-all text-xs font-black uppercase tracking-widest">
            <Upload size={16} className="text-secondary" />
            Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
          >
            <Plus size={16} /> Inserir Oportunidade
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-secondary focus:bg-white outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
              <Users2 size={16} className="text-secondary" />
              <select 
                value={filterVendedor}
                onChange={(e) => setFilterVendedor(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none"
              >
                {uniqueVendedores.map(v => <option key={v} value={v}>{v === 'Todos' ? 'Vendedor: Todos' : v}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
              <Building2 size={16} className="text-secondary" />
              <select 
                value={filterUnidade}
                onChange={(e) => setFilterUnidade(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none"
              >
                {uniqueUnidades.map(u => <option key={u} value={u}>{u === 'Todas' ? 'Unidade: Todas' : u}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
              <MapPin size={16} className="text-secondary" />
              <select 
                value={filterFilial}
                onChange={(e) => setFilterFilial(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none"
              >
                {uniqueFiliais.map(f => <option key={f} value={f}>{f === 'Todas' ? 'Filial: Todas' : f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente / Oportunidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsável</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unidade/Filial</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Etapa</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valor Previsto</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 size={24} className="animate-spin text-secondary mx-auto" />
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                    Nenhuma oportunidade encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">{entry.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">ID: {entry.id.substring(0, 8)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-secondary text-[10px] font-black">
                          {entry.vendedor?.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{entry.vendedor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-700">{entry.unidade}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{entry.filial}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        entry.etapa === 'Fechamento' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        entry.etapa === 'Negociação' ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      )}>
                        {entry.etapa}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-display font-black text-slate-900">{formatValue(entry.valor, 'R$')}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-white/10">
                    <Plus size={20} />
                  </div>
                  <h3 className="text-lg font-display font-black uppercase tracking-widest">Nova Oportunidade</h3>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cliente / Oportunidade</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Nome do Prospect/Cliente"
                      value={formData.customerName}
                      onChange={e => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor Estimado (R$)</label>
                    <input 
                      required
                      type="number" 
                      placeholder="0,00"
                      value={formData.valor}
                      onChange={e => setFormData({...formData, valor: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Vendedor / Representante</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Nome do Responsável"
                      value={formData.vendedor}
                      onChange={e => setFormData({...formData, vendedor: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade de Negócio</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Matriz, Filial SP"
                      value={formData.unidade}
                      onChange={e => setFormData({...formData, unidade: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Filial / Região</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Sul, Sudeste"
                      value={formData.filial}
                      onChange={e => setFormData({...formData, filial: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-secondary focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Etapa Atual</label>
                    <select 
                      value={formData.etapa}
                      onChange={e => setFormData({...formData, etapa: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-secondary focus:bg-white transition-all appearance-none"
                    >
                      {ETAPAS.map(etapa => <option key={etapa} value={etapa}>{etapa}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-3 bg-secondary text-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                  >
                    Salvar Registro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
