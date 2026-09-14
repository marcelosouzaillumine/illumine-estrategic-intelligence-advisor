export interface RiskPolicyRule {
  readonly id: string;
  readonly name: string;
  readonly targetSignalType: string;
  readonly category: 'DEPENDENCY' | 'BOUNDARY' | 'EVOLUTION' | 'CERTIFICATION';
  readonly getMagnitude: (confidence: 'HIGH' | 'MEDIUM' | 'LOW') => number;
}

export class RiskPolicyCatalog {
  readonly version = '1.0.0';

  private rules: RiskPolicyRule[] = [
    {
      id: 'RISK-001',
      name: 'Dependency Concentration Exposure',
      targetSignalType: 'DEPENDENCY_EXPANSION',
      category: 'DEPENDENCY',
      getMagnitude: (confidence) => confidence === 'HIGH' ? 3 : (confidence === 'MEDIUM' ? 2 : 1)
    },
    {
      id: 'RISK-002',
      name: 'Boundary Volatility Exposure',
      targetSignalType: 'BOUNDARY_EXPANSION',
      category: 'BOUNDARY',
      getMagnitude: (confidence) => confidence === 'HIGH' ? 3 : (confidence === 'MEDIUM' ? 2 : 1)
    },
    {
      id: 'RISK-003',
      name: 'Evolution Acceleration Exposure',
      targetSignalType: 'EVOLUTION_ACCELERATION',
      category: 'EVOLUTION',
      getMagnitude: (confidence) => confidence === 'HIGH' ? 2 : 1
    }
  ];

  getRuleForSignal(type: string): RiskPolicyRule | undefined {
    return this.rules.find(r => r.targetSignalType === type);
  }
}
