export type SecurityCertificationStatus = 'CERTIFIED_SAFE' | 'UNVERIFIED' | 'BLOCKED_CONTAMINATED' | 'BLOCKED_NO_TRACE';

export interface TrustValidationResult {
  isAllowed: boolean;
  status: SecurityCertificationStatus;
  gateTraceId: string;
  violations: string[];
  certifiedAt: Date;
}
