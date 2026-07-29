import { describe, it, expect } from 'vitest';
import { AgentDebateEngine, AgentOpinion } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/agent-debate-engine (Wave 16.5 Phase 3 Multi-Agent Debate)', () => {
  it('should run multi-agent debate session and calculate DecisionConvergenceScore (ADR-043)', () => {
    const op1: AgentOpinion = { agentId: 'cfo-agent', stance: 'AGREE', argumentText: 'Alinha-se com meta de EBITDA', confidenceScore: Score.create(92) };
    const op2: AgentOpinion = { agentId: 'risk-agent', stance: 'COMPLEMENT', argumentText: 'Adicionar trava cambial', confidenceScore: Score.create(94) };

    const summary = AgentDebateEngine.runDebate('Expansão de CAPEX', [op1, op2]);
    expect(summary.convergenceScore.value).toBe(100);
    expect(summary.opinions.length).toBe(2);
  });
});
