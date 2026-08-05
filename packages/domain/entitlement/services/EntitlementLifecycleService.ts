import { Entitlement } from '../models/Entitlement';
import { EntitlementStatus } from '../value-objects/EntitlementValueObjects';

export class EntitlementLifecycleService {
  /**
   * Valida e executa a transição de estado do Entitlement.
   * Aplica regras rígidas da máquina de estados do domínio.
   */
  public transitionState(entitlement: Entitlement, targetStatus: EntitlementStatus): Entitlement {
    if (!this.canTransition(entitlement.status, targetStatus)) {
      throw new Error(`Invalid entitlement state transition from ${entitlement.status} to ${targetStatus}`);
    }

    const updatedEntitlement = { ...entitlement, status: targetStatus, updatedAt: new Date().toISOString() };
    return updatedEntitlement;
  }

  private canTransition(current: EntitlementStatus, target: EntitlementStatus): boolean {
    const transitions: Record<EntitlementStatus, EntitlementStatus[]> = {
      [EntitlementStatus.ACTIVE]: [EntitlementStatus.SUSPENDED, EntitlementStatus.REVOKED],
      [EntitlementStatus.SUSPENDED]: [EntitlementStatus.ACTIVE, EntitlementStatus.REVOKED],
      [EntitlementStatus.REVOKED]: [], // Terminal state, no reactivation
    };

    return transitions[current]?.includes(target) ?? false;
  }
}
