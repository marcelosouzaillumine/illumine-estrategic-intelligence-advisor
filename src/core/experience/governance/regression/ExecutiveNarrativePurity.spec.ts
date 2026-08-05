import { describe, it, expect } from 'vitest';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { registerBalanceSheetComponents } from '../../registry/BalanceSheetComponentRegistration';

describe('Executive Narrative Purity Governance', () => {
  it('Financial Position Product must not offer executive plans (observacaoFinanceira, etc.)', () => {
    const serializedConfig = JSON.stringify(FinancialPositionProduct).toLowerCase();
    
    expect(serializedConfig).not.toContain('planfinanceiro');
    expect(serializedConfig).not.toContain('planoperacional');
    expect(serializedConfig).not.toContain('plangovernanca');
    expect(serializedConfig).not.toContain('recommendedaction');
  });

  it('Balance Sheet Registry must only contain semantic questions, not actions', () => {
    const registryString = registerBalanceSheetComponents.toString().toLowerCase() || '';
    
    expect(registryString).not.toContain('ação tática');
    expect(registryString).not.toContain('recomendação de ação');
    expect(registryString).not.toContain('balancesheetexecutiveplan');
  });
});
