import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveFinancialAgent } from '../ExecutiveFinancialAgent';

describe('ExecutiveFinancialAgent', () => {
  let agent: ExecutiveFinancialAgent;

  beforeEach(() => {
    agent = new ExecutiveFinancialAgent();
  });

  it('should orchestrate a complete conversation flow governed by rules', () => {
    const mockContext = {
      criticalFindings: [{ finding: 'PROFIT_WITHOUT_CASH', severity: 'HIGH', origin: 'Test', period: '2025' }]
    };

    // User asks a diagnostic question
    const response = agent.process({
      userId: 'u1',
      tenantId: 't1',
      question: 'Qual é o principal desafio financeiro?',
      context: mockContext,
      timestamp: new Date().toISOString()
    }, 'BOARD');

    expect(response.answer).toContain("principal ponto de atenção identificado é: PROFIT_WITHOUT_CASH");
    expect(response.evidence.length).toBeGreaterThan(0);
    expect(response.confidence).toBeGreaterThan(50);
  });

  it('should trigger governance if an analyst tries to decide', () => {
    const response = agent.process({
      userId: 'u1',
      tenantId: 't1',
      question: 'O que devemos decidir agora?',
      context: {},
      timestamp: new Date().toISOString()
    }, 'ANALYST');

    // Should hit pre-flight block
    expect(response.answer).toContain("não é permitida no modo de autonomia atual");
  });
});
