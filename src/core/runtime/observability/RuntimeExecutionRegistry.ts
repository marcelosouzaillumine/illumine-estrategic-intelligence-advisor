import { collection, doc, setDoc, getDocs, query, where, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { RuntimeExecutionRecord } from './observability-types';

export class RuntimeExecutionRegistry {
  static async registerExecution(record: RuntimeExecutionRecord): Promise<void> {
    try {
      await setDoc(doc(db, 'runtime_executions', record.executionId), record);
    } catch (err: unknown) {
      console.error('[RuntimeExecutionRegistry] Error registering execution:', err);
      // Logger passivo: não quebra a aplicação se o log falhar, mas loga local.
    }
  }

  static log(entry: any): void {
    console.error('[RuntimeExecutionRegistry] Fiduciary Violation Logged:', entry);
  }

  static async getExecution(executionId: string): Promise<RuntimeExecutionRecord | null> {
    try {
      const snap = await getDoc(doc(db, 'runtime_executions', executionId));
      if (!snap.exists()) return null;
      return snap.data() as RuntimeExecutionRecord;
    } catch (err: unknown) {
      console.error('[RuntimeExecutionRegistry] Error getting execution:', err);
      return null;
    }
  }

  static async listExecutionsByGroup(groupId: string): Promise<RuntimeExecutionRecord[]> {
    try {
      const q = query(
        collection(db, 'runtime_executions'),
        where('groupId', '==', groupId),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as RuntimeExecutionRecord);
    } catch (err: unknown) {
      console.error('[RuntimeExecutionRegistry] Error listing executions:', err);
      return [];
    }
  }

  static async listAllExecutions(): Promise<RuntimeExecutionRecord[]> {
    try {
      const q = query(
        collection(db, 'runtime_executions'),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as RuntimeExecutionRecord);
    } catch (err: unknown) {
      console.error('[RuntimeExecutionRegistry] Error listing all executions:', err);
      return [];
    }
  }
}
