export class BalanceSheetExecutiveRecommendationEngine {
  /**
   * Generates Primary Recommendations based only on the dominant restriction identified in the BP.
   */
  public static generatePrimary(
    dominantRestriction: string | null,
    rootCause: string
  ): { text: string; rationale: string[] } {
    if (!dominantRestriction) {
      return {
        text: 'Preserve solvency discipline and optimize capital allocation due to high liquidity and low leverage.',
        rationale: [rootCause, 'Capital is formally preserved.']
      };
    }

    switch (dominantRestriction) {
      case 'LIQUIDITY_CRITICAL':
        return {
          text: 'Prioritize actions to release working capital, reduce inventory, and lengthen the profile of operational liabilities.',
          rationale: [rootCause]
        };
      case 'SOLVENCY_CRITICAL':
        return {
          text: 'Immediate need for capital injection or debt restructuring to restore solvency.',
          rationale: [rootCause]
        };
      case 'LEVERAGE_CRITICAL':
        return {
          text: 'Halt new debt issuance and prioritize deleveraging through operational cash generation or asset sales.',
          rationale: [rootCause]
        };
      case 'CAPITAL_CONSUMPTION_CRITICAL':
        return {
          text: 'Mandatory halt of cash burn and reinforcement of profit retention; suspend dividend distribution.',
          rationale: [rootCause]
        };
      default:
        return {
          text: 'Maintain strict monitoring of balance sheet components.',
          rationale: [rootCause]
        };
    }
  }

  /**
   * Generates Secondary Advisories as contextual notes from other statements.
   */
  public static generateSecondary(
    externalAlerts: { source: 'DRE' | 'DFC' | 'DLPA'; message: string; severity: 'INFO' | 'WARNING' }[]
  ): Array<{ source: 'DRE' | 'DFC' | 'DLPA'; text: string; severity: 'INFO' | 'WARNING' }> {
    return externalAlerts.map(alert => ({
      source: alert.source,
      text: `Contextual advisory originating from ${alert.source}: ${alert.message}`,
      severity: alert.severity
    }));
  }
}
