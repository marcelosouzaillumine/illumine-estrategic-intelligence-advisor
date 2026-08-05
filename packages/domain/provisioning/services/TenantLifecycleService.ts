import { TenantEnvironment } from '../models/TenantEnvironment';
import { TenantStatus, OperationalHealth } from '../value-objects/ProvisioningValueObjects';

export class TenantLifecycleService {
  /**
   * Valida e executa a transição de estado do Tenant.
   * Aplica regras rígidas da máquina de estados do domínio.
   */
  public transitionState(tenant: TenantEnvironment, targetStatus: TenantStatus): TenantEnvironment {
    if (!this.canTransition(tenant.status, targetStatus)) {
      throw new Error(`Invalid tenant state transition from ${tenant.status} to ${targetStatus}`);
    }

    const updatedTenant = { ...tenant, status: targetStatus, updatedAt: new Date().toISOString() };
    
    // Auto-update timestamps and health when activating
    if (targetStatus === TenantStatus.ACTIVE) {
      if (!updatedTenant.activatedAt) {
        updatedTenant.activatedAt = new Date().toISOString();
      }
      updatedTenant.operationalHealth = OperationalHealth.HEALTHY;
    }
    
    // Mark health degraded if suspended
    if (targetStatus === TenantStatus.SUSPENDED) {
      updatedTenant.operationalHealth = OperationalHealth.DEGRADED;
    }

    return updatedTenant;
  }

  public reportFailure(tenant: TenantEnvironment): TenantEnvironment {
    return { ...tenant, operationalHealth: OperationalHealth.FAILED, updatedAt: new Date().toISOString() };
  }

  private canTransition(current: TenantStatus, target: TenantStatus): boolean {
    const transitions: Record<TenantStatus, TenantStatus[]> = {
      [TenantStatus.REQUESTED]: [TenantStatus.PROVISIONING],
      [TenantStatus.PROVISIONING]: [TenantStatus.ACTIVE, TenantStatus.SUSPENDED], // Can suspend if provisioning fails critically
      [TenantStatus.ACTIVE]: [TenantStatus.SUSPENDED, TenantStatus.DECOMMISSIONED],
      [TenantStatus.SUSPENDED]: [TenantStatus.ACTIVE, TenantStatus.DECOMMISSIONED],
      [TenantStatus.DECOMMISSIONED]: [], // Terminal state
    };

    return transitions[current]?.includes(target) ?? false;
  }
}
