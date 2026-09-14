import { CapabilityContract } from '@illumine/architecture-governance-contracts';
import { CapabilityId } from '@illumine/architecture-governance-types';
export interface CapabilityRegistryWriter {
  register(capability: CapabilityContract): Promise<void>;
  update(id: CapabilityId, capability: Partial<CapabilityContract>): Promise<void>;
}
