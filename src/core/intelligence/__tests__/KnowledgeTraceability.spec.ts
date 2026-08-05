import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('KnowledgeTraceability', () => {
  it('should ensure that every finding possesses full governance traceability (Fact -> Concept -> Knowledge -> Pattern -> Inference -> Finding -> Confidence)', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const output = useCase.analyzeBalanceSheet({});

    expect(output.governance.trace).toBeDefined();
    expect(output.governance.trace.length).toBeGreaterThan(0);

    const traceNode = output.governance.trace[0] as any;
    expect(traceNode.fact).toBeDefined();
    expect(traceNode.concept).toBeDefined();
    expect(traceNode.knowledge).toBeDefined();
    expect(traceNode.pattern).toBeDefined();
    expect(traceNode.finding).toBeDefined();
    expect(traceNode.confidence).toBeDefined();
    
    expect(traceNode.concept).toBe('financial.liquidity');
    expect(traceNode.finding).toBe('Capital efficiency review recommended');
  });
});
