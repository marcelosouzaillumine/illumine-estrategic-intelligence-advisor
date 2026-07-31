import { CapabilityContract } from '@illumine/architecture-governance-contracts';
import { CapabilityId } from '@illumine/architecture-governance-types';
export interface CapabilityRegistryReader {
  findById(id: CapabilityId): Promise<CapabilityContract | null>;
  findAll(): Promise<ReadonlyArray<CapabilityContract>>;
}
