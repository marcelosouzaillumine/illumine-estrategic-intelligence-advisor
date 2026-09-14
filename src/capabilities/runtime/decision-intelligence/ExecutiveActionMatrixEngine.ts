import { ConstitutionalActionRegistry } from './ConstitutionalActionRegistry';

export class ExecutiveActionMatrixEngine {
  public static mapActions(context: any): string[] {
    const actions: string[] = [];
    
    // Evaluate deterministic conditions
    const runway = context?.runwayMonths || 12;
    if (runway < 3) {
      if (ConstitutionalActionRegistry.isActionActive('ACTION_PRESERVE_CASH')) {
        actions.push('ACTION_PRESERVE_CASH');
      }
    }

    const inventoryDays = context?.inventoryDays || 0;
    if (inventoryDays > 90) {
      if (ConstitutionalActionRegistry.isActionActive('ACTION_REDUCE_INVENTORY')) {
        actions.push('ACTION_REDUCE_INVENTORY');
      }
    }

    if (actions.length === 0) {
      if (ConstitutionalActionRegistry.isActionActive('ACTION_MAINTAIN_STRATEGY')) {
        actions.push('ACTION_MAINTAIN_STRATEGY');
      }
    }

    return actions;
  }
}
