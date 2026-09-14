import { ReleaseId, CertificationId } from '@illumine/architecture-governance-types';

export interface ReleaseContract {
  id: ReleaseId;
  version: string;
  releaseType: 'Major' | 'Minor' | 'Patch' | 'Hotfix';
  build: string;
  certificationId: CertificationId;
  approvedBy: readonly string[];
  deployedAt: Date;
}
