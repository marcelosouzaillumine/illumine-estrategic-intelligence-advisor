import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

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
      await setDoc(doc(db, 'scenario_logs', id), event);
    } catch (err) {
      console.error('[ScenarioExecutionLogger] Failed to log event:', err);
    }
  }
}
