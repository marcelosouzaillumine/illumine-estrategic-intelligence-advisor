export type FindingSeverity = 'S0' | 'S1' | 'S2' | 'S3' | 'S4';
export type ImpactCategory = 'Architecture' | 'Runtime' | 'Performance' | 'DeveloperExperience' | 'Maintainability' | 'Security' | 'Business';
export type ARBDecision = 'APPROVED' | 'APPROVED_WITH_OBSERVATIONS' | 'CONDITIONAL_APPROVAL' | 'REJECTED';

export interface EvidenceRecord {
  readonly evidenceId: string;
  readonly inspectedFile: string;
  readonly lineRange?: string;
  readonly commandExecuted?: string;
  readonly verificationStatus: 'VERIFIED' | 'NOT_VERIFIED';
}

export interface ReadinessFinding {
  readonly findingId: string;
  readonly title: string;
  readonly severity: FindingSeverity;
  readonly impactCategory: ImpactCategory;
  readonly evidence: EvidenceRecord;
  readonly resolution?: string;
}

export interface ProductReadinessContract {
  readonly readinessId: string;
  readonly version: string;
  readonly auditTimestamp: string;
  readonly totalComponents: number;
  readonly componentsUsed: number;
  readonly unusedComponents: number;
  readonly coveragePercent: number;
  readonly findings: readonly ReadinessFinding[];
  readonly arbDecision: ARBDecision;
}
