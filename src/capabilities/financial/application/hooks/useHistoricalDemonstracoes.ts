import { useState, useEffect, useCallback } from 'react';
import { persistenceContainer } from '../../../../infrastructure/container/persistenceContainer';


export interface FinancialEntry {
  id: string;
  docId: string;
  docType: string;
  year: number;
  month?: number;
  conta: string;
  valor: number;
  val: number;
  type: string;
  category?: string;
  status?: string;
}

export function useHistoricalDemonstracoes(clientId: string, currentYear: number) {
  const [dbData, setDbData] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId || !currentYear) return;
    setLoading(true);
    setError(null);
    try {
      // O usuário pediu o ano em curso e os últimos 5 anos (total 6 anos)
      const targetYears = [
        currentYear,
        currentYear - 1,
        currentYear - 2,
        currentYear - 3,
        currentYear - 4,
        currentYear - 5
      ];

      const { docs } = await persistenceContainer.financial.getEntriesInYears(clientId, targetYears);

      if (isCancelled.current) return;

      const allEntries: FinancialEntry[] = [];
      const validTypes = ['DRE', 'BP', 'Balanço Patrimonial', 'DRE Contábil', 'DFC', 'DLPA', 'DRE Gerencial'];

      docs.forEach(docData => {
        const docId = docData.id;

        // Only show approved or legacy (without status)
        if (docData.status === 'pending' || docData.status === 'rejected') return;
        
        // Filter out types we don't need for this report
        if (!validTypes.includes(docData.type)) return;

        if (Array.isArray(docData.data)) {
          let lastType = 'ativo';
          docData.data.forEach((entry: any) => {
            const entryType = entry.type || entry.tipo || lastType;
            lastType = entryType;

            allEntries.push({
              ...entry,
              id: `${docId}_${entry.category || Math.random()}`,
              docId: docId,
              docType: docData.type,
              year: docData.year,
              month: docData.month,
              conta: entry.category,
              valor: entry.value,
              val: entry.value,
              type: entryType.toLowerCase()
            });
          });
        } else {
          allEntries.push({
            ...docData,
            id: docId,
            docId: docId,
            docType: docData.type,
            year: docData.year,
            month: docData.month,
            conta: docData.category,
            valor: docData.value,
            val: docData.value,
            type: (docData.type || docData.tipo || 'ativo').toLowerCase()
          });
        }
      });

      // Deduplicate documents if multiple versions exist for the same year/month/type
      // Keep the latest one based on createdAt, or just the last one in the array
      // This is a simplified deduplication just keeping the last docId seen for a specific combination
      const uniqueDocsMap = new Map<string, string>(); // key: type_year_month, value: docId
      allEntries.forEach(entry => {
        const key = `${entry.docType}_${entry.year}_${entry.month || 0}`;
        uniqueDocsMap.set(key, entry.docId); // overwrites with later ones
      });

      const allowedDocIds = new Set(uniqueDocsMap.values());
      const finalEntries = allEntries.filter(e => allowedDocIds.has(e.docId));

      setDbData(finalEntries);
    } catch (e: any) {
      if (!isCancelled.current) {
        console.error(e);
        setError((e instanceof Error ? e.message : String(e)) || 'Erro ao carregar dados financeiros históricos');
      }
    } finally {
      if (!isCancelled.current) setLoading(false);
    }
  }, [clientId, currentYear]);

  useEffect(() => {
    const isCancelled = { current: false };
    fetchData(isCancelled);
    return () => { isCancelled.current = true; };
  }, [fetchData]);

  return { dbData, loading, error, refetch: () => fetchData({ current: false }) };
}
