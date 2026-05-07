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
  Sparkles
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
  deleteDoc 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { DATA } from '../../data';
import { SYSTEM_KPI_CATEGORIES } from '../../constants';
import { cn } from '../../lib/utils';
import { PageHeader, StatusBadge } from '../Common';
import { AccountModal } from '../modals/AccountModal';
import { ImportPlanoModal } from '../modals/ImportPlanoModal';
import { MappingWizard } from '../modals/MappingWizard';


export function PlanoDeContasPage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMappingWizardOpen, setIsMappingWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const accountTypes = ['Ativo', 'Passivo', 'Patrimônio Líquido', 'Receita', 'Custo', 'Despesa'];

  useEffect(() => {
    if (!selectedClient) {
      setAccounts(DATA.accountPlanPadrão);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'account_plans'),
      where('clientId', '==', selectedClient),
      orderBy('code', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length === 0) {
        setAccounts(DATA.accountPlanPadrão);
      } else {
        setAccounts(docs);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching accounts:", error);
      setAccounts(DATA.accountPlanPadrão);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  const handleSaveAccount = async (accountData: any) => {
    try {
      const data = {
        ...accountData,
        clientId: selectedClient,
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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <PageHeader 
          title="Plano de Contas" 
          description={`Estrutura de classificação contábil e gerencial do cliente ${clients.find(c => c.id === selectedClient)?.fantasia || 'selecionado'}.`}
        />
        <div className="flex gap-3 mb-8">
          <button 
            onClick={handleSaveAll}
            disabled={isSavingAll || !selectedClient}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2",
              saveSuccess ? "bg-emerald-500 text-white" : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
            )}
          >
            {isSavingAll ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saveSuccess ? 'Alterações Salvas!' : 'Salvar Alterações'}
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <UploadCloud size={18} /> Importar
          </button>
          <button 
            onClick={() => setIsMappingWizardOpen(true)}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2"
          >
            <Link2 size={18} /> Mapeamento Inteligente
          </button>
          <button 
            onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}
            className="px-6 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2"
          >
            <Plus size={18} /> Nova Conta
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

      {isModalOpen && (
        <AccountModal 
          account={editingAccount} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveAccount} 
          accountTypes={accountTypes}
          existingAccounts={accounts}
        />
      )}

      {isImportModalOpen && (
        <ImportPlanoModal 
          clients={clients}
          selectedClient={selectedClient}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => setIsImportModalOpen(false)}
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
