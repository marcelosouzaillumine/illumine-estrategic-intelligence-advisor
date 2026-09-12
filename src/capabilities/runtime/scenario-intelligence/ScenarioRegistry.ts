import { AllowedMutationType } from './ScenarioMutation';

export interface ApprovedScenarioAction {
  mutationId: AllowedMutationType;
  category: string;
  active: boolean;
}

export class ScenarioRegistry {
  private static registry = new Map<string, ApprovedScenarioAction>();

  public static registerAction(action: ApprovedScenarioAction) {
    this.registry.set(action.mutationId, action);
  }

  public static isMutationApproved(mutationId: string): boolean {
    const action = this.registry.get(mutationId);
    return action ? action.active : false;
  }

  public static clearRegistry() {
    this.registry.clear();
  }
}
