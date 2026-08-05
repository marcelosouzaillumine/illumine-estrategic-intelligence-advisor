import { logger } from "../services/logging/InstitutionalLogger";
import { useState, useEffect, useCallback } from 'react';
import { FinancialStatementLike, FinancialEntryLike } from '../types/contracts';
import { persistenceContainer } from '../infrastructure/container/persistenceContainer';
import { buildHistoricalSeries, HistoricalFinancialSeries } from '../core/adapters/historical-series-adapter';


export function useFinancialData(clientId: string, year: number, month: number, type: 'DRE' | 'BP' | 'CAIXA' | 'DRE Gerencial' | 'DFC' | 'DLPA' | 'Balanço Patrimonial') {
  if ((globalThis as any).__mockUseFinancialData) {
    return (globalThis as any).__mockUseFinancialData(clientId, year, month, type);
  }
  const [dbData, setDbData] = useState<FinancialEntryLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const queryTypes = ((type as string) === 'BP' || (type as string) === 'Balanço Patrimonial')
        ? ['BP', 'Balanço Patrimonial']
        : ((type as string) === 'DRE' || (type as string) === 'DRE Gerencial')
          ? ['DRE', 'DRE Gerencial']
          : [type];

      const { docs } = await persistenceContainer.financial.getEntriesByTypesAndYear(clientId, queryTypes, year);
      
      if (isCancelled.current) return;

      const allEntries: FinancialEntryLike[] = [];
      docs.forEach(docDataRaw => {
        const docData = docDataRaw as FinancialStatementLike;
        const docId = docDataRaw.id;
        
        // Exibe dados pendentes, aprovados ou legados. Apenas ignora rejeitados ou arquivados.
        if (docData.status === 'rejected' || docData.status === 'archived') return;

        // In-memory month filtering for data that has a month
        if (month > 0 && docData.month !== undefined && docData.month !== 0 && docData.month !== month) return;

        if (Array.isArray(docData.data)) {
          docData.data.forEach((entry: FinancialEntryLike) => {
            allEntries.push({
              ...entry,
              id: entry.id ? entry.id : `${docId}_${entry.category}`,
              conta: entry.category,
              valor: entry.value,
              val: entry.value
            });
          });
        } else {
           allEntries.push({
             ...docData,
             id: docId,
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
  if ((globalThis as any).__mockUseAllFinancialData) {
    return (globalThis as any).__mockUseAllFinancialData(clientId);
  }
  const [dbData, setDbData] = useState<FinancialEntryLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalFinancialSeries, setHistoricalFinancialSeries] = useState<HistoricalFinancialSeries | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const { docs } = await persistenceContainer.financial.getAllEntriesForClient(clientId);
      
      if (isCancelled.current) return;

      const allEntries: FinancialEntryLike[] = [];
      docs.forEach(docDataRaw => {
        const docData = docDataRaw as FinancialStatementLike;
        const docId = docDataRaw.id;

        // Exibe dados pendentes, aprovados ou legados. Apenas ignora rejeitados ou arquivados.
        if (docData.status === 'rejected' || docData.status === 'archived') return;

        if (Array.isArray(docData.data)) {
          let lastType = 'ativo';
          docData.data.forEach((entry: FinancialEntryLike) => {
            const innerType = entry.type || entry.tipo || lastType;
            lastType = innerType;
            allEntries.push({
              ...entry,
              id: entry.id ? entry.id : `${docId}_${entry.category}`,
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
            id: docId,
            ...docData,
            conta: docData.category,
            valor: docData.value,
            val: docData.value
          });
        }
      });
      setDbData(allEntries);
      const series = buildHistoricalSeries(clientId, allEntries);
      setHistoricalFinancialSeries(series);
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
  if ((globalThis as any).__mockUseAnnualFinancialData) {
    return (globalThis as any).__mockUseAnnualFinancialData(clientId, year, type);
  }
  const [dbData, setDbData] = useState<FinancialEntryLike[]>([]);
  const [docIds, setDocIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    try {
      const { docs } = await persistenceContainer.financial.getEntriesByYear(clientId, year);

      if (isCancelled.current) return;

      const allEntries: FinancialEntryLike[] = [];
      const ids: string[] = [];
      
      console.log(`[DEBUG USE_ANNUAL_DATA] Fetching ${type} for ${clientId} year ${year}. Found ${docs.length} docs.`);

      docs.forEach(docDataRaw => {
        const docData = docDataRaw as FinancialStatementLike;
        const docId = docDataRaw.id;

        // Exibe dados pendentes, aprovados ou legados. Apenas ignora rejeitados ou arquivados.
        if (docData.status === 'rejected' || docData.status === 'archived') return;

        ids.push(docId);
        if (Array.isArray(docData.data)) {
          // Para Balanço Patrimonial, tentamos inferir o tipo se estiver faltando
          let lastType = 'ativo';
          docData.data.forEach((entry: FinancialEntryLike) => {
            const entryType = entry.type || entry.tipo || lastType;
            lastType = entryType;

            allEntries.push({
              ...entry,
              id: entry.id ? entry.id : `${docId}_${entry.category}`,
              docId: docId,
              docType: docData.type,
              createdAt: docData.createdAt,
              conta: entry.category,
              valor: entry.value,
              val: entry.value,
              type: entryType.toLowerCase(),
              year: docData.year,
              ano: docData.year,
              isBatch: true
            });
          });
        } else {
          allEntries.push({
            ...docData,
            id: docId,
            docId: docId,
            docType: docData.type,
            createdAt: docData.createdAt,
            conta: docData.category || docData.conta,
            valor: docData.value || docData.valor || docData.val,
            val: docData.value || docData.valor || docData.val,
            type: (String(docData.type || docData.tipo || 'ativo')).toLowerCase(),
            year: docData.year,
            ano: docData.year,
            isBatch: false
          });
        }
      });

      const filteredEntries = allEntries.filter(entry => {
        const t = (entry.type || '').toLowerCase();
        const docT = (entry.docType || '').toLowerCase();
        const reqT = type.toLowerCase();
        
        if (docT) {
          if (reqT === 'bp' || reqT === 'balanço patrimonial') {
            return docT === 'bp' || docT === 'balanço patrimonial';
          }
          if (reqT === 'dre' || reqT === 'dre gerencial') {
            return docT === 'dre' || docT === 'dre gerencial';
          }
          if (reqT === 'dfc' || reqT === 'dfc contabil' || reqT === 'demonstração dos fluxos de caixa' || reqT === 'fluxo de caixa') {
            return docT === 'dfc' || docT === 'dfc contabil' || docT === 'demonstracao dos fluxos de caixa' || docT === 'demonstração dos fluxos de caixa';
          }
          if (reqT === 'dlpa') {
            return docT === 'dlpa';
          }
          return docT === reqT;
        }
        
        // Se reqT for dfc ou dlpa, eles *sempre* deveriam ter docT nas novas versões.
        // Evita que fallback os pegue acidentalmente.
        if (reqT === 'dfc' || reqT === 'dlpa') {
           return false;
        }

        if (reqT === 'dre' || reqT === 'dre gerencial') {
          return ['receitas', 'despesas'].includes(t) || t === 'dre' || t === 'dre gerencial';
        } else if (reqT === 'bp' || reqT === 'balanço patrimonial') {
          return ['ativo', 'passivo', 'patrimônio líquido', 'pl', 'bp', 'balanço patrimonial'].includes(t);
        }
        return false;
      });
      
      // DEDUPLICAÇÃO DE DOCUMENTOS:
      // Se houver documentos do tipo 'batch' (novos salvamentos), pegamos apenas o mais recente.
      // Se forem linhas 'flat' (legado), mantemos todas. Se houver batch E flat, o batch mais recente vence.
      const batchEntries = filteredEntries.filter(e => e.isBatch);
      const flatEntries = filteredEntries.filter(e => !e.isBatch);
      
      let finalEntries: FinancialEntryLike[] = [];
      let finalDocIds = ids as string[];

      if (batchEntries.length > 0) {
        const docIdsPresent = [...new Set(batchEntries.map(e => e.docId))];
        let latestDocId = docIdsPresent[0];
        let maxTime = 0;
        let validDocIds = [...docIdsPresent];

        // --- CORRUPTION AUTO-RECOVERY ---
        // Se estamos buscando BP, verifique se o docId selecionado não contém linhas de DFC por engano
        if (type === 'BP' || type === 'Balanço Patrimonial') {
          validDocIds = docIdsPresent.filter(docId => {
            const entriesForDoc = batchEntries.filter(e => e.docId === docId);
            const isCorrupted = entriesForDoc.some(e => 
              ['receitas', 'despesas', 'atividade operacional', 'atividade de financiamento', 'atividade de investimento'].includes((e.type || e.tipo || '').toLowerCase()) ||
              ['receitas', 'despesas'].includes((e.category || e.conta || '').toLowerCase())
            );
            if (isCorrupted) {
              logger.warn('Documento BP descartado pois contém dados de DFC/DRE', { docId });
              return false;
            }
            return true;
          });
        }
        // ---------------------------------

        if (validDocIds.length > 0) {
          if (validDocIds.length > 1) {
            validDocIds.forEach(docId => {
              const entry = batchEntries.find(e => e.docId === docId);
              if (entry && entry.createdAt) {
                if (entry.createdAt && typeof (entry.createdAt as any).toMillis === 'function') {
                  const time = (entry.createdAt as any).toMillis();
                  if (time > maxTime) {
                    maxTime = time;
                    latestDocId = docId;
                  }
                } else if (entry.createdAt && (entry.createdAt as any).seconds) {
                  const time = (entry.createdAt as any).seconds * 1000;
                  if (time > maxTime) {
                    maxTime = time;
                    latestDocId = docId;
                  }
                }
              } else if (entry) {
                maxTime = Infinity;
                latestDocId = docId;
              }
            });

            if (maxTime === 0) {
              latestDocId = validDocIds[validDocIds.length - 1];
            }

            finalEntries = batchEntries.filter(e => e.docId === latestDocId);
            finalDocIds = [latestDocId as string];
          } else {
            finalEntries = batchEntries.filter(e => e.docId === validDocIds[0]);
            finalDocIds = validDocIds as string[];
          }
        } else {
           // Se todos os batches estavam corrompidos, tentamos cair para flatEntries
           finalEntries = [];
        }
        
        // Verificação Crítica: se o batch mais recente for apenas uma casca vazia (ex: salvo por acidente)
        // e existirem dados legados (flat), nós restauramos os dados legados.
        const hasRealData = finalEntries.some(e => (Number(e.value) || Number(e.val) || Number(e.valor) || 0) !== 0);
        if ((!hasRealData || finalEntries.length === 0) && flatEntries.length > 0) {
          finalEntries = flatEntries;
          finalDocIds = [...new Set(flatEntries.map(e => String(e.docId)))];
        }
      } else {
        // Se não houver nenhum batch document, o histórico do cliente é feito totalmente de flat rows
        finalEntries = flatEntries;
        finalDocIds = [...new Set(flatEntries.map(e => String(e.docId)))];
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
