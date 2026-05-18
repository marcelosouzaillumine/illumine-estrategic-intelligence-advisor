import { useState, useCallback } from 'react';
import { 
  query, 
  collection, 
  where, 
  getDocs, 
  limit, 
  startAfter, 
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNextPage = useCallback(async (isReset = false) => {
    if (loading || (!hasMore && !isReset)) return;

    setLoading(true);
    setError(null);

    try {
      const baseQuery = collection(db, collectionName);
      const queryConstraints: QueryConstraint[] = [
        ...filters.map(f => where(f.field, f.operator, f.value)),
        limit(pageSize)
      ];

      if (orderByField) {
        queryConstraints.push(orderBy(orderByField, orderDirection));
      }

      if (!isReset && lastDoc) {
        queryConstraints.push(startAfter(lastDoc));
      }

      const q = query(baseQuery, ...queryConstraints);
      const snapshot = await getDocs(q);

      const newDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as T[];

      if (isReset) {
        setData(newDocs);
      } else {
        setData(prev => [...prev, ...newDocs]);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === pageSize);
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
