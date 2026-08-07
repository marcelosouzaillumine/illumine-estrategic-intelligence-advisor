import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { ExecutiveExperienceValidator } from '../../constitution/ExecutiveExperienceValidator';

describe('Hierarchy Regression', () => {
  it('validates that FinancialPositionProduct strictly follows the hierarchy', () => {
    // If the product broke the rules (e.g. Evidence before Summary), this would throw.
    expect(() => {
      ExecutiveExperienceValidator.validateExperience(FinancialPositionProduct);
    }).not.toThrow();
  });
});
