import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ScenarioSimulationResult } from './ScenarioTypes';
import { GovernanceViolationRecord } from '../../../core/runtime/observability/observability-types';
import { GovernedRepositoryWrapper } from '../../../core/security/governed-repository';
import { DataAccessContext } from '../../../core/security/data-access-context';
import { getErrorMessage } from '../../../types/runtime/RuntimeErrorGuards';
import { ScenarioGraphAdapter } from '../../../core/knowledge-graph/adapters/ScenarioGraphAdapter';
import { blockedFirestoreWrite } from '../../../lib/blockedFirestoreWrite';

export class ScenarioRegistry {
  static async registerScenario(context: DataAccessContext, result: ScenarioSimulationResult, propagatedViolations: GovernanceViolationRecord[]): Promise<void> {
    try {
      const record = {
         ...result,
         propagatedViolations,
         persistedAt: new Date().toISOString()
      };
      
      const simulationContext: DataAccessContext = {
        ...context,
        requestedAction: 'CREATE_SIMULATION',
        resourceType: 'Simulation',
        scenarioHash: result.snapshotHash
      };

      // Salva no Firestore
      await GovernedRepositoryWrapper.execute(simulationContext, async () => {
        blockedFirestoreWrite(); // setDoc(doc(db, 'scenario_executions', result.scenarioId), record);
      });

      // [Knowledge Graph Integration] Chamada Passiva
      await ScenarioGraphAdapter.registerScenarioGraph(result);
    } catch (err: unknown) {
      console.error('[ScenarioRegistry] Error persisting scenario:', getErrorMessage(err));
      throw err; // Escalate failure because of governance
    }
  }
}
