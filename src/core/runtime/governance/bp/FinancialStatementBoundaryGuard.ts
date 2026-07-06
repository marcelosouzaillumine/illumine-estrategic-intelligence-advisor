export class FinancialStatementBoundaryGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Distinguishes between allowed reference and forbidden causality.
   */
  public static checkBoundaries(
    bpDominantRestriction: string | null,
    primaryRecommendationText: string,
    secondaryAdvisories: { source: 'DRE' | 'DFC' | 'DLPA'; text: string }[]
  ): { severity: 'OK' | 'WARNING' | 'BLOCKING'; findings: string[] } {
    let severity: 'OK' | 'WARNING' | 'BLOCKING' = 'OK';
    const findings: string[] = [];

    const setSeverity = (level: 'WARNING' | 'BLOCKING') => {
      if (severity === 'OK' || level === 'BLOCKING') {
        severity = level;
      }
    };

    // Check causality: If BP has no dominant restriction, the primary recommendation CANNOT be derived from DFC/DRE/DLPA.
    if (!bpDominantRestriction) {
      const drcKeywords = ['caixa', 'queima de caixa', 'dfc', 'dre', 'margem líquida'];
      for (const kw of drcKeywords) {
        if (primaryRecommendationText.toLowerCase().includes(kw)) {
          findings.push(`[BOUNDARY_VIOLATION] BP has no dominant restriction, but primary recommendation mentions "${kw}". This implies cross-statement causality.`);
          setSeverity('BLOCKING');
        }
      }
    }

    // Check valid references: Secondary advisories must explicitly label their source.
    for (const advisory of secondaryAdvisories) {
      if (!advisory.text.includes(advisory.source)) {
        findings.push(`[BOUNDARY_WARNING] Secondary advisory from ${advisory.source} should explicitly mention the source in the text for clarity.`);
        setSeverity('WARNING');
      }
    }

    return { severity, findings };
  }
}
