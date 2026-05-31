import { InstitutionalOnboardingInput } from './InstitutionalOnboardingTypes';

export class OrganizationalSegregationValidationEngine {
  public static validate(input: InstitutionalOnboardingInput) {
    const { tenantIsolationRuntime } = input;
    const issues: string[] = [];
    
    let isolationStatus: 'UNSAFE' | 'ISOLATED' | 'VALIDATED' = 'UNSAFE';
    
    if (!tenantIsolationRuntime) {
      issues.push('CRITICAL: Missing tenant isolation context.');
      return { status: isolationStatus, issues };
    }

    if (tenantIsolationRuntime.hasCrossTenantAccess) {
      issues.push('CRITICAL: Cross-tenant data contamination detected.');
      return { status: isolationStatus, issues };
    }

    isolationStatus = 'ISOLATED';

    // If fully in production and it's a production tenant and there's no contamination
    if (tenantIsolationRuntime.isProductionTenant && input.environmentConfiguration.environmentType === 'PRODUCTION') {
      isolationStatus = 'VALIDATED';
    }

    // Pilot tenants in Pilot env are also validated for segregation if no cross access
    if (tenantIsolationRuntime.isPilotTenant && input.environmentConfiguration.environmentType === 'PILOT') {
       isolationStatus = 'VALIDATED';
    }

    // Default to VALIDATED if simply isolated, though more strict conditions apply above
    if (isolationStatus === 'ISOLATED' && !tenantIsolationRuntime.hasCrossTenantAccess) {
      isolationStatus = 'VALIDATED';
    }

    return {
      status: isolationStatus,
      issues
    };
  }
}
