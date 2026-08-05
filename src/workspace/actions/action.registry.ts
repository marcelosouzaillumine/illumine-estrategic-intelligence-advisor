import { ExecutiveAction } from './types';

export class ActionRegistry {
  private static actions: Map<string, ExecutiveAction> = new Map();

  static register(action: ExecutiveAction) {
    this.actions.set(action.id, action);
  }

  static get(id: string): ExecutiveAction | undefined {
    return this.actions.get(id);
  }

  static getAll(): ExecutiveAction[] {
    return Array.from(this.actions.values());
  }
}
