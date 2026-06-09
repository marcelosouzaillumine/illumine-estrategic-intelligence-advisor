export class BalanceSheetHistoricalContaminationAudit {
  static audit(selectedYear: number, rawData: any): { isContaminated: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // Check if rawData explicitly contains historical summaries matching a different year
    if (rawData.rawFinancialData?.bpSummary?.exerciseYear && rawData.rawFinancialData.bpSummary.exerciseYear !== selectedYear) {
      violations.push('HISTORICAL_CONTAMINATION_DETECTED: bpSummary exerciseYear mismatch.');
    }

    if (rawData.bpSummary?.exerciseYear && rawData.bpSummary.exerciseYear !== selectedYear) {
      violations.push('HISTORICAL_CONTAMINATION_DETECTED: fallback bpSummary exerciseYear mismatch.');
    }

    // Check if Advisory context carries an old year
    if (rawData.context?.year && rawData.context.year !== selectedYear) {
      violations.push('HISTORICAL_CONTAMINATION_DETECTED: Advisory context year mismatch.');
    }

    return {
      isContaminated: violations.length > 0,
      violations
    };
  }
}
