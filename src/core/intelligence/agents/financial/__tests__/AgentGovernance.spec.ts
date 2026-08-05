import { describe, it, expect, beforeEach } from 'vitest';
import { AgentGovernance } from '../AgentGovernance';
import { AgentReasoningTrace } from '../AgentReasoningTrace';
import { FinancialExecutiveIntent } from '../FinancialExecutiveIntent';
import { ExecutiveAgentResponse } from '../../contracts/ExecutiveAgentResponse';

describe('AgentGovernance', () => {
  let governance: AgentGovernance;
  let trace: AgentReasoningTrace;

  beforeEach(() => {
    governance = new AgentGovernance();
    trace = new AgentReasoningTrace();
  });

  it('should block pre-flight DECISION_SUPPORT in ANALYST mode', () => {
    const isValid = governance.validatePreFlight(FinancialExecutiveIntent.DECISION_SUPPORT, 'ANALYST', trace);
    expect(isValid).toBe(false);
    expect(trace.getTraceReport().governanceLogs.length).toBe(1);
  });

  it('should enforce post-flight limitations when there is no evidence', () => {
    let mockResponse: ExecutiveAgentResponse = {
      answer: "Acho que a empresa está bem.",
      evidence: [],
      insights: [],
      confidence: 90,
      limitations: [],
      relatedQuestions: []
    };

    const validated = governance.validatePostFlight(mockResponse, trace);
    expect(validated.limitations.length).toBe(1);
    expect(validated.confidence).toBe(40); // Punished for hallucination
  });

  it('should force a disclaimer if the agent tries to decide autonomously', () => {
    let mockResponse: ExecutiveAgentResponse = {
      answer: "Recomendo fechar a filial.",
      evidence: [{ description: 'X', source: 'Y' }],
      insights: [],
      confidence: 90,
      limitations: [],
      relatedQuestions: []
    };

    const validated = governance.validatePostFlight(mockResponse, trace);
    expect(validated.answer).toContain('(Nota: A plataforma Illumine atua como inteligência assistiva');
  });
});
