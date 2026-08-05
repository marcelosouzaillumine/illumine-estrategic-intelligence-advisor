import { License } from '../models/License';
import { LicenseStatus } from '../value-objects/LicenseValueObjects';

export class LicenseLifecycleService {
  /**
   * Valida e executa a transição de estado da licença.
   * Aplica regras rígidas da máquina de estados do domínio.
   */
  public transitionState(license: License, targetStatus: LicenseStatus): License {
    if (!this.canTransition(license.status, targetStatus)) {
      throw new Error(`Invalid license state transition from ${license.status} to ${targetStatus}`);
    }

    const updatedLicense = { ...license, status: targetStatus, updatedAt: new Date().toISOString() };
    
    // Auto-update lifecycle timestamps based on the target status
    if (targetStatus === LicenseStatus.ACTIVE) {
      if (!updatedLicense.issuedAt) {
        updatedLicense.issuedAt = new Date().toISOString();
      }
    }

    return updatedLicense;
  }

  private canTransition(current: LicenseStatus, target: LicenseStatus): boolean {
    const transitions: Record<LicenseStatus, LicenseStatus[]> = {
      [LicenseStatus.PENDING]: [LicenseStatus.ACTIVE, LicenseStatus.REVOKED],
      [LicenseStatus.ACTIVE]: [LicenseStatus.SUSPENDED, LicenseStatus.EXPIRED, LicenseStatus.REVOKED],
      [LicenseStatus.SUSPENDED]: [LicenseStatus.ACTIVE, LicenseStatus.REVOKED],
      [LicenseStatus.EXPIRED]: [], // Terminal state, no reactivation
      [LicenseStatus.REVOKED]: [], // Terminal state, no reactivation
    };

    return transitions[current]?.includes(target) ?? false;
  }
}
