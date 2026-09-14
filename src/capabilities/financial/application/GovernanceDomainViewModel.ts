export interface GovernanceRule {
  id: string;
  category: 'board' | 'compliance' | 'risk' | 'audit';
  title: string;
  weight: number;
  compliant: boolean;
}

export interface RiskItem {
  id: string;
  title: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'MITIGATED' | 'BLOCKED';
}

export class GovernanceDomainViewModel {
  public static calculateMaturityScore(rules: GovernanceRule[]): number {
    if (rules.length === 0) return 100;
    const totalWeight = rules.reduce((acc, r) => acc + r.weight, 0);
    const compliantWeight = rules.filter(r => r.compliant).reduce((acc, r) => acc + r.weight, 0);
    return totalWeight > 0 ? (compliantWeight / totalWeight) * 100 : 100;
  }

  public static summarizeRisks(risks: RiskItem[]) {
    const critical = risks.filter(r => r.impact === 'CRITICAL' && r.status === 'ACTIVE').length;
    const high = risks.filter(r => r.impact === 'HIGH' && r.status === 'ACTIVE').length;
    const mitigated = risks.filter(r => r.status === 'MITIGATED').length;
    const activeTotal = risks.filter(r => r.status === 'ACTIVE').length;

    let overallTone: 'success' | 'warning' | 'critical' = 'success';
    if (critical > 0) {
      overallTone = 'critical';
    } else if (high > 0) {
      overallTone = 'warning';
    }

    return {
      critical,
      high,
      mitigated,
      activeTotal,
      overallTone
    };
  }

  public static toContract(state: any = {}, computed: any = {}, actions: any = {}) {
    return { state, computed, actions };
  }
}
