import { describe, it, expect } from 'vitest';
import { ExecutiveOffice } from '../offices/ExecutiveOffice';
import { ExecutiveProductType } from '../../products/ExecutiveProductType';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { DecisionRoomProduct } from '../../products/board/DecisionRoomProduct';

describe('Intelligence Decision Boundary Governance', () => {
  it('CFO_OFFICE intelligence products must not contain decision authority', () => {
    expect(FinancialPositionProduct.office).toBe(ExecutiveOffice.CFO_OFFICE);
    expect(FinancialPositionProduct.productType).toBe(ExecutiveProductType.INTELLIGENCE_PRODUCT);
    expect(FinancialPositionProduct.decisionAuthority).toBe(false);
  });

  it('INTELLIGENCE_PRODUCT must not carry approval semantics in its configuration', () => {
    const serializedConfig = JSON.stringify(FinancialPositionProduct).toLowerCase();
    
    // Verbos decisórios proibidos para um produto de Inteligência
    expect(serializedConfig).not.toContain('approve');
    expect(serializedConfig).not.toContain('decide');
    expect(serializedConfig).not.toContain('authorize');
    expect(serializedConfig).not.toContain('execute');
  });

  it('Only BOARD_INTELLIGENCE products should possess decision authority', () => {
    // Assuming DecisionRoomProduct represents the Board Intelligence
    expect(DecisionRoomProduct.office).toBe(ExecutiveOffice.BOARD_INTELLIGENCE);
    expect(DecisionRoomProduct.productType).toBe(ExecutiveProductType.DECISION_PRODUCT);
    expect(DecisionRoomProduct.decisionAuthority).toBe(true);
  });
});
