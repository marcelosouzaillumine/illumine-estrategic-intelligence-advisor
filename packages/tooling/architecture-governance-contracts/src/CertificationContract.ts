import { CertificationId, CertificationStatus, GateResult } from '@illumine/architecture-governance-types';

export interface CertificationContract {
  id: CertificationId;
  targetId: string;
  scope: 'Platform' | 'Capability' | 'Release' | 'AI' | 'Security' | 'Data';
  version: string;
  issuedAt: Date;
  expiresAt: Date;
  score: number;
  status: CertificationStatus;
  gateResult: GateResult;
  seal: string;
}
