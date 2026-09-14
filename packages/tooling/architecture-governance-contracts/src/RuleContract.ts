import { RuleId, RuleCategory, Severity } from '@illumine/architecture-governance-types';

export interface RuleContract {
  id: RuleId;
  version: string;
  category: RuleCategory;
  severity: Severity;
  description: string;
  constitutionalReference?: string;
  adrReference?: string;
  autoFixSupported: boolean;
}
