// src/core/runtime/observability/sinks/FirebaseRuntimeTelemetrySink.ts

import { RuntimeTelemetrySink, FailClosedTelemetryEvent, LatencyMetric, PayloadIntegrityCheck, LineageValidationEvent } from '../RuntimeTelemetrySink';
import { RuntimeLogEvent } from '../RuntimeExecutionLogger';
import { ExecutionTrace } from '../observability-types';
import { db } from '../../../lib/firebase';
import { collection, doc, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { blockedFirestoreWrite } from '../../../lib/blockedFirestoreWrite';

export class FirebaseRuntimeTelemetrySink implements RuntimeTelemetrySink {
  async logEvent(event: RuntimeLogEvent): Promise<void> {
    try {
      blockedFirestoreWrite(); // setDoc(doc(db, 'runtime_logs', event.id), event);
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error logging event', error);
    }
  }
  
  async saveTrace(trace: ExecutionTrace): Promise<void> {
    try {
      blockedFirestoreWrite(); // setDoc(doc(db, 'runtime_traces', trace.executionId), trace);
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error saving trace', error);
    }
  }
  
  async getTrace(executionId: string): Promise<ExecutionTrace | null> {
    try {
      const snap = await getDoc(doc(db, 'runtime_traces', executionId));
      if (snap.exists()) {
        return snap.data() as ExecutionTrace;
      }
      return null;
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error getting trace', error);
      return null;
    }
  }
  
  async recordExecutionTrace(trace: ExecutionTrace): Promise<void> {
    await this.saveTrace(trace);
  }
  
  async recordFailClosedEvent(event: FailClosedTelemetryEvent): Promise<void> {
    try {
      blockedFirestoreWrite(); // addDoc(collection(db, 'telemetry_fail_closed'), event);
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error recording fail closed', error);
    }
  }
  
  async recordLatencyMetric(metric: LatencyMetric): Promise<void> {
    try {
      blockedFirestoreWrite(); // addDoc(collection(db, 'telemetry_latency'), metric);
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error recording latency', error);
    }
  }
  
  async recordPayloadIntegrityCheck(check: PayloadIntegrityCheck): Promise<void> {
    try {
      blockedFirestoreWrite(); // addDoc(collection(db, 'telemetry_payload_integrity'), check);
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error recording payload integrity', error);
    }
  }
  
  async recordLineageValidation(validation: LineageValidationEvent): Promise<void> {
    try {
      blockedFirestoreWrite(); // addDoc(collection(db, 'telemetry_lineage_validation'), validation);
    } catch (error) {
      console.error('[FirebaseRuntimeTelemetrySink] Error recording lineage validation', error);
    }
  }
  
  async flush(): Promise<void> {
    // Firebase Web SDK handles flushing internally, but this allows for future expansion.
  }
}
