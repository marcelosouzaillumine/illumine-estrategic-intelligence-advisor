import { collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { GovernanceViolationRecord } from './observability-types';

export class GovernanceViolationHistory {
  static async recordViolations(violations: GovernanceViolationRecord[]): Promise<void> {
    if (violations.length === 0) return;
    
    try {
      const promises = violations.map(violation => 
        setDoc(doc(db, 'governance_violations', violation.violationId), violation)
      );
      await Promise.all(promises);
    } catch (err: unknown) {
      console.error('[GovernanceViolationHistory] Error recording violations:', err);
    }
  }

  static async getViolationsByGroup(groupId: string): Promise<GovernanceViolationRecord[]> {
    try {
      const q = query(
        collection(db, 'governance_violations'),
        where('groupId', '==', groupId),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as GovernanceViolationRecord);
    } catch (err: unknown) {
      console.error('[GovernanceViolationHistory] Error getting violations:', err);
      return [];
    }
  }
}
