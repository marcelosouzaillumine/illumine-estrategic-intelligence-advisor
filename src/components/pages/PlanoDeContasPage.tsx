import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Save, 
  UploadCloud, 
  Link2,
  CheckCircle2,
  Loader2,
  Edit2,
  Trash2,
  BookOpen,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  X,
  List
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  writeBatch, 
  doc, 
  serverTimestamp, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { DATA } from '../../data';
import { SYSTEM_KPI_CATEGORIES } from '../../constants';
import { cn } from '../../lib/utils';
import { StatusBadge } from '../Common';
import { AccountModal } from '../modals/AccountModal';
import { ImportPlanoModal } from '../modals/ImportPlanoModal';
import { MappingWizard } from '../modals/MappingWizard';
import { motion, AnimatePresence } from 'motion/react';

// ─── Delete Entire Plan Modal ─────────────────────────────────────────────────
function DeletePlanModal({ 
  clientName, 
  accountCount, 
  onConfirm, 
  onClose,
  isDeleting
}: { 
  clientName: string; 
  accountCount: number;
  onConfirm: () => void; 
  onClose: () => void;
  isDeleting: boolean;
}) {
  const [confirmText, setConfirmText] = useState('');
  const isValid = confirmText.trim().toLowerCase() === clientName.trim().toLowerCase();

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-rose-800 uppercase tracking-wide">Excluir Plano de Contas</h3>
            <p className="text-xs text-rose-500 mt-0.5">Esta ação é permanente e irreversível</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 hover:bg-rose-100 rounded-lg text-rose-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Você está prestes a excluir permanentemente <span className="font-black">{accountCount} contas</span> do plano de <span className="font-black">{clientName}</span>. Todos os vínculos de KPI e mapeamentos serão perdidos.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Para confirmar, digite o nome do cliente:
            </label>
            <div className="text-[11px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-1">
              {clientName}
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="Digite aqui..."
              className={cn(
                "w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all",
                isValid 
                  ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-300/30" 
                  : "border-slate-200 focus:border-slate-400"
              )}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!isValid || isDeleting}
            className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PlanoDeContasPage({ 
  clients, 
  selectedClient, 
  planType = 'accounting' 
}: { 
  clients: any[], 
  selectedClient: string, 
  planType?: 'accounting' | 'managerial' 
}) {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMappingWizardOpen, setIsMappingWizardOpen] = useState(false);
  const [isDeletePlanOpen, setIsDeletePlanOpen] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [accountingAccounts, setAccountingAccounts] = useState<any[]>([]);

  const currentClient = clients.find(c => c.id === selectedClient);
  const clientName = currentClient?.fantasia || 'selecionado';
  const planLabel = planType === 'accounting' ? 'Contábil' : 'Gerencial';

  const handleSaveAll = async () => {
    if (!selectedClient) return;
    setIsSavingAll(true);
    try {
      const batch = writeBatch(db);
      let count = 0;
      
      for (const acc of accounts) {
        if (!acc.id) {
          const newDocRef = doc(collection(db, 'account_plans'));
          const { id, ...accData } = acc;
          batch.set(newDocRef, {
            ...accData,
            clientId: selectedClient,
            planType,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid
          });
          count++;
        }
      }
      
      if (count > 0) {
        await batch.commit();
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'account_plans');
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleDeleteEntirePlan = async () => {
    if (!selectedClient) return;
    setIsDeletingPlan(true);
    try {
      const q = query(
        collection(db, 'account_plans'), 
        where('clientId', '==', selectedClient),
        where('planType', '==', planType)
      );
      const snapshot = await getDocs(q);
      
      // Firestore batch allows max 500 operations — chunk if needed
      const chunkSize = 450;
      const docs = snapshot.docs;
      for (let i = 0; i < docs.length; i += chunkSize) {
        const batch = writeBatch(db);
        docs.slice(i, i + chunkSize).forEach(d => batch.delete(d.ref));
        await batch.commit();
      }

      setIsDeletePlanOpen(false);
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Erro ao excluir o plano de contas.');
    } finally {
      setIsDeletingPlan(false);
    }
  };

  const accountTypes = ['Ativo', 'Passivo', 'Patrimônio Líquido', 'Receitas', 'Despesas', 'Resultado Apurado'];

  useEffect(() => {
    if (!selectedClient) {
      setAccounts(DATA.accountPlanPadrão);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'account_plans'),
      where('clientId', '==', selectedClient),
      where('planType', '==', planType),
      orderBy('code', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      
      // Migration: identify accounts without planType and update them to 'accounting'
      const legacyDocs = allDocs.filter(d => !d.planType);
      if (legacyDocs.length > 0) {
        console.log(`Migrating ${legacyDocs.length} legacy accounts for client ${selectedClient}...`);
        const batch = writeBatch(db);
        legacyDocs.forEach(d => {
          batch.update(doc(db, 'account_plans', d.id), { planType: 'accounting' });
        });
        await batch.commit();
        // The snapshot will trigger again after update
        return;
      }

      // Filter docs for the current view
      const filteredDocs = allDocs.filter(d => d.planType === planType);
      
      if (filteredDocs.length === 0 && planType === 'accounting') {
        // If it's accounting and empty, show default template
        setAccounts(DATA.accountPlanPadrão);
      } else {
        setAccounts(filteredDocs);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching accounts:", error);
      setAccounts(DATA.accountPlanPadrão);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient, planType]);

  // Fetch accounting accounts for mapping if in managerial mode
  useEffect(() => {
    if (!selectedClient || planType !== 'managerial') {
      setAccountingAccounts([]);
      return;
    }

    const q = query(
      collection(db, 'account_plans'),
      where('clientId', '==', selectedClient),
      where('planType', '==', 'accounting'),
      orderBy('code', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAccountingAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [selectedClient, planType]);

  const handleSaveAccount = async (accountData: any) => {
    try {
      const data = {
        ...accountData,
        clientId: selectedClient,
        planType,
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid
      };

      if (editingAccount?.id) {
        await updateDoc(doc(db, 'account_plans', editingAccount.id), data);
      } else {
        await addDoc(collection(db, 'account_plans'), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingAccount(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'account_plans');
    }
  };

  const handleDeleteAccount = async (id: string, code: string) => {
    if (!window.confirm(`Deseja excluir a conta ${code}?`)) return;
    try {
      if (id) {
        await deleteDoc(doc(db, 'account_plans', id));
      } else {
        setAccounts(accounts.filter(a => a.code !== code));
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         acc.code.includes(searchTerm);
    const matchesType = filterType === 'Todos' || acc.type === filterType;
    return matchesSearch && matchesType;
  });

  // Count for saved (has id) vs unsaved
  const savedCount = accounts.filter(a => a.id).length;

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      {/* Strategic Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <List size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Plano de Contas {planLabel}</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium whitespace-nowrap">Estrutura de classificação {planType === 'accounting' ? 'contábil' : 'gerencial'} do cliente {clientName}.</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 relative z-10">
          {selectedClient && savedCount > 0 && (
            <button 
              onClick={() => setIsDeletePlanOpen(true)}
              className="px-5 py-3 bg-white/5 text-rose-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> EXCLUIR PLANO
            </button>
          )}

          <button 
            onClick={handleSaveAll}
            disabled={isSavingAll || !selectedClient}
            className={cn(
              "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2",
              saveSuccess ? "bg-emerald-500 text-white" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
            )}
          >
            {isSavingAll ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saveSuccess ? 'SALVO!' : 'SALVAR ALTERAÇÕES'}
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-1 hidden xl:block" />

          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <UploadCloud size={16} /> IMPORTAR
          </button>
          
          <button 
            onClick={() => setIsMappingWizardOpen(true)}
            className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 border border-white/10"
          >
            <Link2 size={16} /> MAPEAMENTO
          </button>
          
          <button 
            onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}
            className="px-6 py-3 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20 flex items-center gap-2 border border-white/10"
          >
            <Plus size={16} /> NOVA CONTA
          </button>
        </div>
      </div>


      <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="flex-1 p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search size={18} className="absolute left-4 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por código ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-secondary/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none"
            >
              <option value="Todos">Todos os Grupos</option>
              {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* Account count chip */}
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredAccounts.length} contas
            {searchTerm || filterType !== 'Todos' ? ' filtradas' : ' no total'}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Conta</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo / Grupo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nível</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                {planType === 'managerial' && (
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vínculo Contábil</th>
                )}
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vínculo KPI</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Carregando plano de contas...</p>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
                    <h4 className="text-xl font-display text-primary">Nenhuma conta encontrada</h4>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 font-sans">Ajuste seus filtros ou adicione uma nova conta ao plano.</p>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc, idx) => (
                  <tr key={acc.id || `${acc.code}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4 text-xs font-black font-mono text-slate-400">{acc.code}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${(acc.level - 1) * 20}px` }}>
                        {acc.level > 1 && <ChevronRight size={12} className="text-slate-300" />}
                        <span className={cn("text-sm", acc.level === 1 ? "font-black text-primary" : "font-bold text-slate-600")}>
                          {acc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter",
                        acc.type === 'Ativo' ? "bg-primary/5 text-primary" :
                        acc.type === 'Passivo' ? "bg-rose-50 text-rose-700" :
                        acc.type === 'Patrimônio Líquido' ? "bg-amber-50 text-amber-700" :
                        acc.type === 'Receita' ? "bg-emerald-50 text-emerald-700" :
                        acc.type === 'Despesa' ? "bg-slate-100 text-slate-700" :
                        "bg-secondary/10 text-secondary"
                      )}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Lvl {acc.level}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <StatusBadge status={acc.status || 'Ativa'} />
                    </td>
                    {planType === 'managerial' && (
                      <td className="px-8 py-4 text-center">
                        {acc.accountingAccountIds && acc.accountingAccountIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1 justify-center max-w-[150px] mx-auto">
                            {acc.accountingAccountIds.map((id: string) => {
                              const target = accountingAccounts.find(a => a.id === id);
                              return (
                                <span key={id} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200" title={target?.name}>
                                  {target?.code || '???'}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter italic">Sem vínculo</span>
                        )}
                      </td>
                    )}
                    <td className="px-8 py-4 text-center">
                      {acc.kpiMapping ? (
                        <span className="text-[9px] font-black text-secondary bg-secondary/5 px-2 py-1 rounded-lg border border-secondary/10 flex items-center justify-center gap-1 mx-auto w-fit">
                          <Link2 size={10} />
                          {SYSTEM_KPI_CATEGORIES.find(c => c.id === acc.kpiMapping)?.label}
                        </span>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {(acc.name.toLowerCase().includes('receita líquida') || acc.name.toLowerCase().includes('lucro líquido') || acc.name.toLowerCase().includes('caixa e equivalentes')) ? (
                            <button 
                              onClick={async () => {
                                if (!acc.id) {
                                  setAccounts(accounts.map(a => a.code === acc.code ? { ...a, kpiMapping: acc.name.toLowerCase().includes('receita líquida') ? 'receita_liquida' : acc.name.toLowerCase().includes('lucro líquido') ? 'lucro_liquido' : 'disponibilidades' } : a));
                                  return;
                                }
                                const kpiId = acc.name.toLowerCase().includes('receita líquida') ? 'receita_liquida' : 
                                              acc.name.toLowerCase().includes('lucro líquido') ? 'lucro_liquido' : 'disponibilidades';
                                try {
                                  await updateDoc(doc(db, 'account_plans', acc.id), {
                                    kpiMapping: kpiId,
                                    updatedAt: serverTimestamp()
                                  });
                                } catch (e) {
                                  handleFirestoreError(e, OperationType.UPDATE, 'account_plans');
                                }
                              }}
                              className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 flex items-center justify-center gap-1 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            >
                              <Sparkles size={10} /> Vincular KPI
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter italic">Não mapeado</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingAccount(acc); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAccount(acc.id, acc.code)}
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
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDeletePlanOpen && (
          <DeletePlanModal
            clientName={clientName}
            accountCount={savedCount}
            onConfirm={handleDeleteEntirePlan}
            onClose={() => setIsDeletePlanOpen(false)}
            isDeleting={isDeletingPlan}
          />
        )}
      </AnimatePresence>

      {isModalOpen && (
        <AccountModal 
          account={editingAccount} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveAccount} 
          accountTypes={accountTypes}
          existingAccounts={accounts}
          planType={planType}
          accountingAccounts={accountingAccounts}
        />
      )}

      {isImportModalOpen && (
        <ImportPlanoModal 
          clients={clients}
          selectedClient={selectedClient}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => setIsImportModalOpen(false)}
          planType={planType}
        />
      )}

      {isMappingWizardOpen && (
        <MappingWizard 
          selectedClient={selectedClient}
          onClose={() => setIsMappingWizardOpen(false)}
        />
      )}
    </div>
  );
}
