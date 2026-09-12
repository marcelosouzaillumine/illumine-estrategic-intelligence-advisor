import { sha256 } from '../executive/types';
import { ScenarioMutation } from './ScenarioMutation';

export class ScenarioHashFramework {
  public static generateHash(
    baselineHash: string,
    mutations: ScenarioMutation[],
    runtimeVersion: string
  ): string {
    const sortedMutations = [...mutations].sort((a, b) => a.mutationId.localeCompare(b.mutationId));

    const payload = {
      baselineHash,
      sortedMutations: sortedMutations.map(m => ({
        mutationId: m.mutationId,
        decisionId: m.decisionId,
        actionId: m.actionId,
        value: m.value
      })),
      runtimeVersion
    };

    return sha256(JSON.stringify(payload)).substring(0, 16);
  }
}
