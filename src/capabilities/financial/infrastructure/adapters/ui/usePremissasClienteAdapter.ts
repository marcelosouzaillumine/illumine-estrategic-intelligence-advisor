import { useState } from 'react';

export function usePremissasClienteAdapter({ selectedClient }: { selectedClient: string }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [assumptions, setAssumptions] = useState<any>({
    receitas: [],
    custos: [],
    crescimento: []
  });

  const handleSave = async (data: any) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
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
