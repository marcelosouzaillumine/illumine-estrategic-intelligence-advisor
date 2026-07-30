import { ExecutiveMemoryContract } from '@illumine/executive-contracts';

export class ExecutiveMemoryEngine {
  public static recallPreviousContext(): ExecutiveMemoryContract {
    return {
      memoryId: `mem-${Date.now()}`,
      previousDecisionSummary: 'Renegociação do Contrato de TI & SG&A do Fornecedor Alfa',
      daysAgo: 3,
      completedMilestonesCount: 2,
      totalMilestonesCount: 5,
      promptFollowUpText: 'Há 3 dias iniciamos o plano para reduzir capital de giro. 2 dos 5 marcos já foram concluídos. Gostaria de acompanhar o progresso?'
    };
  }
}
