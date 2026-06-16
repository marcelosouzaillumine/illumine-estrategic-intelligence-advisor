import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Save, UploadCloud, ChevronRight, Calculator, Trash2, Edit2, X, FileSpreadsheet, CheckCircle2, Loader2, Building2, Landmark, LayoutGrid, AlertCircle, TrendingUp, FileText, Calendar } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { cn, formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../Common';

interface BudgetEntry {
  id?: string;
  clientId: string;
  year: number;
  month: number;
  accountId: string;
  accountCode: string;
  accountName: string;
  unidade: string;
  filial: string;
  centroCusto: string;
  valor: number;
  type: 'Budget';
}

export function OrcamentoPage({ 
  selectedClient, 
  selectedYear, 
  selectedMonth 
}: { 
  selectedClient: string;
  selectedYear: number;
  selectedMonth: number;
}) {
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetEntry | null>(null);
  const [accountPlans, setAccountPlans] = useState<any[]>([]);
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [viewType, setViewType] = useState<'mensal' | 'anual'>('mensal');

  // Form states
  const [localYear, setLocalYear] = useState(selectedYear);
  const [localMonth, setLocalMonth] = useState(selectedMonth);

  const [formData, setFormData] = useState<Partial<BudgetEntry>>({
    valor: 0,
    unidade: '',
    filial: '',
    centroCusto: '',
    accountId: '',
    month: selectedMonth,
    year: selectedYear
  });

  useEffect(() => {
    setLocalYear(selectedYear);
    setLocalMonth(selectedMonth);
    setFormData(prev => ({ ...prev, month: selectedMonth, year: selectedYear }));
  }, [selectedYear, selectedMonth]);

  // Fetch Budgets
  useEffect(() => {
    if (!selectedClient) return;
    setLoading(true);
    const q = query(
      collection(db, 'budgets'),
      where('clientId', '==', selectedClient),
      where('year', '==', localYear)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter(d => d.status !== 'pending' && d.status !== 'rejected');
      setBudgets(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [selectedClient, localYear]);

  // Fetch Account Plans (Accounting)
  useEffect(() => {
    if (!selectedClient) return;
    const q = query(
      collection(db, 'account_plans'),
      where('clientId', '==', selectedClient),
      where('planType', '==', 'accounting')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAccountPlans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [selectedClient]);

  // Fetch Client Details (for Units, Filiais, CC)
  useEffect(() => {
    if (!selectedClient) return;
    const unsubscribe = onSnapshot(doc(db, 'clients', selectedClient), (docSnap) => {
      if (docSnap.exists()) {
        setClientDetails(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [selectedClient]);

  const handleSave = async () => {
    if (!selectedClient || !formData.accountId) return;
    setIsSaving(true);
    try {
      const account = accountPlans.find(a => a.id === formData.accountId);
      const data = {
        ...formData,
        clientId: selectedClient,
        accountCode: account?.code || '',
        accountName: account?.name || '',
        type: 'Budget',
        updatedAt: serverTimestamp()
      };

      if (editingBudget?.id) {
        await updateDoc(doc(db, 'budgets', editingBudget.id), data);
      } else {
        await addDoc(collection(db, 'budgets'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      setFormData({
        valor: 0,
        unidade: '',
        filial: '',
        centroCusto: '',
        accountId: '',
        month: localMonth,
        year: localYear
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'budgets');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este lançamento orçamentário?')) return;
    try {
      await deleteDoc(doc(db, 'budgets', id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const header = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());
      
      const batch = writeBatch(db);
      let count = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[,;]/).map(v => v.trim());
        const entry: any = {};
        header.forEach((h, idx) => {
          entry[h] = values[idx];
        });

        // Mapping: code/account, value, month, year, unit, branch, cc
        const account = accountPlans.find(a => a.code === entry.codigo || a.name === entry.conta);
        if (!account) continue;

        const data = {
          clientId: selectedClient,
          year: parseInt(entry.ano) || localYear,
          month: parseInt(entry.mes) || localMonth,
          accountId: account.id,
          accountCode: account.code,
          accountName: account.name,
          unidade: entry.unidade || '',
          filial: entry.filial || '',
          centroCusto: entry.centrocusto || entry.cc || '',
          valor: parseFloat(entry.valor.replace(/[R$ \.]/g, '').replace(',', '.')) || 0,
          type: 'Budget',
          createdBy: auth.currentUser?.uid,
          creatorEmail: auth.currentUser?.email,
          sourceCollection: 'budgets',
          status: 'pending',
          requiresApproval: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const newRef = doc(collection(db, 'budgets'));
        batch.set(newRef, data);
        count++;

        if (i === 1) { // First valid row, notify once
           await notificationService.createNotification({
            userId: 'admin_group',
            title: 'Novo Orçamento para Aprovação',
            message: `${auth.currentUser?.email} importou um orçamento (${lines.length - 1} itens) para ${clientDetails?.fantasia || 'Cliente'}.`,
            type: 'approval_request',
            link: 'maintenance',
            metadata: {
              type: 'Budget',
              clientId: selectedClient
            }
          });
        }

        if (count >= 450) {
          await batch.commit();
          count = 0;
        }
      }

      if (count > 0) {
        await batch.commit();
      }
      alert('Importação enviada para aprovação com sucesso!');
    } catch (error) {
      console.error('Error importing budgets:', error);
      alert('Erro na importação. Verifique o formato do arquivo.');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleDuplicate = async () => {
    if (!selectedClient || budgets.length === 0) return;
    if (!window.confirm(`Deseja duplicar o orçamento de ${localMonth}/${localYear} para o próximo mês?`)) return;
    
    setIsSaving(true);
    try {
      const nextMonth = localMonth === 12 ? 1 : localMonth + 1;
      const nextYear = localMonth === 12 ? localYear + 1 : localYear;
      
      const batch = writeBatch(db);
      budgets.filter(b => b.month === localMonth).forEach(b => {
        const { id, ...data } = b;
        const newRef = doc(collection(db, 'budgets'));
        batch.set(newRef, {
          ...data,
          month: nextMonth,
          year: nextYear,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      await batch.commit();
      alert('Orçamento duplicado com sucesso!');
    } catch (error) {
      console.error('Error duplicating budget:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const budgetsByCC = useMemo(() => {
    const map: Record<string, number> = {};
    const baseList = viewType === 'mensal' 
      ? budgets.filter(b => b.month === localMonth)
      : budgets;

    baseList.forEach(b => {
      const cc = b.centroCusto || 'Geral';
      map[cc] = (map[cc] || 0) + b.valor;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [budgets, localMonth, viewType]);

  const filteredBudgets = useMemo(() => {
    const list = budgets.filter(b => 
      (b.accountName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       b.accountCode.includes(searchTerm) ||
       b.centroCusto.toLowerCase().includes(searchTerm.toLowerCase()) ||
       b.unidade.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (viewType === 'mensal' ? b.month === localMonth : true)
    );

    if (viewType === 'anual') {
      // Group by accountId + unidade + filial + centroCusto
      const grouped: Record<string, BudgetEntry> = {};
      list.forEach(b => {
        const key = `${b.accountId}_${b.unidade}_${b.filial}_${b.centroCusto}`;
        if (!grouped[key]) {
          grouped[key] = { ...b };
        } else {
          grouped[key].valor += b.valor;
        }
      });
      return Object.values(grouped);
    }

    return list;
  }, [budgets, searchTerm, localMonth, viewType]);

  const totalBudget = filteredBudgets.reduce((acc, curr) => acc + curr.valor, 0);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const list = [];
    for (let i = current - 5; i <= current + 5; i++) {
      list.push(i);
    }
    return list;
  }, []);

  const months = [
    { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
    { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
    { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
    { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' }
  ];

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Orçamento & Budget" 
        subtitle="Planejamento financeiro vinculado a unidades, filiais e centros de custo."
        icon={Calculator}
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-border">
            <button 
              onClick={() => setViewType('mensal')}
              className={cn(
                "px-4 md:px-6 py-1.5 md:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewType === 'mensal' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-muted-foreground"
              )}
            >
              Mensal
            </button>
            <button 
              onClick={() => setViewType('anual')}
              className={cn(
                "px-4 md:px-6 py-1.5 md:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                viewType === 'anual' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-muted-foreground"
              )}
            >
              Anual
            </button>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-border shadow-sm h-[40px]">
            <div className={cn("flex items-center px-4 py-2", viewType === 'mensal' && "border-r border-border")}>
              <Calendar size={14} className="text-secondary mr-2" />
              <select 
                value={localYear} 
                onChange={(e) => setLocalYear(parseInt(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {viewType === 'mensal' && (
              <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                <select 
                  value={localMonth} 
                  onChange={(e) => setLocalMonth(parseInt(e.target.value))}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {months.map(m => (
                    <option key={m.v} value={m.v}>{m.l}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

          <button 
            onClick={handleDuplicate}
            disabled={isSaving || budgets.filter(b => b.month === localMonth).length === 0}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-white border border-border text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-success-soft transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 h-[40px]"
          >
            <LayoutGrid size={14} /> DUPLICAR MÊS
          </button>

          <label className="cursor-pointer px-4 md:px-6 py-2 md:py-2.5 bg-white border border-border text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm h-[40px]">
            {isImporting ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            {isImporting ? 'IMPORTANDO...' : 'IMPORTAR CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={isImporting} />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { 
              setEditingBudget(null); 
              setFormData({
                valor: 0,
                unidade: '',
                filial: '',
                centroCusto: '',
                accountId: '',
                month: localMonth,
                year: localYear
              });
              setIsModalOpen(true); 
            }}
            className="px-5 md:px-8 py-2.5 md:py-3.5 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2"
          >
            <Plus size={16} /> NOVO LANÇAMENTO
          </button>
        </div>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Total Orçado ({viewType === 'mensal' ? 'Mês' : 'Ano'})</p>
     <p className="text-3xl font-display font-black text-executive-secondary tracking-tighter">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Itens Planejados</p>
     <p className="text-3xl font-display font-black text-executive-secondary tracking-tighter">{filteredBudgets.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-success-soft0" />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Referência</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-muted-foreground tracking-tighter">
              {viewType === 'mensal' ? months.find(m => m.v === localMonth)?.l : localYear}
            </span>
            {viewType === 'mensal' && (
       <span className="text-sm font-bold text-executive-secondary">{localYear}</span>
            )}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-warning-soft0" />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Principais CCs</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {budgetsByCC.slice(0, 3).map(([cc]) => (
              <span key={cc} className="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-muted-foreground">{cc}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Table Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden p-6 flex items-center gap-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Pesquisar por conta, unidade ou CC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-border rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-border">
                    <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Conta Contábil</th>
                    <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Unidade / Filial</th>
                    <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Centro de Custo</th>
                    <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Valor Orçado</th>
                    <th className="px-5 md:px-8 py-3 md:py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
            <p className="text-executive-secondary font-bold">Carregando orçamento...</p>
                      </td>
                    </tr>
                  ) : filteredBudgets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <FileSpreadsheet size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-xl font-display text-primary">Nenhum lançamento encontrado</h4>
            <p className="text-executive-secondary max-w-2xl mx-auto mt-2">Clique em "Novo Lançamento" ou importe um arquivo CSV para começar.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredBudgets.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 md:px-8 py-2.5 md:py-4">
                          <div>
                            <p className="text-sm font-black text-primary">{b.accountName}</p>
                            <p className="text-[10px] font-mono font-bold text-muted-foreground">{b.accountCode}</p>
                          </div>
                        </td>
                        <td className="px-5 md:px-8 py-2.5 md:py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter px-2 py-0.5 bg-slate-100 rounded-md w-fit">{b.unidade || 'Sem Unidade'}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{b.filial || 'Sem Filial'}</span>
                          </div>
                        </td>
                        <td className="px-5 md:px-8 py-2.5 md:py-4">
                          <span className="text-xs font-bold text-muted-foreground">{b.centroCusto || 'Geral'}</span>
                        </td>
                        <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
             <span className="text-sm font-black text-executive-secondary">{formatCurrency(b.valor)}</span>
                        </td>
                        <td className="px-5 md:px-8 py-2.5 md:py-4 text-right">
                          <div className={cn(
                            "flex items-center justify-end gap-2 transition-opacity",
                            viewType === 'anual' ? "opacity-20 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
                          )}>
                            <button 
                              onClick={() => { if(viewType === 'mensal') { setEditingBudget(b); setFormData(b); setIsModalOpen(true); } }}
                              disabled={viewType === 'anual'}
                              className="p-2 text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => b.id && viewType === 'mensal' && handleDelete(b.id)}
                              disabled={viewType === 'anual'}
                              className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-critical-soft rounded-lg transition-all"
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
          </div>
        </div>

        {/* CC Summary Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-border shadow-sm space-y-6">
      <h3 className="text-sm font-black text-executive-secondary uppercase tracking-widest flex items-center gap-3">
              <TrendingUp size={20} className="text-secondary" /> Resumo por Centro de Custo
            </h3>
            <div className="space-y-4">
              {budgetsByCC.map(([cc, value]) => (
                <div key={cc} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">{cc}</span>
                    <span className="text-muted-foreground">{formatCurrency(value)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / totalBudget) * 100}%` }}
                      className="h-full bg-secondary"
                    />
                  </div>
                </div>
              ))}
              {budgetsByCC.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-10">Aguardando dados...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Calculator size={24} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black tracking-tight">
                        {editingBudget ? 'Editar Orçamento' : 'Novo Planejamento'}
                      </h3>
                      <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Preencha os campos abaixo para definir o budget</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Conta Contábil</label>
                    <select 
                      value={formData.accountId}
                      onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-border rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-secondary/10 transition-all"
                    >
                      <option value="">Selecione uma conta...</option>
                      {accountPlans.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Valor Orçado (R$)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">R$</span>
                      <input 
                        type="number"
                        value={formData.valor}
                        onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-border rounded-2xl text-xl font-display font-black text-muted-foreground outline-none focus:bg-white focus:ring-4 focus:ring-secondary/10 transition-all"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Unidade de Negócio</label>
                    <select 
                      value={formData.unidade}
                      onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-border rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all"
                    >
                      <option value="">Selecione...</option>
                      {clientDetails?.unidadesNegocio?.map((u: string) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Filial</label>
                    <select 
                      value={formData.filial}
                      onChange={(e) => setFormData({...formData, filial: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border border-border rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all"
                    >
                      <option value="">Selecione...</option>
                      {clientDetails?.filiais?.map((f: any) => (
                        <option key={f.nome} value={f.nome}>{f.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block px-1">Centro de Custo</label>
                    <input 
                      type="text"
                      value={formData.centroCusto}
                      onChange={(e) => setFormData({...formData, centroCusto: e.target.value})}
                      placeholder="Ex: Marketing"
                      className="w-full px-5 py-3 bg-slate-50 border border-border rounded-2xl text-sm font-bold outline-none focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !formData.accountId}
                    className="flex-1 py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingBudget ? 'Atualizar Budget' : 'Salvar Planejamento'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
