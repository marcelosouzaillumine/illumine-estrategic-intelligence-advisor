export enum AdvisorLevel {
  FOUNDATION = 'FOUNDATION',
  EXECUTIVE_ADVISORY = 'EXECUTIVE_ADVISORY',
  ENTERPRISE_TRANSFORMATION = 'ENTERPRISE_TRANSFORMATION'
}

export interface Certification {
  certificationId: string;
  level: AdvisorLevel;
  issuedAt: string; // ISO-8601
  expiresAt: string; // ISO-8601
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}
