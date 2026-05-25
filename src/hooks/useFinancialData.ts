import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { buildHistoricalSeries, HistoricalFinancialSeries } from '../core/adapters/historical-series-adapter';


export function useFinancialData(clientId: string, year: number, month: number, type: 'DRE' | 'BP' | 'CAIXA' | 'DRE Gerencial' | 'DFC' | 'DLPA') {
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
        
        // Only show approved or legacy (without status) data in dashboards
        if (docData.status === 'pending' || docData.status === 'rejected') return;

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
  const [historicalFinancialSeries, setHistoricalFinancialSeries] = useState<HistoricalFinancialSeries | null>(null);

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

        // Only show approved or legacy (without status) data in dashboards
        if (docData.status === 'pending' || docData.status === 'rejected') return;

        if (Array.isArray(docData.data)) {
          let lastType = 'ativo';
          docData.data.forEach((entry: any) => {
            const innerType = entry.type || entry.tipo || lastType;
            lastType = innerType;
            allEntries.push({
              ...entry,
              id: `${doc.id}_${entry.category}`,
              clientId: docData.clientId,
              type: docData.type,
              docType: docData.type,
              entryType: innerType.toLowerCase(),
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

  return { dbData, historicalFinancialSeries, loading, error, refetch: () => fetchData({ current: false }) };
}

/**
 * Hook para dados anuais (sem filtro de mês).
 * Usado no Balanço Patrimonial onde o período sempre é anual.
 * Retorna também `docIds` para que o componente possa excluir os documentos pai.
 */
export function useAnnualFinancialData(
  clientId: string,
  year: number,
  type: 'DRE' | 'BP' | 'CAIXA' | 'DRE Gerencial' | 'Balanço Patrimonial' | 'DFC' | 'DLPA'
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
        where('year', '==', year)
      );
      const snap = await getDocs(q);

      if (isCancelled.current) return;

      const allEntries: any[] = [];
      const ids: string[] = [];

      snap.docs.forEach(docSnap => {
        const docData = docSnap.data() as any;

        // Only show approved or legacy (without status) data in dashboards
        if (docData.status === 'pending' || docData.status === 'rejected') return;

        ids.push(docSnap.id);
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
              docType: docData.type,
              createdAt: docData.createdAt,
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
            docType: docData.type,
            createdAt: docData.createdAt,
            conta: docData.category,
            valor: docData.value,
            val: docData.value,
            type: (docData.type || docData.tipo || 'ativo').toLowerCase()
          });
        }
      });

      const filteredEntries = allEntries.filter(entry => {
        const t = (entry.type || '').toLowerCase();
        const docT = (entry.docType || '').toLowerCase();
        
        if (type === 'DRE' || type === 'DRE Gerencial') {
          // If the document is explicitly a BP document, ignore it completely for DRE
          if (docT === 'bp' || docT === 'balanço patrimonial') return false;
          
          return ['receitas', 'despesas'].includes(t) || (!['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(t) && (entry.docType === 'DRE' || entry.docType === 'DRE Gerencial'));
        } else if (type === 'BP' || type === 'Balanço Patrimonial') {
          // If the document is explicitly a DRE document, ignore it completely for BP
          if (docT === 'dre' || docT === 'dre gerencial') return false;
          
          return ['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(t) || (!['receitas', 'despesas'].includes(t) && (entry.docType === 'BP' || entry.docType === 'Balanço Patrimonial'));
        }
        return entry.docType === type;
      });

      // DEDUPLICAÇÃO DE DOCUMENTOS:
      // A correção garante que usaremos apenas o documento MAIS RECENTE retornado.
      const docIdsPresent = [...new Set(filteredEntries.map(e => e.docId))];
      let finalEntries = filteredEntries;
      let finalDocIds = ids;

      if (docIdsPresent.length > 1) {
        // Encontrar o documento mais recente com base no createdAt (se existir)
        let latestDocId = docIdsPresent[0];
        let maxTime = 0;

        docIdsPresent.forEach(docId => {
          const entry = filteredEntries.find(e => e.docId === docId);
          if (entry && entry.createdAt && entry.createdAt.toMillis) {
            const time = entry.createdAt.toMillis();
            if (time > maxTime) {
              maxTime = time;
              latestDocId = docId;
            }
          }
        });

        // Fallback: se nenhum tiver createdAt, pega o último da lista
        if (maxTime === 0) {
          latestDocId = docIdsPresent[docIdsPresent.length - 1];
        }

        finalEntries = filteredEntries.filter(e => e.docId === latestDocId);
        finalDocIds = [latestDocId];
      }

      setDbData(finalEntries);
      setDocIds(finalDocIds);
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
