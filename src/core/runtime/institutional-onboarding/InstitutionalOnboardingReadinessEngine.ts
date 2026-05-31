import { InstitutionalOnboardingInput } from './InstitutionalOnboardingTypes';

export class InstitutionalOnboardingReadinessEngine {
  public static validate(input: InstitutionalOnboardingInput) {
    const { organizationalMetadata, onboardingDocumentation, operationalChecklist } = input;
    const issues: string[] = [];
    
    let organizationalReadinessStatus: 'INCOMPLETE' | 'PARTIAL' | 'VALIDATED' = 'INCOMPLETE';
    let fiduciaryValidationStatus: 'PENDING' | 'PARTIAL' | 'VALIDATED' = 'PENDING';

    // Organizational Readiness
    if (!organizationalMetadata || !organizationalMetadata.organizationName) {
      issues.push('CRITICAL: Missing organization metadata.');
    }
    
    let checklistPassed = 0;
    if (operationalChecklist) {
      if (operationalChecklist.dataIngestionConfigured) checklistPassed++;
      else issues.push('CRITICAL: Data ingestion not configured.');
      
      if (operationalChecklist.userRolesMapped) checklistPassed++;
      else issues.push('CRITICAL: User roles not mapped.');
      
      if (operationalChecklist.baselineMetricsEstablished) checklistPassed++;
      else issues.push('CRITICAL: Baseline metrics not established.');
    } else {
      issues.push('CRITICAL: Operational checklist is missing.');
    }

    if (checklistPassed === 3) {
      organizationalReadinessStatus = 'VALIDATED';
    } else if (checklistPassed > 0) {
      organizationalReadinessStatus = 'PARTIAL';
    }

    // Fiduciary Validation
    let docsPassed = 0;
    if (onboardingDocumentation) {
      if (onboardingDocumentation.masterServiceAgreementSigned) docsPassed++;
      else issues.push('CRITICAL: Master Service Agreement (MSA) not signed.');
      
      if (onboardingDocumentation.dataProcessingAgreementSigned) docsPassed++;
      else issues.push('CRITICAL: Data Processing Agreement (DPA) not signed.');
      
      if (onboardingDocumentation.fiduciaryCharterAccepted) docsPassed++;
      else issues.push('CRITICAL: Fiduciary Charter not accepted.');
      
      if (onboardingDocumentation.operationalPlaybookGenerated) docsPassed++;
      else issues.push('WARNING: Operational playbook not generated.');
    } else {
      issues.push('CRITICAL: Onboarding documentation is missing.');
    }

    if (docsPassed === 4) {
      fiduciaryValidationStatus = 'VALIDATED';
    } else if (docsPassed > 0) {
      fiduciaryValidationStatus = 'PARTIAL';
    }

    return {
      organizationalReadinessStatus,
      fiduciaryValidationStatus,
      issues
    };
  }
}
