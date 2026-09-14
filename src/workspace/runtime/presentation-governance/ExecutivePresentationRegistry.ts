export class ExecutivePresentationRegistry {
  // Map of technical terms to institutional language
  private static readonly presentationMap: Record<string, string> = {
    FULL_FINANCIAL_VIEW: 'Visão Integrada Corporativa',
    FINANCIAL_ONLY_VIEW: 'Visão Financeira',
    GOVERNANCE_VIEW: 'Visão de Governança',
    HIGH_CONFIDENCE: 'Alta Confiabilidade Analítica',
    MEDIUM_CONFIDENCE: 'Confiabilidade Moderada',
    LOW_CONFIDENCE: 'Confiabilidade Limitada',
    DRE_DFC_DLPA: 'Resultado → Caixa → Capital',
    DFC_CONTINUITY_PRESSURE: 'Pressão de Continuidade Operacional',
    CAPITAL_DESTRUCTION: 'Erosão Patrimonial Progressiva',
    LIQUIDITY_STRESS: 'Pressão de Liquidez',
    VALUE_CREATION_CHAIN: 'Cadeia de Geração de Valor',
  };

  // List of forbidden tokens that must never appear in BOARD/EXECUTIVE
  private static readonly forbiddenTokens: string[] = [
    '[[runtime.',
    'FULL_FINANCIAL_VIEW',
    'HIGH_CONFIDENCE',
    'DRE_DFC_DLPA',
    'DFC_CONTINUITY_PRESSURE',
    'CAPITAL_DESTRUCTION',
    'Debug Mode',
    '0.20805817244989006',
  ];

  /**
   * Returns the translated label for a given technical key.
   */
  static getLabel(key: string): string {
    return this.presentationMap[key] ?? key;
  }

  /**
   * Translates a raw value (e.g., enum) using the map if possible.
   */
  static translateValue(value: string): string {
    return this.presentationMap[value] ?? value;
  }

  /**
   * Checks whether a token is forbidden for BOARD/EXECUTIVE contexts.
   */
  static hasForbiddenToken(value: string): boolean {
    return this.forbiddenTokens.some(tok => value.includes(tok));
  }

  /**
   * Guard used to sanitize strings – returns an empty string if forbidden.
   */
  static guard(value: string | undefined): string {
    if (!value) return '';
    if (this.hasForbiddenToken(value)) return '';
    return this.translateValue(value);
  }
}
