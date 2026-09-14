import { ExecutiveRecommendationContract } from '@illumine/executive-contracts';

export interface ScenarioDefinition {
  readonly scenarioName: 'CURRENT' | 'RECOMMENDED' | 'CONSERVATIVE' | 'OPTIMIZED';
  readonly label: string;
  readonly assumptions: readonly string[];
  readonly financialImpact: number;
  readonly operationalImpact: string;
  readonly riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class ExecutiveScenarioSimulator {
  public static simulateScenarios(recommendation: ExecutiveRecommendationContract): readonly ScenarioDefinition[] {
    const baseImpact = recommendation.expectedImpact;

    return [
      {
        scenarioName: 'CURRENT',
        label: 'Cenário Inercial (Manutenção do Status Quo)',
        assumptions: ['Nenhuma ação executada', 'Continuidade da degradação das margens'],
        financialImpact: 0,
        operationalImpact: 'Pressão contínua sobre liquidez imediata',
        riskLevel: 'HIGH'
      },
      {
        scenarioName: 'RECOMMENDED',
        label: 'Cenário Recomendado pelos Agentes',
        assumptions: recommendation.assumptions,
        financialImpact: baseImpact,
        operationalImpact: 'Recuperação imediata de margem e expansão de folga de caixa',
        riskLevel: 'LOW'
      },
      {
        scenarioName: 'CONSERVATIVE',
        label: 'Cenário Conservador (70% do Impacto)',
        assumptions: ['Execução parcial do plano', 'Demora de 60 dias no rollout'],
        financialImpact: Math.round(baseImpact * 0.7),
        operationalImpact: 'Recuperação moderada de liquidez em 90 dias',
        riskLevel: 'MEDIUM'
      },
      {
        scenarioName: 'OPTIMIZED',
        label: 'Cenário Otimizado (130% do Impacto)',
        assumptions: ['Antecipação total do cronograma', 'Renegociação com desconto de 15%'],
        financialImpact: Math.round(baseImpact * 1.3),
        operationalImpact: 'Reestruturação completa com eliminação de custo da dívida',
        riskLevel: 'LOW'
      }
    ];
  }
}
