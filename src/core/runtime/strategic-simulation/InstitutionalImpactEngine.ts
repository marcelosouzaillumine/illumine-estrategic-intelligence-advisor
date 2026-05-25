import { DecisionImpactProjection, StrategicSimulationInput } from './StrategicSimulationTypes';

export class InstitutionalImpactEngine {
  static projectImpacts(input: StrategicSimulationInput): DecisionImpactProjection[] {
    // MOCK: Venda de subsidiária estratégica ou expansão de capex
    const impacts: DecisionImpactProjection[] = [];

    if (input.decision.category === 'DIVESTMENT') {
      impacts.push({
        impactId: 'IMP-' + Date.now() + '-1',
        domain: 'LIQUIDITY',
        delta: 0.4, // Injeção de caixa
        description: 'Aumento expressivo de liquidez imediata com a venda do ativo.'
      });
      impacts.push({
        impactId: 'IMP-' + Date.now() + '-2',
        domain: 'OPERATIONAL',
        delta: -0.3, // Perda operacional
        description: 'Queda de capacidade produtiva core na região sul.'
      });
    }

    return impacts;
  }
}
