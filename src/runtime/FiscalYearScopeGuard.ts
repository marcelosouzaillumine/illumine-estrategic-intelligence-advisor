export function assertNoFutureYearLeakage(records: any[], selectedYear: number): { violation: string, severity: 'CRITICAL', yearsDetected: number[] } | null {
  const selectedYearNum = Number(selectedYear);
  const leakage = records.filter(r => Number(r.year) > selectedYearNum);
  
  if (leakage.length > 0) {
    return {
      violation: 'FUTURE_YEAR_DATA_LEAKAGE',
      severity: 'CRITICAL',
      yearsDetected: [...new Set(leakage.map(r => Number(r.year)))]
    };
  }
  return null;
}
