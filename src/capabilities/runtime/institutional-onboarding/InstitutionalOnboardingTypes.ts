import { DeploymentEnvironment, ExecutiveAccessRole, InstitutionalDeploymentReadinessOutput, TenantIsolationRuntime } from '../deployment-readiness/DeploymentReadinessTypes';
import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';

export interface OrganizationalMetadata {
  organizationName: string;
  industry: string;
  jurisdiction: string;
  fiduciaryLevelRequired: 'STANDARD' | 'STRICT' | 'SOVEREIGN';
}

export interface OnboardingDocumentation {
  masterServiceAgreementSigned: boolean;
  dataProcessingAgreementSigned: boolean;
  fiduciaryCharterAccepted: boolean;
  operationalPlaybookGenerated: boolean;
}

export interface InstitutionalConfiguration {
  allowedEnvironments: DeploymentEnvironment[];
  maxAuthorizedUsers: number;
  featuresEnabled: string[];
}

export interface OperationalChecklist {
  dataIngestionConfigured: boolean;
  userRolesMapped: boolean;
  baselineMetricsEstablished: boolean;
}

export interface PilotGovernanceStatus {
  pilotApproved: boolean;
  pilotDurationDays: number;
  pilotSupervisors: string[];
}

export interface InstitutionalOnboardingInput {
  environmentConfiguration: {
    environmentType: DeploymentEnvironment;
    mockFactoriesEnabled: boolean;
    debugModeEnabled: boolean;
  };
  deploymentReadinessReport: InstitutionalDeploymentReadinessOutput;
  executiveAccessGovernance: {
    currentUserRole: ExecutiveAccessRole;
  };
  tenantIsolationRuntime: TenantIsolationRuntime;
  organizationalMetadata: OrganizationalMetadata;
  onboardingDocumentation: OnboardingDocumentation;
  institutionalConfiguration: InstitutionalConfiguration;
  operationalChecklist: OperationalChecklist;
  pilotGovernanceStatus: PilotGovernanceStatus;
  executiveReport: ExecutiveIntelligenceReport;
  auditTrail: string[];
  lineageHash: string;
}

export interface InstitutionalOnboardingOutput {
  onboardingStage:
    | 'PRE_ONBOARDING'
    | 'TENANT_PROVISIONED'
    | 'FIDUCIARY_VALIDATION'
    | 'PILOT_ACTIVATION'
    | 'LIMITED_OPERATION'
    | 'FULL_INSTITUTIONAL_OPERATION';

  onboardingBlocked: boolean;

  tenantProvisioningStatus:
    | 'NOT_PROVISIONED'
    | 'PROVISIONED'
    | 'VALIDATED';

  organizationalReadinessStatus:
    | 'INCOMPLETE'
    | 'PARTIAL'
    | 'VALIDATED';

  fiduciaryValidationStatus:
    | 'PENDING'
    | 'PARTIAL'
    | 'VALIDATED';

  tenantIsolationStatus:
    | 'UNSAFE'
    | 'ISOLATED'
    | 'VALIDATED';

  activationGovernanceStatus:
    | 'BLOCKED'
    | 'LIMITED'
    | 'AUTHORIZED';

  deploymentInheritanceStatus:
    | 'INVALID'
    | 'PARTIAL'
    | 'VALIDATED';

  unresolvedSetupIssues: string[];
  onboardingWarnings: string[];
  blockedActivationReasons: string[];
  operationalRecommendations: string[];
  onboardingNarrative: string;
  setupAuditTrail: string[];
  lineageHash: string;
  
  confidenceLevel:
    | 'LOW'
    | 'MODERATE'
    | 'HIGH';
}
