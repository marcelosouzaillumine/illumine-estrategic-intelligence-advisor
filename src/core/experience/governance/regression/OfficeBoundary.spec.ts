import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { ExecutiveOffice } from '../offices/ExecutiveOffice';
import { ExecutiveProductType } from '../../products/ExecutiveProductType';

describe('Office Boundary Regression', () => {
  it('must ensure CFO_OFFICE products never have decision authority', () => {
    // If a product belongs to CFO_OFFICE, it cannot have decisionAuthority = true
    if (FinancialPositionProduct.office === ExecutiveOffice.CFO_OFFICE) {
      expect(FinancialPositionProduct.decisionAuthority).toBe(false);
    }
  });

  it('must ensure CFO_OFFICE products are never classified as DECISION_PRODUCT', () => {
    if (FinancialPositionProduct.office === ExecutiveOffice.CFO_OFFICE) {
      expect(FinancialPositionProduct.productType).not.toBe(ExecutiveProductType.DECISION_PRODUCT);
    }
  });
});
