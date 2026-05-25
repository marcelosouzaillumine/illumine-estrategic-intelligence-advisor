import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export type RuntimeEventName = 
  | 'RUNTIME_STARTED'
  | 'DATA_VALIDATION_STARTED'
  | 'DATA_VALIDATION_FAILED'
  | 'CONSOLIDATION_STARTED'
  | 'CONSOLIDATION_COMPLETED'
  | 'ADVISORY_STARTED'
  | 'ADVISORY_COMPLETED'
  | 'CONFIDENCE_DEGRADED'
  | 'GOVERNANCE_BLOCK_TRIGGERED'
  | 'EXECUTION_FAILED'
  | 'EXECUTION_COMPLETED';

export interface RuntimeLogEvent {
  id: string;
  executionId: string;
  eventName: RuntimeEventName;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class RuntimeExecutionLogger {
  static async logEvent(executionId: string, eventName: RuntimeEventName, metadata?: Record<string, any>): Promise<void> {
    try {
      const id = crypto.randomUUID();
      const event: RuntimeLogEvent = {
        id,
        executionId,
        eventName,
        timestamp: new Date().toISOString(),
        metadata
      };
      // Em produção massiva, isso deveria ser feito em batch ou em pub/sub. Para o Illumine MVP, usaremos append firestore direto.
      await setDoc(doc(db, 'runtime_logs', id), event);
    } catch (err) {
      console.error('[RuntimeExecutionLogger] Failed to log event:', err);
    }
  }
}
