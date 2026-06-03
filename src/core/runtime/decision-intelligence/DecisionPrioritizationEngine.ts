export class DecisionPrioritizationEngine {
  public static evaluatePriority(context: any): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    const isCriticalLiquidity = context?.fiduciaryEvidenceStatus === 'CRITICAL';
    const isNegativeFCO = context?.operationalCashFlow < 0;
    const isTreasuryStress = context?.treasuryConclusion?.includes('Stress');

    if (isCriticalLiquidity && isNegativeFCO && isTreasuryStress) {
      return 'CRITICAL';
    }

    if (isCriticalLiquidity || isNegativeFCO) {
      return 'HIGH';
    }

    if (context?.hasExecutiveConclusion) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  public static evaluateUrgency(priority: string): 'SHORT_TERM' | 'IMMEDIATE' | 'STRATEGIC' {
    switch (priority) {
      case 'CRITICAL':
        return 'IMMEDIATE';
      case 'HIGH':
        return 'SHORT_TERM';
      default:
        return 'STRATEGIC';
    }
  }
}
