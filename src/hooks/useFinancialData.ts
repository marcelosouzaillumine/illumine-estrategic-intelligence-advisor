import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';


export function useFinancialData(clientId: string, year: number, month: number, type: 'DRE' | 'BP' | 'CAIXA' | 'DRE Gerencial') {
  const [dbData, setDbData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId),
        where('type', '==', type),
        where('year', '==', year),
        where('month', '==', month)
      );
      const snap = await getDocs(q);
      
      if (isCancelled.current) return;

      const allEntries: any[] = [];
      snap.docs.forEach(doc => {
        const docData = doc.data() as any;
        if (Array.isArray(docData.data)) {
          docData.data.forEach((entry: any) => {
            allEntries.push({
              ...entry,
              id: `${doc.id}_${entry.category}`,
              conta: entry.category,
              valor: entry.value,
              val: entry.value
            });
          });
        } else {
           allEntries.push({
             ...docData,
             id: doc.id,
             conta: docData.category,
             valor: docData.value,
             val: docData.value
           });
        }
      });
      setDbData(allEntries);
    } catch (e: any) {
      if (!isCancelled.current) {
        console.error(e);
        setError(e.message || 'Erro ao carregar dados financeiros');
      }
    } finally {
      if (!isCancelled.current) {
        setLoading(false);
      }
    }
  }, [clientId, year, month, type]);

  useEffect(() => {
    const isCancelled = { current: false };
    fetchData(isCancelled);
    return () => {
      isCancelled.current = true;
    };
  }, [fetchData]);

  return { dbData, loading, error, refetch: () => fetchData({ current: false }) };
}

export function useAllFinancialData(clientId: string) {
  const [dbData, setDbData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId)
      );
      const snap = await getDocs(q);
      
      if (isCancelled.current) return;

      const allEntries: any[] = [];
      snap.docs.forEach(doc => {
        const docData = doc.data() as any;
        if (Array.isArray(docData.data)) {
          docData.data.forEach((entry: any) => {
            allEntries.push({
              ...entry,
              id: `${doc.id}_${entry.category}`,
              clientId: docData.clientId,
              type: docData.type,
              ano: docData.year,
              year: docData.year,
              mes: docData.month,
              month: docData.month,
              conta: entry.category,
              valor: entry.value,
              val: entry.value
            });
          });
        } else {
          allEntries.push({
            id: doc.id,
            ...docData,
            conta: docData.category,
            valor: docData.value,
            val: docData.value
          });
        }
      });
      setDbData(allEntries);
    } catch (e: any) {
      if (!isCancelled.current) {
        console.error(e);
        setError(e.message || 'Erro ao carregar todos os dados financeiros');
      }
    } finally {
      if (!isCancelled.current) {
        setLoading(false);
      }
    }
  }, [clientId]);

  useEffect(() => {
    const isCancelled = { current: false };
    fetchData(isCancelled);
    return () => {
      isCancelled.current = true;
    };
  }, [fetchData]);

  return { dbData, loading, error, refetch: () => fetchData({ current: false }) };
}

/**
 * Hook para dados anuais (sem filtro de mês).
 * Usado no Balanço Patrimonial onde o período sempre é anual.
 * Retorna também `docIds` para que o componente possa excluir os documentos pai.
 */
export function useAnnualFinancialData(
  clientId: string,
  year: number,
  type: 'DRE' | 'BP' | 'CAIXA' | 'DRE Gerencial' | 'Balanço Patrimonial'
) {
  const [dbData, setDbData] = useState<any[]>([]);
  const [docIds, setDocIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId),
        where('type', '==', type),
        where('year', '==', year)
      );
      const snap = await getDocs(q);

      if (isCancelled.current) return;

      const allEntries: any[] = [];
      const ids: string[] = [];

      snap.docs.forEach(docSnap => {
        ids.push(docSnap.id);
        const docData = docSnap.data() as any;
        if (Array.isArray(docData.data)) {
          // Para Balanço Patrimonial, tentamos inferir o tipo se estiver faltando
          let lastType = 'ativo';
          docData.data.forEach((entry: any) => {
            const entryType = entry.type || entry.tipo || lastType;
            lastType = entryType;

            allEntries.push({
              ...entry,
              id: `${docSnap.id}_${entry.category}`,
              docId: docSnap.id,
              conta: entry.category,
              valor: entry.value,
              val: entry.value,
              type: entryType.toLowerCase()
            });
          });
        } else {
          allEntries.push({
            ...docData,
            id: docSnap.id,
            docId: docSnap.id,
            conta: docData.category,
            valor: docData.value,
            val: docData.value,
            type: (docData.type || docData.tipo || 'ativo').toLowerCase()
          });
        }
      });

      setDbData(allEntries);
      setDocIds(ids);
    } catch (e: any) {
      if (!isCancelled.current) {
        console.error(e);
        setError(e.message || 'Erro ao carregar dados financeiros');
      }
    } finally {
      if (!isCancelled.current) setLoading(false);
    }
  }, [clientId, year, type]);

  useEffect(() => {
    const isCancelled = { current: false };
    fetchData(isCancelled);
    return () => { isCancelled.current = true; };
  }, [fetchData]);

  return { dbData, docIds, loading, error, refetch: () => fetchData({ current: false }) };
}
