import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { DecisionRoomProduct } from '../../products/board/DecisionRoomProduct';

describe('Product Classification Regression', () => {
  it('must ensure all products have office, productType and advisoryLevel defined', () => {
    const products = [FinancialPositionProduct, DecisionRoomProduct];
    
    products.forEach(product => {
      expect(product.office).toBeDefined();
      expect(product.productType).toBeDefined();
      expect(product.advisoryLevel).toBeDefined();
      expect(product.experience.rules.decisionAuthority).toBeDefined();
    });
  });
});
