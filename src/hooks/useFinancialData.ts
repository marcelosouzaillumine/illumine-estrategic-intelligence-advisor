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
        where('year', '==', year)
      );
      const snap = await getDocs(q);
      
      if (isCancelled.current) return;

      const allEntries: any[] = [];
      snap.docs.forEach(doc => {
        const docData = doc.data() as any;
        
        // Exibe dados pendentes, aprovados ou legados. Apenas ignora rejeitados ou arquivados.
        if (docData.status === 'rejected' || docData.status === 'archived') return;

        // In-memory month filtering for data that has a month
        if (month > 0 && docData.month !== undefined && docData.month !== 0 && docData.month !== month) return;

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

        // Exibe dados pendentes, aprovados ou legados. Apenas ignora rejeitados ou arquivados.
        if (docData.status === 'rejected' || docData.status === 'archived') return;

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
      
      console.log(`[DEBUG USE_ANNUAL_DATA] Fetching ${type} for ${clientId} year ${year}. Found ${snap.docs.length} docs.`);

      snap.docs.forEach(docSnap => {
        const docData = docSnap.data() as any;

        // Exibe dados pendentes, aprovados ou legados. Apenas ignora rejeitados ou arquivados.
        if (docData.status === 'rejected' || docData.status === 'archived') return;

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
              type: entryType.toLowerCase(),
              isBatch: true
            });
          });
        } else {
          allEntries.push({
            ...docData,
            id: docSnap.id,
            docId: docSnap.id,
            docType: docData.type,
            createdAt: docData.createdAt,
            conta: docData.category || docData.conta,
            valor: docData.value || docData.valor || docData.val,
            val: docData.value || docData.valor || docData.val,
            type: (docData.type || docData.tipo || 'ativo').toLowerCase(),
            isBatch: false
          });
        }
      });

      const filteredEntries = allEntries.filter(entry => {
        const t = (entry.type || '').toLowerCase();
        const docT = (entry.docType || '').toLowerCase();
        
        if (type === 'DRE' || type === 'DRE Gerencial') {
          // If the document is explicitly a BP document, ignore it completely for DRE
          if (docT === 'bp' || docT === 'balanço patrimonial') return false;
          
          // Accept the entry if: it comes from a DRE or DRE Gerencial document (document-level type)
          // OR if it has a row-level type of 'receitas'/'despesas'
          const isFromDREDoc = docT === 'dre' || docT === 'dre gerencial';
          const isDRERow = ['receitas', 'despesas'].includes(t);
          return isFromDREDoc || isDRERow;
        } else if (type === 'BP' || type === 'Balanço Patrimonial') {
          // If the document is explicitly a DRE document, ignore it completely for BP
          if (docT === 'dre' || docT === 'dre gerencial') return false;
          
          const isFromBPDoc = docT === 'bp' || docT === 'balanço patrimonial';
          const isBPRow = ['ativo', 'passivo', 'patrimônio líquido', 'pl'].includes(t);
          return isFromBPDoc || isBPRow;
        }
        return entry.docType === type;
      });
      
      // DEDUPLICAÇÃO DE DOCUMENTOS:
      // Se houver documentos do tipo 'batch' (novos salvamentos), pegamos apenas o mais recente.
      // Se forem linhas 'flat' (legado), mantemos todas. Se houver batch E flat, o batch mais recente vence.
      const batchEntries = filteredEntries.filter(e => e.isBatch);
      const flatEntries = filteredEntries.filter(e => !e.isBatch);
      
      let finalEntries: any[] = [];
      let finalDocIds = ids;

      if (batchEntries.length > 0) {
        const docIdsPresent = [...new Set(batchEntries.map(e => e.docId))];
        if (docIdsPresent.length > 1) {
          let latestDocId = docIdsPresent[0];
          let maxTime = 0;

          docIdsPresent.forEach(docId => {
            const entry = batchEntries.find(e => e.docId === docId);
            if (entry && entry.createdAt) {
              if (typeof entry.createdAt.toMillis === 'function') {
                const time = entry.createdAt.toMillis();
                if (time > maxTime) {
                  maxTime = time;
                  latestDocId = docId;
                }
              } else if (entry.createdAt.seconds) {
                const time = entry.createdAt.seconds * 1000;
                if (time > maxTime) {
                  maxTime = time;
                  latestDocId = docId;
                }
              }
            } else if (entry) {
              // Se createdAt for nulo ou ausente, é um Timestamp do servidor pendente, logo é o mais recente.
              maxTime = Infinity;
              latestDocId = docId;
            }
          });

          if (maxTime === 0) {
            latestDocId = docIdsPresent[docIdsPresent.length - 1];
          }

          finalEntries = batchEntries.filter(e => e.docId === latestDocId);
          finalDocIds = [latestDocId];
        } else {
          finalEntries = batchEntries;
          finalDocIds = docIdsPresent;
        }
        
        // Verificação Crítica: se o batch mais recente for apenas uma casca vazia (ex: salvo por acidente)
        // e existirem dados legados (flat), nós restauramos os dados legados.
        const hasRealData = finalEntries.some(e => (Number(e.value) || Number(e.val) || Number(e.valor) || 0) !== 0);
        if (!hasRealData && flatEntries.length > 0) {
          finalEntries = flatEntries;
          finalDocIds = [...new Set(flatEntries.map(e => e.docId))];
        }
      } else {
        // Se não houver nenhum batch document, o histórico do cliente é feito totalmente de flat rows
        finalEntries = flatEntries;
        finalDocIds = [...new Set(flatEntries.map(e => e.docId))];
      }

      console.log(`[DEBUG USE_ANNUAL_DATA] After deduplication for ${type}, kept ${finalEntries.length} entries.`);

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
