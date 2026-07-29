import { useState } from 'react';
import { FirestoreFinancialAdapter } from '../../adapters/persistence/FirestoreFinancialAdapter';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';

export function useDFCPageAdapter(
  clientId: string, 
  filterYear: number, 
  showToast?: (type: string, message: string) => void
) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { dbData, loading, error, refetch: refetchDFC } = useAnnualFinancialData(
    clientId,
    filterYear,
    'DFC'
  );

  const handleDelete = async () => {
    if (!clientId || !filterYear) return;
    setDeleting(true);
    try {
      await FirestoreFinancialAdapter.deleteEntriesByClientAndYear(clientId, Number(filterYear), 'DFC');
      setShowDeleteConfirm(false);
      refetchDFC();
      if (showToast) showToast('success', `Registros de DFC do ano ${filterYear} excluídos com sucesso!`);
    } catch (err: any) {
      console.error('Erro ao excluir registros da DFC:', err);
      if (showToast) showToast('error', 'Falha ao excluir registros da DFC.');
    } finally {
      setDeleting(false);
    }
  };

  return {
    dbData,
    loading,
    error,
    refetchDFC,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete
  };
}
