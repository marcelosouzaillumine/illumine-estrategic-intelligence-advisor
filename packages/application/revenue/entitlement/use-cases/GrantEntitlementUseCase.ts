import { 
  Entitlement, 
  EntitlementStatus,
  EntitlementMapperService,
  CommercialScope,
  CommercialCapacity
} from '@domain/entitlement';
import { TenantProvisioningRequested } from '../events/IntegrationEvents';

interface GrantEntitlementCommand {
  licenseId: string;
  customerId: string; // which maps to TenantReference
  scope: CommercialScope;
  capacity: CommercialCapacity;
}

export class GrantEntitlementUseCase {
  constructor(private readonly mapperService: EntitlementMapperService) {}

  /**
   * Translates a License's Commercial Scope into Technical Capabilities (Entitlement)
   * and fires the trigger to provision the physical environment.
   */
  public execute(command: GrantEntitlementCommand): { entitlement: Entitlement; integrationEvent: TenantProvisioningRequested } {
    
    // 1. Map Commercial Intent to Technical Reality via Pure Domain Service
    const capabilities = this.mapperService.mapCapabilities(command.scope);
    const usageLimits = this.mapperService.mapLimits(command.capacity);
    const featureGates = this.mapperService.mapFeatureGates(command.scope);

    // 2. Instantiate Entitlement Aggregate
    const entitlement: Entitlement = {
      id: `ENT-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantReference: command.customerId, // Using customerId as tenant mapping for now
      licenseReference: command.licenseId,
      capabilities,
      usageLimits,
      featureGates,
      status: EntitlementStatus.ACTIVE,
    };

    // 3. Generate Integration Event to trigger Environment Provisioning (Wave 18C.7)
    const integrationEvent: TenantProvisioningRequested = {
      id: `EVT-${Date.now()}`,
      eventName: 'TenantProvisioningRequested',
      occurredAt: new Date().toISOString(),
      source: 'application:revenue:entitlement',
      payload: {
        tenantReference: entitlement.tenantReference,
        entitlementId: entitlement.id,
        capabilities: entitlement.capabilities,
        usageLimits: entitlement.usageLimits,
        featureGates: entitlement.featureGates,
      }
    };

    // 4. (In real implementation) Save Entitlement and Dispatch Events

    return { entitlement, integrationEvent };
  }
}
