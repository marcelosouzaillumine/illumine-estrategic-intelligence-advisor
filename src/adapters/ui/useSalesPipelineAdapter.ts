import { useState, useEffect } from 'react';
import { SupabaseSalesAdapter } from '../persistence/SupabaseSalesAdapter';

export type SalesPipelineEntry = any;

export const useSalesPipelineAdapter = (clientId: string) => {
  const [entries, setEntries] = useState<SalesPipelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = SupabaseSalesAdapter.listenToPipelineByClient(clientId, (data) => {
      setEntries(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [clientId]);

  const handleAdd = async (formData: any) => {
    await SupabaseSalesAdapter.addPipelineEntry(clientId, formData);
  };

  const handleDelete = async (id: string) => {
    await SupabaseSalesAdapter.deletePipelineEntry(id);
  };

  const handleImport = async (parsedData: any[]) => {
    await SupabaseSalesAdapter.importPipelineEntries(clientId, parsedData);
  };

  return {
    entries,
    loading,
    handleAdd,
    handleDelete,
    handleImport
  };
};
