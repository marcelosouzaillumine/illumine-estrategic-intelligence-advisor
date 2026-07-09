import { useState } from 'react';
import { FirestoreAuthAdapter } from '../persistence/FirestoreAuthAdapter';
import { FirestoreFinancialAdapter } from '../persistence/FirestoreFinancialAdapter';


export function useDFCPageAdapter(selectedClient: string, filterYear: number, refetchDFC: () => void, showToast: (type: 'success' | 'error', message: string) => void, auth: any) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!FirestoreAuthAdapter.isAuthenticated()) {
      showToast('error', 'Você precisa estar logado para excluir dados.');
      return;
    }
    setDeleting(true);
    setShowDeleteConfirm(false);
    try {
      const entries = await FirestoreFinancialAdapter.getEntriesByClientAndYear(selectedClient, filterYear, 'DFC');
      await FirestoreFinancialAdapter.deleteEntriesByClientAndYear(selectedClient, filterYear, 'DFC');
      showToast('success', `${entries.length} registro(s) excluído(s) com sucesso.`);
      refetchDFC();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao excluir dados.');
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
  };
}
