import { describe, it, expect } from 'vitest';
import { ExecutiveOffice } from '../offices/ExecutiveOffice';
import { ExecutiveProductType } from '../../products/ExecutiveProductType';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { DecisionRoomProduct } from '../../products/board/DecisionRoomProduct';

describe('Governance Decision Boundary Governance', () => {
  it('CFO_OFFICE governance products must not contain decision authority', () => {
    expect(FinancialPositionProduct.office).toBe(ExecutiveOffice.CFO_OFFICE);
    expect(FinancialPositionProduct.productType).toBe(ExecutiveProductType.INTELLIGENCE_PRODUCT);
    expect(FinancialPositionProduct.experience.rules.decisionAuthority).toBe(false);
  });

  it('GOVERNANCE_PRODUCT must not carry approval semantics in its configuration', () => {
    // We exclude the 'rules' object from this stringification because it legitimately 
    // contains permission flags like 'canExecute: false' and 'canRecommend: false' 
    // to explicitly forbid actions. The intent is to ensure the product metadata 
    // and purpose do not carry action semantics.
    const serializedConfig = JSON.stringify(FinancialPositionProduct, (key, value) => {
      if (key === 'rules') return undefined;
      return value;
    }).toLowerCase();
    
    // Verbos decisórios proibidos para um produto de Inteligência
    expect(serializedConfig).not.toContain('approve');
    expect(serializedConfig).not.toContain('decide');
    expect(serializedConfig).not.toContain('authorize');
    expect(serializedConfig).not.toContain('execute');
  });

  it('Only BOARD_GOVERNANCE products should possess decision authority', () => {
    // Assuming DecisionRoomProduct represents the Board Intelligence
    expect(DecisionRoomProduct.office).toBe(ExecutiveOffice.BOARD_INTELLIGENCE);
    expect(DecisionRoomProduct.productType).toBe(ExecutiveProductType.DECISION_PRODUCT);
    expect(DecisionRoomProduct.experience.rules.decisionAuthority).toBe(true);
  });
});
