import { TenantEnvironment, TenantStatus, TenantLifecycleService } from '@domain/provisioning';
import { TenantProvisioningPort } from '../ports/ProvisioningPorts';

export class SuspendTenantEnvironmentUseCase {
  constructor(
    private readonly lifecycleService: TenantLifecycleService,
    private readonly tenantPort: TenantProvisioningPort
  ) {}

  /**
   * Suspends access to the physical tenant (e.g. following a revoked entitlement).
   */
  public async execute(tenant: TenantEnvironment): Promise<TenantEnvironment> {
    
    // 1. Enforce Domain State
    const suspendedTenant = this.lifecycleService.transitionState(tenant, TenantStatus.SUSPENDED);
    
    // 2. Lock down physical infrastructure
    await this.tenantPort.suspendPhysicalTenant(suspendedTenant.id);
    
    return suspendedTenant;
  }
}
