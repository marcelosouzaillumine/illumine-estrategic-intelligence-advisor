import { BalanceSheetGovernanceOutput } from './BalanceSheetGovernanceOutput';

export class BalanceSheetGovernanceOutputValidator {
  /**
   * Validates the complete output contract before presentation.
   */
  public static validate(output: BalanceSheetGovernanceOutput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!output.exerciseYear) errors.push('Missing exerciseYear');
    if (output.sourceStatement !== 'BALANCE_SHEET') errors.push('sourceStatement must be BALANCE_SHEET');
    if (!output.indicators || Object.keys(output.indicators).length === 0) errors.push('Missing indicators');
    if (!output.primaryRecommendation || !output.primaryRecommendation.text) errors.push('Missing primaryRecommendation');
    if (!output.validation) errors.push('Missing validation block');
    if (!output.explainability) errors.push('Missing explainability block');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
