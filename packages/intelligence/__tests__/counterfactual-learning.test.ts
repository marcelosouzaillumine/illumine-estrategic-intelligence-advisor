import { DecisionMemoryRecord } from '../institutional-memory/models/DecisionMemoryRecord';
import { MemoryRepository } from '../institutional-memory/repositories/MemoryRepository';
import { LearningAdvisorEngine } from '../learning-loop-advisor/core/LearningAdvisorEngine';

class MockMemoryRepository implements MemoryRepository {
  private records: DecisionMemoryRecord[] = [];

  async saveRecord(record: DecisionMemoryRecord): Promise<DecisionMemoryRecord> {
    this.records.push(record);
    return record;
  }

  async getRecordById(id: string): Promise<DecisionMemoryRecord | null> {
    return this.records.find(r => r.id === id) || null;
  }

  async findSimilarDecisions(organizationId: string, contextKeywords: string[], limit?: number): Promise<DecisionMemoryRecord[]> {
    return this.records.filter(r => 
      r.organizationId === organizationId &&
      r.classification === 'FIDUCIARY_RECORD'
    ).slice(0, limit);
  }
}

async function runCounterfactualLearningTest() {
  console.log('=== Iniciando Counterfactual Learning Test™ ===');

  const repo = new MockMemoryRepository();
  const advisor = new LearningAdvisorEngine(repo);

  // 1. Criar Memória Histórica Fiduciária (Decisão do Passado)
  const pastDecision: DecisionMemoryRecord = {
    id: 'decision-2023',
    organizationId: 'org-illumine',
    decisionDate: new Date('2023-01-10'),
    decisionCategory: 'STRATEGIC',
    intent: {
      strategicObjective: 'Expansão de fábrica no sul',
      expectedValueCreation: 'Aumento de 20% na receita',
      successCriteria: ['Receita > 1M'],
      confidenceLevel: 80
    },
    contextSnapshot: [],
    assumptions: [{ id: 'a1', description: 'Mercado de consumo aquecido', confidence: 90 }],
    risksIdentified: [],
    expectedOutcome: { horizonDays: 180, metrics: [] },
    decisionAuthority: 'BOARD',
    classification: 'FIDUCIARY_RECORD',
    confidenceScore: 85,
    lessonsLearned: {
      id: 'lesson-1',
      text: 'A expansão gerou receita, mas pressionou a margem porque a premissa de logística barata falhou (fator externo imprevisível).',
      category: 'OPERATIONAL_RISK'
    }
  };

  await repo.saveRecord(pastDecision);

  // 2. Simular o presente (Nova tentativa de decisão similar)
  console.log('Contexto Atual: C-Level avaliando nova expansão em 2026.');
  const advice = await advisor.enrichExecutiveEvaluation('org-illumine', ['expansão', 'fábrica']);

  console.log('\n--- Resultado do Learning Loop Advisor™ ---');
  console.log(advice);
  console.log('------------------------------------------\n');
  console.log('=== Teste Concluído ===');
}

// Para testar, você pode rodar esse arquivo através do ts-node
// ts-node packages/intelligence/__tests__/counterfactual-learning.test.ts
runCounterfactualLearningTest().catch(console.error);
