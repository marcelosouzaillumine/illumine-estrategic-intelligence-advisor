import { CertificationContract } from '@illumine/architecture-governance-contracts';
import { CertificationId } from '@illumine/architecture-governance-types';
export interface CertificationRegistryReader {
  verify(id: CertificationId): Promise<CertificationContract | null>;
}
