import { v4 as uuidv4 } from 'uuid';
import { AdvisoryTraceNode } from './observability-types';

export class AdvisoryDecisionTrace {
  private traces: AdvisoryTraceNode[] = [];

  public recordDecision(decision: string, criticalInputs: string[], causalPath: string[]) {
    this.traces.push({
      advisoryId: `adv-${uuidv4()}`,
      decision,
      criticalInputs,
      causalPath,
      timestamp: new Date().toISOString()
    });
  }

  public getTrace(): AdvisoryTraceNode[] {
    return this.traces;
  }
}
