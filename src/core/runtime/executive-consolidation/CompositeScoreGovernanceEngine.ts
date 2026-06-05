export interface CompositeScoreGovernanceResult {
  originalScore: number;
  fiduciaryAdjustedScore: number;
  isAdjusted: boolean;
  adjustmentReason: string | null;
}

export interface ScoreGovernanceInput {
  calculatedScore: number;
  hasRevenue: boolean;
  equityPositive: boolean;
  operationalContinuity: boolean; // Meaning the company has positive EBITDA, or positive Cash Flow, or enough Runway
}

export class CompositeScoreGovernanceEngine {
  /**
   * Objetivo: evitar score artificial igual a zero quando a empresa ainda possui 
   * operação, receita, PL positivo ou capacidade mínima de continuidade.
   */
  public static govern(input: ScoreGovernanceInput): CompositeScoreGovernanceResult {
    let floor = 0;
    let adjustmentReason: string | null = null;
    
    // Regra de piso:
    // if (companyHasRevenue || equityPositive || operationalContinuity) {
    //   score = Math.max(score, minimumOperationalFloor);
    // }
    
    if (input.hasRevenue || input.equityPositive || input.operationalContinuity) {
      if (input.equityPositive) {
        // Empresa operacional com PL positivo: mínimo 20
        floor = 20;
        adjustmentReason = "Ajuste de limite operacional: Empresa possui patrimônio líquido positivo.";
      } else {
        // Empresa operacional sem PL positivo: mínimo 10
        floor = 10;
        adjustmentReason = "Ajuste de limite operacional: Empresa mantém operação e receita, mesmo com PL negativo.";
      }
    } else {
      // Empresa sem operação, sem receita e insolvente: pode ser 0
      floor = 0;
    }

    const fiduciaryAdjustedScore = Math.max(input.calculatedScore, floor);
    const isAdjusted = fiduciaryAdjustedScore > input.calculatedScore;

    return {
      originalScore: input.calculatedScore,
      fiduciaryAdjustedScore,
      isAdjusted,
      adjustmentReason: isAdjusted ? adjustmentReason : null
    };
  }
}
