import { FinancialExecutiveIntent } from './FinancialExecutiveIntent';

export class AgentReasoningTrace {
  private intent?: FinancialExecutiveIntent;
  private retrievedContextSummary?: string;
  private governanceLogs: string[] = [];
  
  public setIntent(intent: FinancialExecutiveIntent): void {
    this.intent = intent;
  }

  public setRetrievedContextSummary(summary: string): void {
    this.retrievedContextSummary = summary;
  }

  public addGovernanceLog(log: string): void {
    this.governanceLogs.push(log);
  }

  public getTraceReport(): any {
    return {
      intent: this.intent,
      retrievedContextSummary: this.retrievedContextSummary,
      governanceLogs: this.governanceLogs,
      timestamp: new Date().toISOString()
    };
  }
}
