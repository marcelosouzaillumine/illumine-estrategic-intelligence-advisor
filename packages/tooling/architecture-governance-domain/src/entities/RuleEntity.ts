import { RuleContract } from '@illumine/architecture-governance-contracts';
import { RuleId, RuleCategory, Severity } from '@illumine/architecture-governance-types';

export class RuleEntity implements RuleContract {
  constructor(
    public readonly id: RuleId,
    public readonly version: string,
    public readonly category: RuleCategory,
    public readonly severity: Severity,
    public readonly description: string,
    public readonly autoFixSupported: boolean,
    public readonly constitutionalReference?: string,
    public readonly adrReference?: string
  ) {}
}
