import { RuleContract } from '@illumine/architecture-governance-contracts';
import { RuleId } from '@illumine/architecture-governance-types';
export interface RuleRegistryWriter {
  register(rule: RuleContract): Promise<void>;
}
