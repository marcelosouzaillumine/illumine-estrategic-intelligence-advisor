import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface SalesPipelineEntry {
  id?: string;
  clientId: string;
  vendedor: string;
  unidade: string;
  filial: string;
  etapa: string;
  valor: number;
  customerName: string;
  data?: any;
}

import { FirestoreSalesAdapter } from '../persistence/FirestoreSalesAdapter';

export function useSalesPipelineAdapter(clientId: string, skip: boolean = false) {
  const [loading, setLoading] = useState(false);
  const [pipelineEntries, setPipelineEntries] = useState<SalesPipelineEntry[]>([]);

  useEffect(() => {
    if (!clientId || skip) return;
    const q = query(
      collection(db, 'sales_pipeline'),
      where('clientId', '==', clientId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPipelineEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SalesPipelineEntry)));
    });
    return () => unsubscribe();
  }, [clientId, skip]);

  const handleAdd = async (formData: any, onSuccess?: () => void) => {
    setLoading(true);
    await FirestoreSalesAdapter.addPipelineEntry(clientId, formData);
    setLoading(false);
    if(onSuccess) onSuccess();
  };
  
  const handleDelete = async (id: string) => {
    setLoading(true);
    await FirestoreSalesAdapter.deletePipelineEntry(id);
    setLoading(false);
  };
  
  const handleImport = async (parsedData: any[], onSuccess?: () => void) => {
    setLoading(true);
    await FirestoreSalesAdapter.importPipelineEntries(clientId, parsedData);
    setLoading(false);
    if(onSuccess) onSuccess();
  };

  return {
    pipelineEntries,
    entries: pipelineEntries,
    loading,
    handleAdd,
    handleDelete,
    handleImport
  };
}
