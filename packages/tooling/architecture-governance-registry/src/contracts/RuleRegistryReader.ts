import { RuleContract } from '@illumine/architecture-governance-contracts';
import { RuleId, RuleCategory } from '@illumine/architecture-governance-types';
export interface RuleRegistryReader {
  findById(id: RuleId): Promise<RuleContract | null>;
  findByCategory(category: RuleCategory): Promise<ReadonlyArray<RuleContract>>;
}
