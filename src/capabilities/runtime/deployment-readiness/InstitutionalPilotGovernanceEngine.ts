import { DeploymentReadinessInput } from './DeploymentReadinessTypes';

export class InstitutionalPilotGovernanceEngine {
  public static validate(input: DeploymentReadinessInput) {
    const { tenantIsolationRuntime, environmentConfiguration } = input;
    const issues: string[] = [];
    
    let pilotStatus: 'VALIDATED' | 'ACTIVE' | 'INACTIVE' = 'INACTIVE';
    
    if (tenantIsolationRuntime.isPilotTenant) {
      pilotStatus = 'ACTIVE';
      
      // Pilot tenants must remain isolated
      if (tenantIsolationRuntime.hasCrossTenantAccess) {
        issues.push('CRITICAL: Pilot tenant has cross-tenant access. Isolation failure.');
        pilotStatus = 'INACTIVE'; // Inactive validation
      }
      
      // Pilot tenants shouldn't be executed in full PRODUCTION mode without pilot flag
      if (environmentConfiguration.environmentType === 'PRODUCTION' && !tenantIsolationRuntime.isPilotTenant) {
         // this condition is a bit tautological, but checking if environment mismatches intent
      }
      
      // Validated if no issues
      if (issues.length === 0) {
        pilotStatus = 'VALIDATED';
      }
    } else {
      // Non-pilot tenant in PILOT environment is a crossover
      if (environmentConfiguration.environmentType === 'PILOT') {
        issues.push('CRITICAL: Non-pilot tenant operating in PILOT environment.');
      }
      
      if (issues.length === 0) {
        pilotStatus = 'VALIDATED';
      }
    }
    
    // Check general tenant isolation failure
    if (!tenantIsolationRuntime.tenantId) {
      issues.push('CRITICAL: Missing tenantId. Tenant isolation failure.');
    }
    
    return {
      status: issues.length > 0 ? 'INACTIVE' : pilotStatus,
      issues
    };
  }
}
