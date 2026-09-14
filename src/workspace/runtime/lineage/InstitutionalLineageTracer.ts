export type FiduciarySource = 'DRE' | 'BP' | 'DFC' | 'DLPA' | 'ESG' | 'CAPITAL_GOVERNANCE' | 'SYSTEM' | 'USER_INPUT';
export type InferenceConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface LineageData {
  sources: FiduciarySource[];
  timestamp: string;
  inferredConfidence: InferenceConfidence;
  blockUnsubstantiated: boolean;
}

export class InstitutionalLineageTracer {
  /**
   * Generates a traceable lineage tag string for presentation to the Board/CFO
   */
  static formatLineage(sources: FiduciarySource[]): string {
    if (!sources || sources.length === 0) return 'Fonte: Não Rastreável';
    const distinctSources = Array.from(new Set(sources));
    return `Fonte: ${distinctSources.join(' + ')}`;
  }

  /**
   * Validates if a specific inference is permitted based on the available sources.
   * Enforces the Principle of Analytical Segregation.
   */
  static isInferencePermitted(inferenceType: 'LIQUIDITY' | 'BANK_DEPENDENCY' | 'SUPPLIER_DEPENDENCY' | 'CAPITAL_STRUCTURE' | 'CASH_PRESSURE' | 'RUNWAY' | 'TREASURY_RISK' | 'CASH_QUALITY', availableSources: FiduciarySource[]): boolean {
    const hasBP = availableSources.includes('BP');
    const hasDFC = availableSources.includes('DFC');
    const hasDRE = availableSources.includes('DRE');

    switch (inferenceType) {
      case 'LIQUIDITY':
      case 'BANK_DEPENDENCY':
      case 'SUPPLIER_DEPENDENCY':
      case 'CAPITAL_STRUCTURE':
        return hasBP;
      
      case 'CASH_PRESSURE':
      case 'RUNWAY':
      case 'TREASURY_RISK':
      case 'CASH_QUALITY':
        return hasBP || hasDFC;

      default:
        return false;
    }
  }

  static traceAssertion(assertion: string, sources: FiduciarySource[]): { text: string; lineage: string } {
    return {
      text: assertion,
      lineage: this.formatLineage(sources)
    };
  }
}
