import { InstitutionalOnboardingInput } from './InstitutionalOnboardingTypes';

export class TenantActivationGovernanceEngine {
  public static validate(input: InstitutionalOnboardingInput) {
    const { pilotGovernanceStatus, environmentConfiguration, executiveAccessGovernance } = input;
    const issues: string[] = [];
    
    let activationGovernanceStatus: 'BLOCKED' | 'LIMITED' | 'AUTHORIZED' = 'BLOCKED';
    
    if (!executiveAccessGovernance || !executiveAccessGovernance.currentUserRole) {
      issues.push('CRITICAL: Executive Access Governance role missing.');
      return { status: activationGovernanceStatus, issues };
    }

    const role = executiveAccessGovernance.currentUserRole;

    if (environmentConfiguration.environmentType === 'PRODUCTION') {
      if (role !== 'MASTER_SUPERVISOR' && role !== 'TENANT_ADMIN') {
        issues.push(`CRITICAL: Role ${role} is not authorized for FULL_OPERATION activation.`);
      } else {
        activationGovernanceStatus = 'AUTHORIZED';
      }
    } else if (environmentConfiguration.environmentType === 'PILOT') {
      if (!pilotGovernanceStatus || !pilotGovernanceStatus.pilotApproved) {
        issues.push('CRITICAL: Pilot not approved for this tenant.');
      } else {
        activationGovernanceStatus = 'LIMITED'; // pilot is technically limited operation
      }
    } else {
      // Local, Staging, Dev are limited context.
      activationGovernanceStatus = 'LIMITED';
    }

    if (issues.length > 0) {
      activationGovernanceStatus = 'BLOCKED';
    }

    return {
      status: activationGovernanceStatus,
      issues
    };
  }
}
