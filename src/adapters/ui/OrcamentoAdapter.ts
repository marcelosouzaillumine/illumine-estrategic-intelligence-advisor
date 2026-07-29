import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { BudgetEntry, OrcamentoViewModel } from '../../viewmodels/OrcamentoViewModel';

export interface UseOrcamentoParams {
  selectedClient: string;
  selectedYear: number;
  selectedMonth: number;
}

export function useOrcamento({ selectedClient, selectedYear, selectedMonth }: UseOrcamentoParams) {
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountPlans, setAccountPlans] = useState<any[]>([]);
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [viewType, setViewType] = useState<'mensal' | 'anual'>('mensal');

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

  // Fetch Account Plans
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

  // Fetch Client Details
  useEffect(() => {
    if (!selectedClient) return;
    const unsubscribe = onSnapshot(doc(db, 'clients', selectedClient), (docSnap) => {
      if (docSnap.exists()) {
        setClientDetails(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [selectedClient]);

  const handleSave = async (editingBudget?: BudgetEntry | null) => {
    if (!selectedClient || !formData.accountId) return false;
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
      setFormData({
        valor: 0,
        unidade: '',
        filial: '',
        centroCusto: '',
        accountId: '',
        month: localMonth,
        year: localYear
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'budgets');
      return false;
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

        if (i === 1) {
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

  const budgetsByCC = useMemo(() => {
    return OrcamentoViewModel.getBudgetsByCC(budgets, localMonth, viewType);
  }, [budgets, localMonth, viewType]);

  const filteredBudgets = useMemo(() => {
    return OrcamentoViewModel.getFilteredBudgets(budgets, searchTerm, localMonth, viewType);
  }, [budgets, searchTerm, localMonth, viewType]);

  const totalBudget = useMemo(() => {
    return OrcamentoViewModel.getTotalBudget(filteredBudgets);
  }, [filteredBudgets]);

  return {
    budgets,
    filteredBudgets,
    budgetsByCC,
    totalBudget,
    loading,
    accountPlans,
    clientDetails,
    searchTerm,
    setSearchTerm,
    isSaving,
    isImporting,
    viewType,
    setViewType,
    localYear,
    setLocalYear,
    localMonth,
    setLocalMonth,
    formData,
    setFormData,
    years: OrcamentoViewModel.getYears(),
    months: OrcamentoViewModel.getMonths(),
    handleSave,
    handleDelete,
    handleDuplicate,
    handleImport
  };
}
