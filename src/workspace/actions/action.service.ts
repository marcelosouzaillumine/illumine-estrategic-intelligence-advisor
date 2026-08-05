import { ExecutiveAction, ActionStatus } from './types';
import { ActionRegistry } from './action.registry';

export class ActionService {
  static createAction(payload: Omit<ExecutiveAction, 'id' | 'createdAt' | 'status'>): ExecutiveAction {
    const action: ExecutiveAction = {
      ...payload,
      id: `action-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      status: 'TODO'
    };
    ActionRegistry.register(action);
    return action;
  }

  static updateStatus(actionId: string, status: ActionStatus): void {
    const action = ActionRegistry.get(actionId);
    if (action) {
      action.status = status;
      ActionRegistry.register(action); // update
    }
  }

  static addFollowUpNote(actionId: string, note: string): void {
    const action = ActionRegistry.get(actionId);
    if (action) {
      if (!action.followUpNotes) {
        action.followUpNotes = [];
      }
      action.followUpNotes.push(note);
      ActionRegistry.register(action); // update
    }
  }

  static listActionsByInsight(insightId: string): ExecutiveAction[] {
    return ActionRegistry.getAll().filter(a => a.insightId === insightId);
  }
}
