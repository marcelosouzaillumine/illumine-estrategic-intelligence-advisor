import { describe, it, expect } from 'vitest';
import { ExecutiveIntelligenceOrchestrator } from '../src/orchestration/ExecutiveIntelligenceOrchestrator';
import { MemoryClassification } from '../src/learning/MemoryClassification';
import { DecisionMemoryRecord } from '../src/learning/DecisionMemoryRecord';
import { LearningEvent } from '../src/learning/LearningEvent';

describe('ExecutiveIntelligenceOrchestrator', () => {
  it('must block the pipeline immediately if Layer 0 (Integrity) fails critically', () => {
    // Cenário: PL Negativo com Decisão de Distribuir Dividendos
    const badData = { equity: -1000000 };
    const decision = 'DISTRIBUTE_DIVIDENDS';

    const result = ExecutiveIntelligenceOrchestrator.runPipeline(badData, undefined, decision);

    expect(result.businessState).toContain('DATA REJECTED');
    expect(result.narrativeBlocks.length).toBe(1);
    expect(result.narrativeBlocks[0].severity).toBe('CRITICAL');
    expect(result.narrativeBlocks[0].content).toContain('fiduciariamente incompatível');
  });

  it('must generate a complete Executive Brief with segmented causal confidence and block narratives', () => {
    // Cenário Crítico: PL Negativo, Liquidez < 1, Capital de Giro Negativo
    const criticalData = { ebitda: 1000, revenue: 10000, assets: 500000, liabilities: 1500000, equity: -1000000, currentAssets: 100000, currentLiabilities: 300000 };
    const decision = 'EXPAND_OPERATIONS';

    const result = ExecutiveIntelligenceOrchestrator.runPipeline(criticalData, undefined, decision);

    // Context
    expect(result.businessState).toBe('RISCO DE CONTINUIDADE');

    // Causal Diagnostics (Layer 2)
    const facts = result.evidences.filter(e => e.level === 'FACT');
    const hypotheses = result.evidences.filter(e => e.level === 'HYPOTHESIS');
    
    expect(facts.length).toBeGreaterThan(0);
    expect(facts[0].confidence).toBe(100);
    
    expect(hypotheses.length).toBeGreaterThan(0);
    expect(hypotheses[0].confidence).toBe(45);
    
    expect(result.overallConfidence).toBeLessThan(100); // Média ponderada será menor que 100 devido às hipóteses

    // Adaptive Narrative (Layer 4)
    const blocks = result.narrativeBlocks;
    const situationBlock = blocks.find(b => b.type === 'SITUATION');
    const actionBlock = blocks.find(b => b.type === 'ACTION');
    const decisionBlock = blocks.find(b => b.type === 'DECISION');

    expect(situationBlock).toBeDefined();
    expect(situationBlock?.severity).toBe('CRITICAL');
    
    expect(decisionBlock).toBeDefined();
    expect(decisionBlock?.severity).toBe('CRITICAL');
    
    expect(actionBlock).toBeDefined();
    expect(actionBlock?.content).toContain('CFO'); // Responsável definido na ação
    expect(actionBlock?.content).toContain('Prazo: Imediato'); // Prazo definido
  });

  it('must adjust proposed decision status when LearningAdvisor intercepts historical failures', () => {
    // Contexto atual: RISCO DE CONTINUIDADE (Liquidez < 1 e Capital de Giro < 0)
    const criticalData = { ebitda: 5000, revenue: 20000, assets: 500000, liabilities: 1500000, equity: -1000000, currentAssets: 100000, currentLiabilities: 300000 };
    const decision = 'ACQUIRE_COMPETITOR';

    // Memória Institucional Mockada
    const decisionHistory: DecisionMemoryRecord[] = [
      {
        id: 'DEC-001',
        decisionDate: '2024-01-01',
        decisionType: 'ACQUIRE_COMPETITOR',
        contextSnapshot: {
          financialState: 'RISCO DE CONTINUIDADE',
          liquidity: 0.8,
          autonomy: -0.1,
          decision: 'ACQUIRE_COMPETITOR',
          approvedBy: 'CEO',
          date: '2024-01-01'
        },
        assumptions: ['Mercado em alta', 'Sinergia operacional imediata'],
        risksIdentified: ['Caixa insuficiente'],
        expectedOutcome: 'Aumento de 20% do market share sem perda de margem',
        responsibleExecutives: ['CEO'],
        approvalLevel: MemoryClassification.EXECUTIVE,
        actualOutcome: 'Perda de 15% de margem em 6 meses',
        confidenceScore: 80
      }
    ];

    const learningHistory: LearningEvent[] = [
      {
        sourceDecisionId: 'DEC-001',
        evidence: 'Margem EBITDA caiu 15%',
        confirmedCause: 'Sinergia não cobriu aumento da despesa financeira.',
        presumedCause: 'Mudança de cenário no setor impactou a receita.',
        decisionResponsibility: 'Erro de Premissa Interna',
        lesson: 'Aquisições durante "RISCO DE CONTINUIDADE" sem hedge destroem margem.',
        confidence: 95,
        approvedBy: 'CFO',
        timestamp: '2024-07-01'
      }
    ];

    const result = ExecutiveIntelligenceOrchestrator.runPipeline(criticalData, undefined, decision, decisionHistory, learningHistory);

    // O status de uma decisão que passaria tranquila pode ser rebaixado para APPROVED_WITH_CONDITIONS
    expect(result.decisionAssessment).toBeDefined();
    expect(result.decisionAssessment?.reasons.some(r => r.includes('Memória Institucional Detectada'))).toBeTruthy();
    expect(result.decisionAssessment?.reasons.some(r => r.includes('Aquisições durante "RISCO DE CONTINUIDADE" sem hedge destroem margem.'))).toBeTruthy();
  });
});
