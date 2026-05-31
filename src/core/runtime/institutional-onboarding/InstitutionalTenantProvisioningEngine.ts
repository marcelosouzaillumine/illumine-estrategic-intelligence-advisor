import { InstitutionalOnboardingInput } from './InstitutionalOnboardingTypes';

export class InstitutionalTenantProvisioningEngine {
  public static validate(input: InstitutionalOnboardingInput) {
    const { tenantIsolationRuntime } = input;
    const issues: string[] = [];
    
    let provisioningStatus: 'NOT_PROVISIONED' | 'PROVISIONED' | 'VALIDATED' = 'NOT_PROVISIONED';

    if (!tenantIsolationRuntime || !tenantIsolationRuntime.tenantId) {
      issues.push('CRITICAL: Tenant not provisioned. Missing tenantId.');
      return { status: provisioningStatus, issues };
    }

    provisioningStatus = 'PROVISIONED';

    if (tenantIsolationRuntime.tenantId.trim() === '' || tenantIsolationRuntime.tenantId === 'tenant-placeholder') {
      issues.push('CRITICAL: Invalid or placeholder tenantId detected.');
      return { status: provisioningStatus, issues };
    }

    provisioningStatus = 'VALIDATED';
    
    return {
      status: provisioningStatus,
      issues
    };
  }
}
