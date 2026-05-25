import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ExecutionTrace } from './observability-types';

export class ExecutionTraceBuilder {
  private trace: ExecutionTrace;
  private currentStageStart: number = 0;
  private currentStageName: string = '';

  constructor(executionId: string) {
    this.trace = {
      executionId,
      stages: [],
      totalDurationMs: 0
    };
  }

  startStage(stageName: string) {
    this.currentStageName = stageName;
    this.currentStageStart = performance.now();
  }

  endStage(status: 'SUCCESS' | 'FAILED' | 'SKIPPED', metadata?: Record<string, any>) {
    const end = performance.now();
    const duration = end - this.currentStageStart;
    
    this.trace.stages.push({
      stageName: this.currentStageName,
      startedAt: new Date(Date.now() - duration).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Number(duration.toFixed(2)),
      status,
      metadata
    });
  }

  async flushAndSave(): Promise<ExecutionTrace> {
    let total = 0;
    for (const stage of this.trace.stages) {
      total += stage.durationMs;
    }
    this.trace.totalDurationMs = Number(total.toFixed(2));
    
    try {
      await setDoc(doc(db, 'runtime_traces', this.trace.executionId), this.trace);
    } catch (err) {
      console.error('[ExecutionTraceBuilder] Error saving trace:', err);
    }
    
    return this.trace;
  }

  static async getTrace(executionId: string): Promise<ExecutionTrace | null> {
    try {
      const snap = await getDoc(doc(db, 'runtime_traces', executionId));
      if (!snap.exists()) return null;
      return snap.data() as ExecutionTrace;
    } catch (err: any) {
      console.error('[ExecutionTraceBuilder] Error getting trace:', err);
      return null;
    }
  }
}
