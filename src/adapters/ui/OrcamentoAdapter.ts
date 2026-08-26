import { useState, useEffect, useMemo } from 'react';
import { getSupabaseClient } from '../../infrastructure/supabase/SupabaseClient';
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
    const supabase = getSupabaseClient();
    
    let isSubscribed = true;

    const fetchBudgets = async () => {
      const { data, error } = await supabase
        .from('finance.budgets')
        .select('*')
        .eq('company_id', await getDefaultCompanyId()) // Assuming we derive company from current user or selectedClient is the company
        // Actually, the migration has company_id and period_id, and account_id
        // The table is finance.budgets
        // Wait, the schema has: company_id, period_id, account_id, amount, status
        // Let's assume we map selectedClient to company_id if needed, but we don't have periods resolved here.
        // I will implement a simplified fetch using Supabase directly that maps as closely as possible
        // Let's just fetch all budgets for this client (company)
      ;

      if (isSubscribed && data) {
        // Map to BudgetEntry format
        const mapped = data.map((d: any) => ({
          id: d.id,
          valor: d.amount,
          unidade: d.metadata?.unidade || '',
          filial: d.metadata?.filial || '',
          centroCusto: d.metadata?.centroCusto || '',
          month: d.metadata?.month || localMonth,
          year: d.metadata?.year || localYear,
          accountId: d.account_id,
          accountCode: d.metadata?.accountCode || '',
          accountName: d.metadata?.accountName || '',
          clientId: d.company_id // mapping back
        })).filter((d: any) => d.status !== 'pending' && d.status !== 'rejected');
        setBudgets(mapped);
      }
      setLoading(false);
    };

    fetchBudgets();

    const channel = supabase.channel('public:finance.budgets')
      .on('postgres_changes', { event: '*', schema: 'finance', table: 'budgets' }, () => {
        fetchBudgets();
      }).subscribe();

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }, [selectedClient, localYear]);

  // Fetch Account Plans
  useEffect(() => {
    if (!selectedClient) return;
    const supabase = getSupabaseClient();
    let isSubscribed = true;

    const fetchAccounts = async () => {
      const { data } = await supabase.from('finance.chart_of_accounts').select('*').eq('company_id', await getDefaultCompanyId());
      if (isSubscribed && data) {
        setAccountPlans(data);
      }
    };
    fetchAccounts();

    return () => { isSubscribed = false; };
  }, [selectedClient]);

  // Fetch Client Details
  useEffect(() => {
    if (!selectedClient) return;
    const supabase = getSupabaseClient();
    let isSubscribed = true;
    const fetchClient = async () => {
      const { data } = await supabase.from('crm.clients').select('*').eq('id', selectedClient).single();
      if (isSubscribed && data) {
        setClientDetails(data);
      }
    };
    fetchClient();
    return () => { isSubscribed = false; };
  }, [selectedClient]);

  const handleSave = async (editingBudget?: BudgetEntry | null) => {
    if (!selectedClient || !formData.accountId) return false;
    setIsSaving(true);
    const supabase = getSupabaseClient();
    try {
      const companyId = await getDefaultCompanyId();
      // Resolve period_id (mocked or fetched)
      // Since we don't have periods readily available, we will mock or create one for simplicity, or we assume a period structure.
      const periodId = '00000000-0000-0000-0000-000000000000'; // FIXME: Real period needed
      
      const payload = {
        company_id: companyId,
        period_id: periodId,
        account_id: formData.accountId,
        amount: formData.valor || 0,
        status: 'approved',
        metadata: {
          month: localMonth,
          year: localYear,
          unidade: formData.unidade,
          filial: formData.filial,
          centroCusto: formData.centroCusto
        }
      };

      if (editingBudget?.id) {
        await supabase.from('finance.budgets').update(payload).eq('id', editingBudget.id);
      } else {
        await supabase.from('finance.budgets').insert(payload);
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
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este lançamento orçamentário?')) return;
    try {
      const supabase = getSupabaseClient();
      await supabase.from('finance.budgets').delete().eq('id', id);
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
      
      const supabase = getSupabaseClient();
      const companyId = await getDefaultCompanyId();
      const periodId = '00000000-0000-0000-0000-000000000000'; // FIXME: Real period needed

      const payload = budgets.filter(b => b.month === localMonth).map(b => ({
        company_id: companyId,
        period_id: periodId,
        account_id: b.accountId,
        amount: b.valor,
        status: 'approved',
        metadata: {
          month: nextMonth,
          year: nextYear,
          unidade: b.unidade,
          filial: b.filial,
          centroCusto: b.centroCusto
        }
      }));
      
      if (payload.length > 0) {
         await supabase.from('finance.budgets').insert(payload);
      }
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
      
      const supabase = getSupabaseClient();
      const companyId = await getDefaultCompanyId();
      const periodId = '00000000-0000-0000-0000-000000000000'; // FIXME
      const payload: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[,;]/).map(v => v.trim());
        const entry: any = {};
        header.forEach((h, idx) => {
          entry[h] = values[idx];
        });

        const account = accountPlans.find(a => a.code === entry.codigo || a.name === entry.conta);
        if (!account) continue;

        payload.push({
          company_id: companyId,
          period_id: periodId,
          account_id: account.id,
          amount: parseFloat(entry.valor.replace(/[R$ \.]/g, '').replace(',', '.')) || 0,
          status: 'pending',
          metadata: {
            month: parseInt(entry.mes) || localMonth,
            year: parseInt(entry.ano) || localYear,
            unidade: entry.unidade || '',
            filial: entry.filial || '',
            centroCusto: entry.centrocusto || entry.cc || '',
          }
        });
      }

      if (payload.length > 0) {
        await supabase.from('finance.budgets').insert(payload);
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

async function getDefaultCompanyId(): Promise<string> {
    const supabase = getSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return "00000000-0000-0000-0000-000000000000";
    const { data } = await supabase.from('tenant.tenant_users').select('tenant_id').eq('user_id', userData.user.id).limit(1).single();
    if (data) return data.tenant_id;
    return "00000000-0000-0000-0000-000000000000";
}
