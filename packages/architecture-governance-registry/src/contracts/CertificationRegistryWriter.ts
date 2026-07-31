import { CertificationContract } from '@illumine/architecture-governance-contracts';
import { CertificationId } from '@illumine/architecture-governance-types';
export interface CertificationRegistryWriter {
  issue(certification: CertificationContract): Promise<void>;
}
