export class CashFlowCausalSeverityEngine {
  public static classify(impactPercent: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
    if (impactPercent < 15) {
      return 'LOW';
    }
    if (impactPercent < 40) {
      return 'MODERATE';
    }
    if (impactPercent < 60) {
      return 'HIGH';
    }
    return 'CRITICAL';
  }
}
