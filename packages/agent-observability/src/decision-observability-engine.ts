export interface DecisionTrace {
  decisionId: string;
  recommendation: string;
  humanApprovalStatus: 'APPROVED' | 'REJECTED';
  executionTraceHash: string;
  financialImpactBrl: number;
}

export class DecisionObservabilityEngine {
  private traces = new Map<string, DecisionTrace>();

  public recordTrace(trace: DecisionTrace): void {
    this.traces.set(trace.decisionId, trace);
  }

  public getTrace(decisionId: string): DecisionTrace | undefined {
    return this.traces.get(decisionId);
  }
}

export const decisionObservabilityEngine = new DecisionObservabilityEngine();
