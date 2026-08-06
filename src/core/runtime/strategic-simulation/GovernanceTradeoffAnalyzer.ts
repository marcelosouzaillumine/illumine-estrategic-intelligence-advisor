import { GovernanceTradeoff, StrategicSimulationInput, DecisionImpactProjection } from './StrategicSimulationTypes';

export class GovernanceTradeoffAnalyzer {
  static analyzeTradeoffs(input: StrategicSimulationInput, impacts: DecisionImpactProjection[]): GovernanceTradeoff[] {
    // MOCK
    if (input.decision.category === 'DIVESTMENT') {
      return [
        {
          tradeoffId: 'TRADE-' + Date.now(),
          gainDomain: 'LIQUIDITY',
          gainDescription: 'Sobrevivência financeira garantida para os próximos 18 meses.',
          lossDomain: 'OPERATIONAL',
          lossDescription: 'Perda de market share sistêmico e dependência aumentada de terceiros.',
          netResilienceImpact: -0.1 // Ligeira queda na resiliência de longo horizonte
        }
      ];
    }
    return [];
  }
}
