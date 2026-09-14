import { query, collection, where, getDocs, limit, startAfter, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

export interface PaginatedFilters {
  field: string;
  operator: any;
  value: any;
}

export class FirestorePaginatedDataAdapter {
  static async fetchPage<T>(
    collectionName: string,
    filters: PaginatedFilters[],
    orderByField: string | undefined,
    orderDirection: 'asc' | 'desc',
    pageSize: number,
    lastDoc: any | null
  ): Promise<{ docs: T[], lastDoc: any | null, hasMore: boolean }> {
    const baseQuery = collection(db, collectionName);
    const queryConstraints: QueryConstraint[] = [
      ...filters.map(f => where(f.field, f.operator, f.value)),
      limit(pageSize)
    ];

    if (orderByField) {
      queryConstraints.push(orderBy(orderByField, orderDirection));
    }

    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }

    const q = query(baseQuery, ...queryConstraints);
    const snapshot = await getDocs(q);

    const newDocs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === pageSize;

    return { docs: newDocs, lastDoc: newLastDoc, hasMore };
  }
}
