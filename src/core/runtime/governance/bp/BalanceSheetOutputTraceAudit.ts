export interface BalanceSheetTraceRecord {
  sourceEngine: string;
  exerciseYear: number;
  statementSource: string;
  outputField: string;
  timestamp: string;
}

export class BalanceSheetOutputTraceAudit {
  /**
   * Generates a trace record for a specific output field.
   */
  public static trace(
    sourceEngine: string,
    exerciseYear: number,
    statementSource: string,
    outputField: string
  ): BalanceSheetTraceRecord {
    return {
      sourceEngine,
      exerciseYear,
      statementSource,
      outputField,
      timestamp: new Date().toISOString()
    };
  }
}
