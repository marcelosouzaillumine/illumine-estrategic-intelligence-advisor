import { useState, useEffect } from 'react';
import { FirestoreClientAssumptionsAdapter } from '../persistence/FirestoreClientAssumptionsAdapter';
import { handleFirestoreError, OperationType } from '../../lib/firebase';
import { DATA } from '../../data';

export function usePremissasClienteAdapter({ selectedClient }: { selectedClient: string }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [assumptions, setAssumptions] = useState<any>({
    receitas: [],
    custos: [],
    crescimento: 0
  });

  useEffect(() => {
    if (!selectedClient) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const assumptionsData = await FirestoreClientAssumptionsAdapter.getAssumptions(selectedClient);
        if (assumptionsData) {
          setAssumptions(assumptionsData);
        } else {
          setAssumptions({ receitas: [], custos: [], crescimento: 0 });
        }

        const allAccounts = await FirestoreClientAssumptionsAdapter.getAccountPlans(selectedClient);

        const managerial = allAccounts.filter(a => a.planType === 'managerial');
        const accounting = allAccounts.filter(a => a.planType === 'accounting');
        
        let accountsData = managerial.length > 0 ? managerial : (accounting.length > 0 ? accounting : allAccounts);
        setAccounts(accountsData.length > 0 ? accountsData : DATA.accountPlanPadrão);
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedClient]);

  const handleSave = async (currentAssumptions: any) => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      await FirestoreClientAssumptionsAdapter.saveAssumptions(selectedClient, currentAssumptions);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'client_assumptions');
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    saveSuccess,
    accounts,
    assumptions,
    setAssumptions,
    handleSave
  };
}
