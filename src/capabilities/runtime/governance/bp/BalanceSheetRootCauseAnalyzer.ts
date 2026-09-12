export class BalanceSheetRootCauseAnalyzer {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Identifies the root cause of restrictions within the BP domain.
   * Prevents recommendations based on external issues.
   */
  public static analyze(
    bpIndicators: { liquidityStatus: string; solvencyStatus: string; leverageStatus: string; capitalStatus: string },
    externalAlerts: { source: 'DFC' | 'DRE' | 'DLPA'; message: string }[]
  ): { dominantRestriction: string | null; cause: string } {
    
    let dominantRestriction = null;
    let cause = 'No critical patrimonial restriction identified within the Balance Sheet.';

    if (bpIndicators.liquidityStatus === 'CRITICAL') {
      dominantRestriction = 'LIQUIDITY_CRITICAL';
      cause = 'Balance Sheet shows critical liquidity restriction. Insufficient short-term assets to cover immediate liabilities.';
    } else if (bpIndicators.solvencyStatus === 'CRITICAL') {
      dominantRestriction = 'SOLVENCY_CRITICAL';
      cause = 'Balance Sheet shows critical solvency restriction. Total liabilities heavily outweigh assets.';
    } else if (bpIndicators.leverageStatus === 'CRITICAL') {
      dominantRestriction = 'LEVERAGE_CRITICAL';
      cause = 'Balance Sheet shows critical leverage. High dependency on third-party capital.';
    } else if (bpIndicators.capitalStatus === 'CRITICAL') {
      dominantRestriction = 'CAPITAL_CONSUMPTION_CRITICAL';
      cause = 'Balance Sheet shows critical capital consumption or erosion.';
    }

    // Explicit rule: BP cannot derive its priority from DFC/DRE if BP itself is healthy
    if (!dominantRestriction && externalAlerts.length > 0) {
      cause = `BP is formally preserved. Noted external alerts from ${externalAlerts.map(e => e.source).join(', ')}, but they do not constitute a BP root cause.`;
    }

    return { dominantRestriction, cause };
  }
}
