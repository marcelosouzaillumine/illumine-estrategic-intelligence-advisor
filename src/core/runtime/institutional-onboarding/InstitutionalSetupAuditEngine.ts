import { InstitutionalOnboardingInput } from './InstitutionalOnboardingTypes';

export class InstitutionalSetupAuditEngine {
  public static validate(input: InstitutionalOnboardingInput) {
    const { auditTrail, executiveAccessGovernance } = input;
    const issues: string[] = [];
    const newAuditTrail = [...auditTrail];
    
    let deploymentInheritanceStatus: 'INVALID' | 'PARTIAL' | 'VALIDATED' = 'INVALID';
    
    if (!input.lineageHash || input.lineageHash.trim() === '') {
      issues.push('CRITICAL: Missing cryptographic lineage hash for audit.');
    } else {
      deploymentInheritanceStatus = 'VALIDATED';
    }

    if (!executiveAccessGovernance || !executiveAccessGovernance.currentUserRole) {
       issues.push('CRITICAL: Cannot audit setup without executive access context.');
       deploymentInheritanceStatus = 'INVALID';
    }

    // Always log the audit trail of this execution
    newAuditTrail.push(`[${new Date().toISOString()}] Onboarding evaluated by ${executiveAccessGovernance?.currentUserRole || 'UNKNOWN'}`);

    return {
      status: deploymentInheritanceStatus,
      newAuditTrail,
      issues
    };
  }
}
