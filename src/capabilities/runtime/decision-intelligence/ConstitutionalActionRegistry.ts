export interface ConstitutionalAction {
  actionId: string;
  category: string;
  title: string;
  description: string;
  constitutionalProtocols: string[];
  active: boolean;
  conflictsWith?: string[];
}

export class ConstitutionalActionRegistry {
  private static actions = new Map<string, ConstitutionalAction>();

  public static registerAction(action: ConstitutionalAction) {
    this.actions.set(action.actionId, action);
  }

  public static getAction(actionId: string): ConstitutionalAction | undefined {
    return this.actions.get(actionId);
  }

  public static isActionActive(actionId: string): boolean {
    const action = this.actions.get(actionId);
    return action ? action.active : false;
  }

  public static clearRegistry() {
    this.actions.clear();
  }
}
