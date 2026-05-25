import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ScenarioSimulationResult } from './ScenarioTypes';
import { GovernanceViolationRecord } from '../observability/observability-types';
import { GovernedRepositoryWrapper } from '../../security/governed-repository';
import { DataAccessContext } from '../../security/data-access-context';

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
        await setDoc(doc(db, 'scenario_executions', result.scenarioId), record);
      });
    } catch (err) {
      console.error('[ScenarioRegistry] Error persisting scenario:', err);
      throw err; // Escalate failure because of governance
    }
  }
}
