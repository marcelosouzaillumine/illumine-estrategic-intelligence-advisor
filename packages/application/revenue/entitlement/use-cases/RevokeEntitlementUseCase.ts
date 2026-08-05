import { Entitlement, EntitlementStatus, EntitlementLifecycleService } from '@domain/entitlement';

export class RevokeEntitlementUseCase {
  constructor(private readonly lifecycleService: EntitlementLifecycleService) {}

  /**
   * Revokes access to capabilities based on license termination.
   */
  public execute(entitlement: Entitlement): Entitlement {
    // 1. Enforce business rules via Domain Service (ACTIVE/SUSPENDED -> REVOKED)
    const revokedEntitlement = this.lifecycleService.transitionState(entitlement, EntitlementStatus.REVOKED);
    
    // 2. Dispatch Domain Event (EntitlementRevoked) which will physically lock out the tenant
    
    return revokedEntitlement;
  }
}
