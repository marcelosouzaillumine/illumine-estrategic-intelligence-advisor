import { ExecutiveInsightCategory } from '../contracts/ExecutiveDiagnosis';

export interface PriorityProfile {
  name: string;
  hierarchy: ExecutiveInsightCategory[];
}

export class ExecutivePriorityEngine {
  /**
   * Perfis Padrões da Illumine (Evolutivo para Customização por Setor)
   */
  public static readonly DEFAULT_PROFILE: PriorityProfile = {
    name: "Standard Corporate",
    hierarchy: [
      'LIQUIDITY',
      'CONTINUITY',
      'SOLVENCY',
      'CASH',
      'WORKING_CAPITAL',
      'PROFITABILITY',
      'GROWTH',
      'CAPITAL',
      'PEOPLE',
      'COMPLIANCE',
      'DIVIDENDS'
    ]
  };

  /**
   * Retorna a prioridade institucional estrita.
   * Modifica a ordem de uma lista de insights permitidos baseado no profile.
   */
  public static prioritize(
    allowedInsights: ExecutiveInsightCategory[],
    profile: PriorityProfile = this.DEFAULT_PROFILE
  ): ExecutiveInsightCategory[] {
    return profile.hierarchy.filter(insight => allowedInsights.includes(insight));
  }
}
