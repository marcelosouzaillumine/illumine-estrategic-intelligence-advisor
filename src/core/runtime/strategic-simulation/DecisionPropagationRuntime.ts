import { InstitutionalConsequence, StrategicSimulationInput } from './StrategicSimulationTypes';

export class DecisionPropagationRuntime {
  static propagate(input: StrategicSimulationInput): InstitutionalConsequence[] {
    // MOCK: Efeito dominó da decisão
    if (input.decision.category === 'DIVESTMENT') {
      return [
        {
          consequenceId: 'CONS-' + Date.now() + '-1',
          targetEntityId: 'SUPPLY_CHAIN_HUB',
          description: 'Ruptura na cadeia de suprimentos compartilhada, afetando outras duas BUs (Business Units).',
          severity: 'HIGH'
        },
        {
          consequenceId: 'CONS-' + Date.now() + '-2',
          targetEntityId: 'WORKFLOW_CAPITAL',
          description: 'Aumento de escalações na realocação do capital obtido pela venda.',
          severity: 'MEDIUM'
        }
      ];
    }
    return [];
  }
}
