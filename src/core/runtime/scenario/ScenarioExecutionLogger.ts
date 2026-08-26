import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getErrorMessage } from '../../../types/runtime/RuntimeErrorGuards';

export type ScenarioEventName = 
  | 'SCENARIO_STARTED'
  | 'APPLYING_SHOCKS'
  | 'RUNNING_PROPAGATION'
  | 'SCENARIO_COMPLETED'
  | 'SCENARIO_FAILED';

export class ScenarioExecutionLogger {
  static async logEvent(executionId: string, eventName: ScenarioEventName, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const id = crypto.randomUUID();
      const event = {
        id,
        executionId,
        eventName,
        timestamp: new Date().toISOString(),
        metadata
      };
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(doc(db, 'scenario_logs', id), event);
    } catch (err: unknown) {
      console.error('[ScenarioExecutionLogger] Failed to log event:', getErrorMessage(err));
    }
  }
}
