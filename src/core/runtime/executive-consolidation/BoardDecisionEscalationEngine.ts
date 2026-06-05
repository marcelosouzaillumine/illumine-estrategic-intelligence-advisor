export interface BoardEscalationInput {
  badiScore: number;
  runwayMonths: number;
  capitalConsumido: number;
  fco: number;
  lucroLiquido: number;
  patrimonioLiquido: number;
}

export class BoardDecisionEscalationEngine {
  public static requiresEscalation(input: BoardEscalationInput): boolean {
    const isBadiHigh = input.badiScore >= 70;
    const isRunwayCritical = input.runwayMonths < 3 && input.fco < 0;
    const isCapitalFragilizado = input.patrimonioLiquido <= 0 || (input.capitalConsumido > 0 && input.lucroLiquido < 0);
    const isFcoNegative = input.fco < 0;
    const isPrejuizo = input.lucroLiquido < 0;

    return isBadiHigh || isRunwayCritical || isCapitalFragilizado || isFcoNegative || isPrejuizo;
  }
}
