export class BalanceSheetExerciseBindingGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static validate(selectedYear: number, summaryYear?: number): { isValid: boolean; violation?: string; severity?: 'BLOCKING'|'WARNING'; code?: string } {
    if (summaryYear == null && selectedYear != null) {
      return {
        isValid: true,
        severity: 'WARNING',
        code: 'SUMMARY_YEAR_INFERRED_FROM_SELECTED_YEAR'
      };
    }

    if (summaryYear !== selectedYear) {
      return { 
        isValid: false, 
        violation: 'EXERCISE_BINDING_VIOLATION',
        severity: 'BLOCKING',
        code: 'EXERCISE_BINDING_VIOLATION'
      };
    }

    return { isValid: true };
  }
}
