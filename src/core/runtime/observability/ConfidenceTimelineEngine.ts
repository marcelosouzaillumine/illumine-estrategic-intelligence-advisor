import { collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ConfidenceTimelineEntry } from './observability-types';

export class ConfidenceTimelineEngine {
  static async recordConfidence(entry: Omit<ConfidenceTimelineEntry, 'id'>): Promise<void> {
    try {
      const id = crypto.randomUUID();
      const newEntry: ConfidenceTimelineEntry = { ...entry, id };
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(doc(db, 'confidence_timeline', id), newEntry);
    } catch (err: unknown) {
      console.error('[ConfidenceTimelineEngine] Error recording confidence:', err);
    }
  }

  static async getHistoryByGroup(groupId: string): Promise<ConfidenceTimelineEntry[]> {
    try {
      const q = query(
        collection(db, 'confidence_timeline'),
        where('groupId', '==', groupId),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as ConfidenceTimelineEntry);
    } catch (err: unknown) {
      console.error('[ConfidenceTimelineEngine] Error getting history:', err);
      return [];
    }
  }
}
