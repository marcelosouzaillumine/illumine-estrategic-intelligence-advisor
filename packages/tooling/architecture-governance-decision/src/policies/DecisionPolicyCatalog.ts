import { DecisionOutcome } from '../models/ArchitectureDecision';

export interface DecisionPolicyRule {
  readonly id: string;
  readonly inputs: readonly string[]; // Quais variáveis/fatos entram
  readonly evaluationRules: string; // Descrição lógica
  readonly outputRules: string; // Mapeamento para o resultado
  readonly getDecisionOutcome: (exposureLevel: string) => DecisionOutcome;
}

export class DecisionPolicyCatalog {
  readonly version = '1.0.0';

  private rules: DecisionPolicyRule[] = [
    {
      id: 'DEC-POL-001',
      inputs: ['RiskAssessment.exposureLevel'],
      evaluationRules: 'If Exposure is CRITICAL or HIGH, it warrants an ARCHITECTURAL_REVIEW. If MODERATE, INVESTIGATE.',
      outputRules: 'Maps exposure to formal ARB outcome.',
      getDecisionOutcome: (exposureLevel) => {
        if (exposureLevel === 'CRITICAL' || exposureLevel === 'HIGH') return 'ARCHITECTURAL_REVIEW';
        if (exposureLevel === 'MODERATE') return 'INVESTIGATE';
        return 'NO_ACTION';
      }
    }
  ];

  getRule(id: string): DecisionPolicyRule | undefined {
    return this.rules.find(r => r.id === id);
  }
}
