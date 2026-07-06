import { BPSummary } from '../../../../lib/bpEngine';
import { BalanceSheetGovernanceOutput } from './BalanceSheetGovernanceOutput';

export class BalanceSheetTemporalIntegrityGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Validates that all inputs correspond to the requested execution year.
   */
  public static validate(
    targetYear: number,
    summary: BPSummary,
    texts: { label: string; content: string }[]
  ): void {
    // We assume BPSummary doesn't have an explicit year field in this context,
    // but the guard can validate that narrations don't contain wrong years.
    
    const nextYear = targetYear + 1;
    const prevYears = [targetYear - 1, targetYear - 2, targetYear - 3];

    for (const textItem of texts) {
      // Look for years that are not the target year
      for (const year of prevYears) {
        if (textItem.content.includes(year.toString())) {
          throw new Error(`[TEMPORAL_INTEGRITY_VIOLATION] Found reference to past year ${year} in ${textItem.label} for target year ${targetYear}.`);
        }
      }

      if (textItem.content.includes(nextYear.toString())) {
         throw new Error(`[TEMPORAL_INTEGRITY_VIOLATION] Found reference to future year ${nextYear} in ${textItem.label} for target year ${targetYear}.`);
      }
    }
  }

  /**
   * Final verification before emitting the BP Output Contract.
   */
  public static verifyOutput(
    targetYear: number,
    output: BalanceSheetGovernanceOutput
  ): void {
    if (output.exerciseYear !== targetYear) {
      output.validation.severity = 'BLOCKING';
      output.validation.findings.push(`[TEMPORAL_INTEGRITY_VIOLATION] Output exerciseYear (${output.exerciseYear}) does not match targetYear (${targetYear}).`);
      throw new Error(`[TEMPORAL_INTEGRITY_VIOLATION] Output exerciseYear (${output.exerciseYear}) does not match targetYear (${targetYear}).`);
    }

    const prevYears = [targetYear - 1, targetYear - 2, targetYear - 3];
    const textsToCheck = [
      output.primaryRecommendation.text,
      ...output.primaryRecommendation.rationale,
      ...output.secondaryAdvisories.map(a => a.text),
      output.explainability.reason
    ];

    for (const text of textsToCheck) {
      for (const year of prevYears) {
        if (text.includes(year.toString())) {
          output.validation.severity = 'BLOCKING';
          output.validation.findings.push(`[TEMPORAL_INTEGRITY_VIOLATION] Found reference to past year ${year} in output narratives.`);
          throw new Error(`[TEMPORAL_INTEGRITY_VIOLATION] Found reference to past year ${year} in output narratives.`);
        }
      }
    }
  }
}
