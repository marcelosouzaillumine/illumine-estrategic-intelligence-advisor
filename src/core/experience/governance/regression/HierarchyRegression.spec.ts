import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { ExecutiveProductConstitution } from '../ExecutiveProductConstitution';

describe('Hierarchy Regression', () => {
  it('validates that FinancialPositionProduct strictly follows the hierarchy', () => {
    // If the product broke the rules (e.g. Evidence before Summary), this would throw.
    expect(() => {
      ExecutiveProductConstitution.validateProductContract(FinancialPositionProduct);
    }).not.toThrow();
  });
});
