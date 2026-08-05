import { 
  TenantEnvironment, 
  TenantStatus,
  OperationalHealth,
  TenantConfig,
  AdminIdentity,
  TenantLifecycleService
} from '@domain/provisioning';
import { TenantProvisioningPort, IdentityProvisioningPort } from '../ports/ProvisioningPorts';
import { TenantReadyForAccess } from '../events/IntegrationEvents';

interface ProvisionTenantCommand {
  tenantReference: string;
  entitlementId: string;
  adminEmail: string;
  capabilities: { code: string; category: string }[];
}

export class ProvisionTenantUseCase {
  constructor(
    private readonly lifecycleService: TenantLifecycleService,
    private readonly tenantPort: TenantProvisioningPort,
    private readonly identityPort: IdentityProvisioningPort
  ) {}

  /**
   * Converts a granted entitlement into a physically accessible tenant environment.
   */
  public async execute(command: ProvisionTenantCommand): Promise<{ tenant: TenantEnvironment; integrationEvent?: TenantReadyForAccess }> {
    
    // 1. Prepare global settings configuration
    const config: TenantConfig = {
      locale: 'pt-BR', // Defaulting for now, could be passed in command
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'pt-BR'
    };

    // 2. Instantiate Aggregate in REQUESTED state
    let tenant: TenantEnvironment = {
      id: command.tenantReference, // Using customer reference as tenant ID for parity
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerReference: command.tenantReference,
      entitlementReference: command.entitlementId,
      configuration: config,
      adminIdentity: { identityReference: 'PENDING', role: 'TENANT_ADMIN' }, // Placeholder before actual creation
      capabilities: command.capabilities.map(c => c.code),
      status: TenantStatus.REQUESTED,
      operationalHealth: OperationalHealth.HEALTHY,
    };

    // 3. Transition to PROVISIONING
    tenant = this.lifecycleService.transitionState(tenant, TenantStatus.PROVISIONING);

    try {
      // 4. Interact with Infrastructure Adapters (Create Auth User, Setup DB)
      const identityRef = await this.identityPort.provisionAdminIdentity(command.adminEmail, tenant.id);
      tenant.adminIdentity.identityReference = identityRef;
      
      await this.tenantPort.createPhysicalTenant(tenant.id, {
        capabilities: tenant.capabilities,
        config: tenant.configuration
      });

      // 5. Transition to ACTIVE
      tenant = this.lifecycleService.transitionState(tenant, TenantStatus.ACTIVE);

      // 6. Generate final Integration Event 
      const integrationEvent: TenantReadyForAccess = {
        id: `EVT-${Date.now()}`,
        eventName: 'TenantReadyForAccess',
        occurredAt: new Date().toISOString(),
        source: 'application:revenue:provisioning',
        payload: {
          tenantId: tenant.id,
          customerId: tenant.customerReference,
          adminIdentityReference: tenant.adminIdentity.identityReference,
          activatedCapabilities: tenant.capabilities,
          accessUrl: `https://app.illumine.com.br/t/${tenant.id}`
        }
      };

      return { tenant, integrationEvent };

    } catch (error) {
      // Handle physical provisioning failure (e.g. Firebase is down)
      tenant = this.lifecycleService.reportFailure(tenant);
      return { tenant };
    }
  }
}
