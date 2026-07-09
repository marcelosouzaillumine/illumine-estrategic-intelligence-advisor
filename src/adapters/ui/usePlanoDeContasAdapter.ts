import { useState, useEffect } from 'react';
import { FirestoreAccountPlansAdapter } from '../persistence/FirestoreAccountPlansAdapter';
import { handleFirestoreError, OperationType } from '../../lib/firebase';
import { DATA } from '../../data';

export function usePlanoDeContasAdapter({ selectedClient, planType }: { user: any, selectedClient: string, planType: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [accountingAccounts, setAccountingAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!selectedClient) {
      setItems(DATA.accountPlanPadrão);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = FirestoreAccountPlansAdapter.listenToAccountPlans(
      selectedClient, 
      planType, 
      (accounts) => {
        if (accounts.length === 0 && planType === 'accounting') {
          setItems(DATA.accountPlanPadrão);
        } else {
          setItems(accounts);
        }
        setLoading(false);
      },
      async (legacyDocs) => {
        console.log(`Migrating ${legacyDocs.length} legacy accounts for client ${selectedClient}...`);
        await FirestoreAccountPlansAdapter.migrateLegacyAccounts(legacyDocs);
      }
    );

    return () => unsubscribe();
  }, [selectedClient, planType]);

  useEffect(() => {
    if (!selectedClient || planType !== 'managerial') {
      setAccountingAccounts([]);
      return;
    }

    const unsubscribe = FirestoreAccountPlansAdapter.listenToAccountingAccounts(selectedClient, (accounts) => {
      setAccountingAccounts(accounts);
    });

    return () => unsubscribe();
  }, [selectedClient, planType]);

  const handleBulkAddDefault = async (defaultPlan: any[], clientId: string, clientName: string) => {
    await FirestoreAccountPlansAdapter.bulkAddDefaultPlans(defaultPlan, clientId, clientName, planType);
  };

  const addItem = async (payload: any) => {
    await FirestoreAccountPlansAdapter.addAccountPlan(payload);
  };

  const updateItem = async (id: string, payload: any) => {
    await FirestoreAccountPlansAdapter.updateAccountPlan(id, payload);
  };

  const deleteItem = async (id: string) => {
    await FirestoreAccountPlansAdapter.deleteAccountPlan(id);
  };

  const clearAllItems = async (clientId: string, type: string) => {
    await FirestoreAccountPlansAdapter.clearAllItems(clientId, type);
  };

  const handleSaveAll = async () => {
    if (!selectedClient) return;
    setIsSavingAll(true);
    try {
      const unassignedAccounts = items.filter(acc => !acc.id);
      const count = await FirestoreAccountPlansAdapter.saveAllNewAccounts(selectedClient, planType, unassignedAccounts);
      if (count > 0) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'account_plans');
    } finally {
      setIsSavingAll(false);
    }
  };

  return {
    items,
    setAccounts: setItems,
    accountingAccounts,
    setAccountingAccounts,
    loading,
    isSavingAll,
    saveSuccess,
    handleSaveAll,
    handleBulkAddDefault,
    addItem,
    updateItem,
    deleteItem,
    clearAllItems
  };
}
