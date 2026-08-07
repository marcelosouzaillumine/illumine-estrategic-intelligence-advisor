import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { ExecutiveOffice } from '../offices/ExecutiveOffice';
import { ExecutiveProductType } from '../../products/ExecutiveProductType';

describe('Balance Sheet Compliance Regression', () => {
  it('must permanently secure Balance Sheet Intelligence as an INTELLIGENCE_PRODUCT', () => {
    expect(FinancialPositionProduct.office).toBe(ExecutiveOffice.CFO_OFFICE);
    expect(FinancialPositionProduct.productType).toBe(ExecutiveProductType.INTELLIGENCE_PRODUCT);
    expect(FinancialPositionProduct.advisoryLevel).toBe('GUIDANCE');
    expect(FinancialPositionProduct.experience.rules.decisionAuthority).toBe(false);
  });
  
  it('must not contain decision components in the hierarchy', () => {
    const allComponents = FinancialPositionProduct.experience.layers.map(h => h.rootComponentId);
    // Explicitly enforce that the old ExecutivePlan is gone from the hierarchy.
    expect(allComponents).not.toContain('BalanceSheetExecutivePlan');
  });
});
