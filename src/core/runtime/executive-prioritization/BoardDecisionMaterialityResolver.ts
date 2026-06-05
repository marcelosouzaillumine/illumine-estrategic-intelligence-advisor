export interface MaterialityInput {
  netIncome: number;
  fco: number;
  capitalConsumed: number;
  runwayMonths: number;
  badiScore: number;
}

export class BoardDecisionMaterialityResolver {
  /**
   * Avalia a tríade de destruição de valor e proíbe domínios inapropriados
   * de ocuparem o Top 1 ou existirem quando há riscos críticos.
   */
  public static prohibitDomains(input: MaterialityInput): string[] {
    const prohibited: string[] = [];

    // Se houver destruição simultânea em DRE, DFC e DLPA
    if (input.netIncome < 0 && input.fco < 0 && input.capitalConsumed > 0) {
      prohibited.push('Governança');
    }

    return prohibited;
  }

  /**
   * Ordena domínios por materialidade.
   * Regra Soberana: Destruição de Valor > Continuidade > Liquidez > Capital > Governança.
   */
  public static sortByMateriality(domains: string[]): string[] {
    const hierarchy: Record<string, number> = {
      'Destruição de Valor': 1,
      'Continuidade': 2,
      'Liquidez': 3,
      'Capital': 4,
      'Risco': 5,
      'Estratégia': 6,
      'Governança': 7
    };

    return [...domains].sort((a, b) => {
      const rankA = hierarchy[a] || 99;
      const rankB = hierarchy[b] || 99;
      return rankA - rankB;
    });
  }
}
