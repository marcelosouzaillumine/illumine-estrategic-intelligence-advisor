import { useState, useCallback } from 'react';
import { FirestorePaginatedDataAdapter } from '../adapters/persistence/FirestorePaginatedDataAdapter';

interface UsePaginatedDataOptions {
  collectionName: string;
  filters: { field: string; operator: any; value: any }[];
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  pageSize?: number;
}

export function usePaginatedData<T = any>({
  collectionName,
  filters,
  orderByField,
  orderDirection = 'desc',
  pageSize = 10
}: UsePaginatedDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNextPage = useCallback(async (isReset = false) => {
    if (loading || (!hasMore && !isReset)) return;

    setLoading(true);
    setError(null);

    try {
      const result = await FirestorePaginatedDataAdapter.fetchPage<T>(
        collectionName,
        filters,
        orderByField,
        orderDirection,
        pageSize,
        !isReset ? lastDoc : null
      );

      if (isReset) {
        setData(result.docs);
      } else {
        setData(prev => [...prev, ...result.docs]);
      }

      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err: any) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(filters), orderByField, orderDirection, pageSize, lastDoc, loading, hasMore]);

  const reset = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    setData([]);
    fetchNextPage(true);
  }, [fetchNextPage]);

  return { data, loading, hasMore, error, fetchNextPage, reset };
}
