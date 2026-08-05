import { License, LicenseStatus, LicenseLifecycleService } from '@domain/licensing';
import { EntitlementGrantRequested } from '../events/IntegrationEvents';

export class ActivateLicenseUseCase {
  constructor(private readonly lifecycleService: LicenseLifecycleService) {}

  /**
   * Transitions the license to ACTIVE and fires the integration event for the Entitlement Domain.
   */
  public execute(license: License): { license: License; integrationEvent: EntitlementGrantRequested } {
    
    // 1. Enforce business rules via Domain Service (PENDING -> ACTIVE)
    const activeLicense = this.lifecycleService.transitionState(license, LicenseStatus.ACTIVE);
    
    // 2. Generate Integration Event to trigger Entitlement
    const integrationEvent: EntitlementGrantRequested = {
      id: `EVT-${Date.now()}`,
      eventName: 'EntitlementGrantRequested',
      occurredAt: new Date().toISOString(),
      source: 'application:revenue:licensing',
      payload: {
        licenseId: activeLicense.id,
        customerId: activeLicense.customer,
        scope: activeLicense.scope,
        capacity: activeLicense.capacity,
      }
    };

    // 3. Dispatch Integration Event to Event Bus

    return { license: activeLicense, integrationEvent };
  }
}
