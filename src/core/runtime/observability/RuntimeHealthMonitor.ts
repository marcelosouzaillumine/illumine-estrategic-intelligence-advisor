import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { RuntimeHealthSnapshot, RuntimeExecutionRecord } from './observability-types';
import { RuntimeExecutionRegistry } from './RuntimeExecutionRegistry';

export class RuntimeHealthMonitor {
  static async generateSnapshot(): Promise<RuntimeHealthSnapshot> {
    try {
      // Analisa as últimas 100 execuções para calcular a saúde do motor
      const executions = await RuntimeExecutionRegistry.listAllExecutions();
      const recent = executions.slice(0, 100);

      const totalExecutions = recent.length;
      let totalDuration = 0;
      let failed = 0;
      let criticalViolationsDetected = 0;
      const anomalies: string[] = [];

      for (const exec of recent) {
        totalDuration += exec.runtimeDurationMs;
        if (exec.executionStatus === 'FAILED' || exec.executionStatus === 'BLOCKED') {
          failed++;
        }
        
        const hasCritical = exec.violations.some(v => v.severity === 'CRITICAL');
        if (hasCritical) criticalViolationsDetected++;

        // Detectar anomalia de tempo (Timeout estrito interno)
        if (exec.runtimeDurationMs > 5000) {
          anomalies.push(`Execution ${exec.executionId} excedeu 5s (${exec.runtimeDurationMs}ms).`);
        }
      }

      const snapshot: RuntimeHealthSnapshot = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        avgDurationMs: totalExecutions > 0 ? Number((totalDuration / totalExecutions).toFixed(2)) : 0,
        totalExecutions,
        failureRate: totalExecutions > 0 ? Number((failed / totalExecutions).toFixed(2)) : 0,
        criticalViolationsDetected,
        anomalies
      };

      await setDoc(doc(db, 'runtime_health_snapshots', snapshot.id), snapshot);
      return snapshot;

    } catch (err: any) {
      console.error('[RuntimeHealthMonitor] Error generating snapshot:', err);
      throw err;
    }
  }

  static async getLatestSnapshot(): Promise<RuntimeHealthSnapshot | null> {
    try {
      const q = query(
        collection(db, 'runtime_health_snapshots'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as RuntimeHealthSnapshot;
    } catch (err: any) {
      console.error('[RuntimeHealthMonitor] Error getting snapshot:', err);
      return null;
    }
  }
}
