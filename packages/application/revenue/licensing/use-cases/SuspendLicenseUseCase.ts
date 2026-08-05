import { License, LicenseStatus, LicenseLifecycleService } from '@domain/licensing';

export class SuspendLicenseUseCase {
  constructor(private readonly lifecycleService: LicenseLifecycleService) {}

  /**
   * Suspend a license (e.g., due to payment failure or manual intervention).
   */
  public execute(license: License): License {
    // 1. Enforce business rules via Domain Service (ACTIVE -> SUSPENDED)
    const suspendedLicense = this.lifecycleService.transitionState(license, LicenseStatus.SUSPENDED);
    
    // 2. Dispatch Domain Event (LicenseSuspended)

    return suspendedLicense;
  }
}
