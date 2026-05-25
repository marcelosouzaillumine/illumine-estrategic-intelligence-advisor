import { ScenarioSimulationInput, ScenarioSimulationResult } from './ScenarioTypes';
import { ScenarioSnapshotBuilder } from './ScenarioSnapshotBuilder';
import { InstitutionalShockSimulator } from './InstitutionalShockSimulator';
import { ScenarioPropagationRuntime } from './ScenarioPropagationRuntime';
import { ScenarioConfidenceProjector } from './ScenarioConfidenceProjector';
import { ScenarioNarrativeEngine } from './ScenarioNarrativeEngine';
import { ScenarioExecutionLogger } from './ScenarioExecutionLogger';
import { ScenarioRegistry } from './ScenarioRegistry';
import { DataAccessContext } from '../../security/data-access-context';

export class ScenarioSimulationEngine {
  /**
   * Orquestrador Mestre do Laboratório de Cenários.
   * Isolado, Fiduciário, e Seguro (Non-Mutating sobre dados reais).
   */
  static async runSimulation(input: ScenarioSimulationInput, historicalConfidence: 'HIGH' | 'MEDIUM' | 'LOW', context?: DataAccessContext): Promise<ScenarioSimulationResult> {
    const executionId = crypto.randomUUID();
    const scenarioId = crypto.randomUUID();
    
    await ScenarioExecutionLogger.logEvent(executionId, 'SCENARIO_STARTED');

    // 1. Snapshotting (Isolamento de Memória Absoluto)
    const snapshotHash = ScenarioSnapshotBuilder.generateHash(input.baseSnapshot);
    const isolatedSnapshot = ScenarioSnapshotBuilder.buildClone(input.baseSnapshot);

    // 2. Shock Application (Matemática Preditiva)
    await ScenarioExecutionLogger.logEvent(executionId, 'APPLYING_SHOCKS');
    const stressedSnapshot = InstitutionalShockSimulator.applyShocks(isolatedSnapshot, input.shocks);

    // 3. Propagation & Stress Testing
    await ScenarioExecutionLogger.logEvent(executionId, 'RUNNING_PROPAGATION');
    const propagation = ScenarioPropagationRuntime.run(stressedSnapshot, input.horizonMonths);

    // 4. Confidence Projection
    const projectedConfidence = ScenarioConfidenceProjector.project(historicalConfidence, propagation);

    // 5. Executive Narrative
    const narrative = ScenarioNarrativeEngine.generateNarrative(input.shocks, propagation, projectedConfidence);

    const result: ScenarioSimulationResult = {
      scenarioId,
      executionId,
      groupId: input.baseSnapshot.groupId,
      timestamp: new Date().toISOString(),
      shocksApplied: input.shocks,
      historicalConfidence,
      projectedConfidence,
      institutionalStress: propagation.stressResult,
      narrative,
      runtimeVersion: '1.0.0-phase8',
      snapshotHash
    };

    // 6. Persistência Auditável High-Level
    if (context) {
      await ScenarioRegistry.registerScenario(context, result, propagation.propagatedViolations);
    }
    
    await ScenarioExecutionLogger.logEvent(executionId, 'SCENARIO_COMPLETED');

    return result;
  }
}
