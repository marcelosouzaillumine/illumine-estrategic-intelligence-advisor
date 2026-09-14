import { InstitutionalDeploymentReadinessOutput, TenantIsolationRuntime } from '../deployment-readiness/DeploymentReadinessTypes';
import { OrganizationalMetadata, InstitutionalOnboardingOutput } from '../institutional-onboarding/InstitutionalOnboardingTypes';

export type DocumentType = 
  | 'BP'
  | 'DRE'
  | 'DFC'
  | 'DLPA'
  | 'BALANCETE'
  | 'SPED'
  | 'AUDIT'
  | 'NOTAS_EXPLICATIVAS'
  | 'FLUXOS_AUXILIARES'
  | 'DEMONSTRATIVOS_CONSOLIDADOS'
  | 'UNKNOWN';

export interface EvidenceDocument {
  id: string;
  type: DocumentType;
  hash: string;
  isSyntheticMock: boolean;
  timestamp: string;
  metadata: {
    period: string;
    currency: string;
    confidence: number;
    tenantId: string;
  };
  rawContentReference?: any; // Pointer to the parsed array/object
}

export interface InstitutionalEvidenceInput {
  environmentConfiguration: {
    environmentType: string;
    mockFactoriesEnabled: boolean;
  };
  tenantIsolationRuntime: TenantIsolationRuntime;
  organizationalMetadata: OrganizationalMetadata;
  onboardingStatus: InstitutionalOnboardingOutput;
  deploymentReadiness: InstitutionalDeploymentReadinessOutput;
  uploadedDocuments: EvidenceDocument[];
  uploadAuditContext: {
    uploaderId: string;
    timestamp: string;
    ipHash: string;
  };
  historicalEvidenceRegistry: EvidenceDocument[];
}

export interface InstitutionalEvidenceValidationOutput {
  evidenceStatus:
    | 'UNVALIDATED'
    | 'PARTIALLY_VALIDATED'
    | 'VALIDATED'
    | 'FIDUCIARY_TRUSTED';

  fiduciaryInterpretationBlocked: boolean;

  evidenceIntegrityStatus:
    | 'INVALID'
    | 'PARTIAL'
    | 'VALIDATED';

  reconciliationStatus:
    | 'FAILED'
    | 'PARTIAL'
    | 'RECONCILED';

  tenantIsolationStatus:
    | 'UNSAFE'
    | 'ISOLATED'
    | 'VALIDATED';

  temporalConsistencyStatus:
    | 'INCONSISTENT'
    | 'PARTIAL'
    | 'VALIDATED';

  lineageValidationStatus:
    | 'INVALID'
    | 'PARTIAL'
    | 'VALIDATED';

  duplicateEvidenceDetected: boolean;
  conflictingEvidenceDetected: boolean;

  unresolvedEvidenceIssues: string[];
  reconciliationWarnings: string[];
  blockedInterpretationReasons: string[];
  evidenceRecommendations: string[];

  evidenceNarrative: string;
  uploadAuditTrail: string[];
  lineageHash: string;

  confidenceLevel:
    | 'LOW'
    | 'MODERATE'
    | 'HIGH';
}
