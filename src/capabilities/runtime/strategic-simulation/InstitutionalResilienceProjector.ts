import { ResilienceProjection, StrategicSimulationInput, GovernanceTradeoff } from './StrategicSimulationTypes';

export class InstitutionalResilienceProjector {
  static projectResilience(input: StrategicSimulationInput, tradeoffs: GovernanceTradeoff[]): ResilienceProjection {
    const preDecisionScore = 0.72; // Mock base
    const netImpact = tradeoffs.reduce((acc, curr) => acc + curr.netResilienceImpact, 0);
    
    return {
      tenantId: input.tenantId,
      preDecisionScore,
      postDecisionScore: Math.max(0, preDecisionScore + netImpact),
      recoveryTimeMonths: netImpact < 0 ? 12 : 0 // Mock simples
    };
  }
}
