import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialIntelligenceCoordinator } from '../FinancialIntelligenceCoordinator';

describe('FinancialGovernanceCoordinator', () => {
  let coordinator: FinancialIntelligenceCoordinator;

  beforeEach(() => {
    coordinator = new FinancialIntelligenceCoordinator();
  });

  it('should orchestrate contexts and generate a Unified Governance Context', () => {
    const mockCashContext = { signals: { attentionPoints: ['Lucro não convertido em caixa'] } };
    const mockPerfContext = { signals: { attentionPoints: ['Deterioração de Margem'] } };

    const result = coordinator.orchestrate('2025', {}, mockPerfContext, mockCashContext, {});

    expect(result.criticalFindings.length).toBe(2);
    expect(result.financialHealthProfile).toBe('LIQUIDITY_STRESS');
    expect(result.executiveQuestions.length).toBeGreaterThan(0);
    expect(result.history.length).toBe(1);
    expect(result.history[0].period).toBe('2025');
  });
});
