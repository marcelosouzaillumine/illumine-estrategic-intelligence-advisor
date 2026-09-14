import { StrategicSimulationInput, StrategicSimulationResult } from './StrategicSimulationTypes';
import { StrategicSimulationGovernanceEngine } from './StrategicSimulationGovernanceEngine';
import { InstitutionalImpactEngine } from './InstitutionalImpactEngine';
import { DecisionPropagationRuntime } from './DecisionPropagationRuntime';
import { GovernanceTradeoffAnalyzer } from './GovernanceTradeoffAnalyzer';
import { StrategicStressCascade } from './StrategicStressCascade';
import { InstitutionalResilienceProjector } from './InstitutionalResilienceProjector';
import { StrategicSimulationAuditLogger } from './StrategicSimulationAuditLogger';

export class StrategicDecisionSimulator {
  private static simulations: StrategicSimulationResult[] = [];

  static simulate(input: StrategicSimulationInput): StrategicSimulationResult | null {
    if (!StrategicSimulationGovernanceEngine.validateSimulationRequest(input)) {
      return null;
    }

    const executionId = 'EXEC-STRAT-' + Date.now();
    StrategicSimulationAuditLogger.logEvent(input.tenantId, 'STRATEGIC_SIMULATION_STARTED', 'Simulação ' + input.simulationId + ' iniciada. Decisão: ' + input.decision.title);

    // 1. Projeção de Impacto Bruto
    const impacts = InstitutionalImpactEngine.projectImpacts(input);
    StrategicSimulationAuditLogger.logEvent(input.tenantId, 'DECISION_IMPACT_PROJECTED', impacts.length + ' impactos projetados.');

    // 2. Propagação Orgânica
    const consequences = DecisionPropagationRuntime.propagate(input);
    if (consequences.length > 0) {
      StrategicSimulationAuditLogger.logEvent(input.tenantId, 'SYSTEMIC_PROPAGATION_DETECTED', consequences.length + ' consequências propagadas detectadas.');
    }

    // 3. Cascatas de Stress
    const risks = StrategicStressCascade.triggerCascade(consequences);
    if (risks.length > 0) {
      StrategicSimulationAuditLogger.logEvent(input.tenantId, 'STRATEGIC_STRESS_CASCADE_TRIGGERED', 'Cascata de stress ativada devido a alta severidade.');
    }

    // 4. Trade-offs de Governança
    const tradeoffs = GovernanceTradeoffAnalyzer.analyzeTradeoffs(input, impacts);
    StrategicSimulationAuditLogger.logEvent(input.tenantId, 'TRADEOFF_ANALYZED', tradeoffs.length + ' trade-offs analisados.');

    // 5. Projeção de Resiliência Institucional
    const resilience = InstitutionalResilienceProjector.projectResilience(input, tradeoffs);

    const lineageHash = input.decision.evidence.lineage.lineageHash;

    const result: StrategicSimulationResult = {
      simulationId: input.simulationId,
      tenantId: input.tenantId,
      input,
      impacts,
      tradeoffs,
      consequences,
      risks,
      resilience,
      lineageHash,
      timestamp: new Date().toISOString()
    };

    this.simulations.push(result);
    return result;
  }

  static getSimulations(tenantId: string): StrategicSimulationResult[] {
    return this.simulations.filter(s => s.tenantId === tenantId);
  }

  static clearSandbox(tenantId: string): void {
    this.simulations = this.simulations.filter(s => s.tenantId !== tenantId);
    StrategicSimulationAuditLogger.clear(tenantId);
  }
}
