import { ExecutivePrioritizationContract, PriorityItem } from '@illumine/executive-contracts';

export class ExecutiveInsightPrioritizationEngine {
  public static prioritizeCompanyInsights(companyId: string): ExecutivePrioritizationContract {
    const item1: PriorityItem = {
      itemId: 'prio-01',
      title: 'Renegociação de Contratos de TI & SG&A',
      category: 'TOP_3',
      urgencyScore: 9,
      financialImpactScore: 9,
      strategicImpactScore: 8,
      expectedReturnDays: 30
    };

    const item2: PriorityItem = {
      itemId: 'prio-02',
      title: 'Desconto Antecipado de Duplicatas com Taxa Otimizada',
      category: 'QUICK_WIN',
      urgencyScore: 8,
      financialImpactScore: 7,
      strategicImpactScore: 6,
      expectedReturnDays: 7
    };

    const item3: PriorityItem = {
      itemId: 'prio-03',
      title: 'Reestruturação de Capital de Giro de Longo Prazo',
      category: 'STRATEGIC_PROJECT',
      urgencyScore: 6,
      financialImpactScore: 10,
      strategicImpactScore: 10,
      expectedReturnDays: 90
    };

    const item4: PriorityItem = {
      itemId: 'prio-04',
      title: 'Risco de Liquidez Imediata em Safra Comercial',
      category: 'CRITICAL_RISK',
      urgencyScore: 10,
      financialImpactScore: 9,
      strategicImpactScore: 9,
      expectedReturnDays: 14
    };

    const items = [item1, item2, item3, item4];

    return {
      prioritizationId: `prio-batch-${companyId}-${Date.now()}`,
      companyId,
      items,
      top3Priorities: [item1],
      quickWins: [item2],
      strategicProjects: [item3],
      criticalRisks: [item4],
      generatedAt: new Date().toISOString()
    };
  }
}
