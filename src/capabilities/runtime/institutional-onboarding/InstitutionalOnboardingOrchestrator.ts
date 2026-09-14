import { InstitutionalOnboardingInput, InstitutionalOnboardingOutput } from './InstitutionalOnboardingTypes';
import { InstitutionalTenantProvisioningEngine } from './InstitutionalTenantProvisioningEngine';
import { InstitutionalOnboardingReadinessEngine } from './InstitutionalOnboardingReadinessEngine';
import { TenantActivationGovernanceEngine } from './TenantActivationGovernanceEngine';
import { OrganizationalSegregationValidationEngine } from './OrganizationalSegregationValidationEngine';
import { InstitutionalSetupAuditEngine } from './InstitutionalSetupAuditEngine';

export class InstitutionalOnboardingOrchestrator {
  public static evaluate(input: InstitutionalOnboardingInput): InstitutionalOnboardingOutput {
    // 1. Run Core Engines
    const provisioning = InstitutionalTenantProvisioningEngine.validate(input);
    const readiness = InstitutionalOnboardingReadinessEngine.validate(input);
    const governance = TenantActivationGovernanceEngine.validate(input);
    const segregation = OrganizationalSegregationValidationEngine.validate(input);
    const audit = InstitutionalSetupAuditEngine.validate(input);

    // 2. Aggregate Issues
    const unresolvedSetupIssues = [
      ...provisioning.issues.filter(i => i.startsWith('CRITICAL:')),
      ...readiness.issues.filter(i => i.startsWith('CRITICAL:')),
      ...governance.issues.filter(i => i.startsWith('CRITICAL:')),
      ...segregation.issues.filter(i => i.startsWith('CRITICAL:')),
      ...audit.issues.filter(i => i.startsWith('CRITICAL:'))
    ];

    const onboardingWarnings = [
      ...provisioning.issues.filter(i => i.startsWith('WARNING:')),
      ...readiness.issues.filter(i => i.startsWith('WARNING:')),
      ...governance.issues.filter(i => i.startsWith('WARNING:')),
      ...segregation.issues.filter(i => i.startsWith('WARNING:')),
      ...audit.issues.filter(i => i.startsWith('WARNING:'))
    ];

    // 3. Fail-Closed Onboarding Protection
    let onboardingBlocked = false;
    const blockedActivationReasons: string[] = [...unresolvedSetupIssues];

    // User's specific rule: DeploymentReadiness MUST be FULL_PRODUCTION_READY to achieve FULL_INSTITUTIONAL_OPERATION
    // Also, if Mock/Debug active in production -> block onboarding.
    // The user requested: mock data usage allowed but strict dev/test isolation limits
    if (input.environmentConfiguration.environmentType === 'PRODUCTION') {
       // Mock is blocked in Production via previous deployment readiness layer, but we double-check here
       if (input.deploymentReadinessReport.overallStatus !== 'DEPLOYMENT_READY') {
         onboardingBlocked = true;
         blockedActivationReasons.push('CRITICAL: Deployment readiness is not DEPLOYMENT_READY. Tenant cannot be activated for production.');
       }
    }

    if (unresolvedSetupIssues.length > 0 || segregation.status === 'UNSAFE') {
      onboardingBlocked = true;
    }

    // 4. Determine Stage
    let onboardingStage: InstitutionalOnboardingOutput['onboardingStage'] = 'PRE_ONBOARDING';
    let onboardingNarrative = 'Onboarding process not started.';

    if (onboardingBlocked) {
       onboardingStage = 'PRE_ONBOARDING'; // Or freeze wherever it is
       onboardingNarrative = 'Onboarding blocked due to fail-closed fiduciary safety rules.';
    } else {
       if (provisioning.status === 'VALIDATED') {
         onboardingStage = 'TENANT_PROVISIONED';
         onboardingNarrative = 'Tenant provisioned successfully.';
         
         if (readiness.fiduciaryValidationStatus === 'VALIDATED' && readiness.organizationalReadinessStatus === 'VALIDATED') {
           onboardingStage = 'FIDUCIARY_VALIDATION';
           onboardingNarrative = 'Fiduciary documentation and readiness validated.';
           
           if (input.environmentConfiguration.environmentType === 'PILOT') {
             onboardingStage = 'PILOT_ACTIVATION';
             onboardingNarrative = 'Tenant authorized for pilot execution.';
           } else if (input.environmentConfiguration.environmentType === 'PRODUCTION') {
             if (governance.status === 'AUTHORIZED') {
               onboardingStage = 'FULL_INSTITUTIONAL_OPERATION';
               onboardingNarrative = 'Organization is fully operational and institutional runtime is active.';
             } else {
               onboardingStage = 'LIMITED_OPERATION';
               onboardingNarrative = 'Organization operating under limited capabilities due to governance constraints.';
             }
           }
         }
       }
    }

    // Explicit Mocks/Debug Protection check (Rule 1 of user response)
    // If we're not in LOCAL or DEV and mocks are active, block everything.
    const isLocalOrDev = input.environmentConfiguration.environmentType === 'LOCAL' || input.environmentConfiguration.environmentType === 'DEVELOPMENT';
    if (!isLocalOrDev && input.environmentConfiguration.mockFactoriesEnabled) {
       onboardingBlocked = true;
       onboardingStage = 'PRE_ONBOARDING';
       if (!blockedActivationReasons.includes('CRITICAL: Mocks active in restricted environment.')) {
         blockedActivationReasons.push('CRITICAL: Mocks active in restricted environment.');
       }
    }

    let confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';
    if (onboardingBlocked || !isLocalOrDev && input.environmentConfiguration.mockFactoriesEnabled) {
      confidenceLevel = 'LOW';
    } else if (onboardingWarnings.length > 0) {
      confidenceLevel = 'MODERATE';
    }

    return {
      onboardingStage,
      onboardingBlocked,
      tenantProvisioningStatus: provisioning.status,
      organizationalReadinessStatus: readiness.organizationalReadinessStatus,
      fiduciaryValidationStatus: readiness.fiduciaryValidationStatus,
      tenantIsolationStatus: segregation.status,
      activationGovernanceStatus: (!isLocalOrDev && input.environmentConfiguration.mockFactoriesEnabled) ? 'BLOCKED' : governance.status,
      deploymentInheritanceStatus: audit.status,
      unresolvedSetupIssues,
      onboardingWarnings,
      blockedActivationReasons,
      operationalRecommendations: [],
      onboardingNarrative,
      setupAuditTrail: audit.newAuditTrail,
      lineageHash: input.lineageHash,
      confidenceLevel
    };
  }
}
