export interface RecommendationSourceRecord {
  statement: 'BP' | 'DRE' | 'DFC' | 'DLPA';
  engine: string;
}

export class RecommendationSourceAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Verifies the origin of recommendations to ensure cross-statement leaks.
   */
  public static audit(
    recommendationText: string,
    sourceRecord: RecommendationSourceRecord
  ): { severity: 'OK' | 'BLOCKING'; findings: string[] } {
    const findings: string[] = [];

    // Basic heuristic: if it's a DFC recommendation but claims to be BP
    // Or if the text contains strong DFC keywords but is sourced as BP
    const dfcKeywords = ['queima de caixa', 'fluxo de caixa', 'fco'];
    const textLower = recommendationText.toLowerCase();
    
    const hasDfcKeywords = dfcKeywords.some(kw => textLower.includes(kw));

    if (hasDfcKeywords && sourceRecord.statement === 'BP') {
      findings.push('[CROSS_STATEMENT_RECOMMENDATION_LEAK] Recommendation strongly correlates with DFC but is sourced as BP.');
      return { severity: 'BLOCKING', findings };
    }

    return { severity: 'OK', findings };
  }
}
