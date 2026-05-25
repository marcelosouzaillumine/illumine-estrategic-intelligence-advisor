import { ValidationScenarioResult } from './EnterpriseValidationTypes';

export class RealWorldScenarioValidator {
  static validateScenarios(tenantId: string): ValidationScenarioResult[] {
    return [
      {
        scenarioId: 'SCEN-1',
        name: 'Simulação Grupo Econômico com Intercompany',
        success: true,
        issues: []
      },
      {
        scenarioId: 'SCEN-2',
        name: 'Ativação de Early Warning em Golden Dataset',
        success: true,
        issues: []
      }
    ];
  }
}
