import { describe, it, expect } from 'vitest';
import { FinancialIntelligenceCoordinator } from '../FinancialIntelligenceCoordinator';

describe('EnterpriseFinancialIntelligence', () => {
  it('should map the end-to-end orchestration scenario for Wave 2.0', () => {
    const coordinator = new FinancialIntelligenceCoordinator();
    
    // Simulating past context (2024)
    coordinator.orchestrate('2024', {}, {}, {}, {});

    // Simulating present context (2025) with risks
    const mockCashContext = { signals: { attentionPoints: ['Lucro não convertido em caixa'] } };
    const result = coordinator.orchestrate('2025', {}, {}, mockCashContext, {});

    // The orchestrator has successfully captured the present and remembered the past
    expect(result.history.length).toBe(2);
    expect(result.history[0].period).toBe('2024');
    expect(result.history[1].period).toBe('2025');
    
    // This result object is exactly what the Wave 2.0 Agent will consume
    expect(result.financialHealthProfile).toBe('LIQUIDITY_STRESS');
    expect(result.executiveQuestions[0]).toBeTruthy();
  });
});
