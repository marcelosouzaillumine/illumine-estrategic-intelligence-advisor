import { RuntimeConfidence, RuntimeViolation } from '../../../runtime/types';
import { EntityGraphData } from '../../../topology/types';

export interface ConsolidationEntity {
  id: string;
  name: string;
  role: 'PARENT' | 'SUBSIDIARY' | 'JV' | 'BRANCH';
  ownershipPercentage: number;
  consolidationMethod: 'FULL' | 'PROPORTIONAL' | 'EQUITY';
}

export interface FinancialStatementLine {
  accountId: string;
  category: string;
  cleanCategory?: string;
  value: number;
  computedValue?: number;
  type?: string; // 'ativo', 'passivo', 'receita', 'custo'
  parentId?: string | null;
  level?: number;
  isSynthetic?: boolean;
}

export interface AccountProvenance {
  entityId: string;
  accountId: string;
  value: number;
}

export interface ConsolidatedFinancialStatementLine extends FinancialStatementLine {
  eliminatedValue: number;
  consolidatedValue: number;
  provenance: AccountProvenance[];
}

export interface EliminationRecord {
  eliminationId: string;
  type: 'MUTUO' | 'RECEITA_DESPESA' | 'DIVIDENDO' | 'INVESTIMENTO';
  sourceEntityId: string;
  targetEntityId: string;
  sourceAccountCategory: string;
  targetAccountCategory: string;
  amount: number;
  status: 'MATCHED' | 'PARTIAL_MATCH' | 'UNMATCHED';
  isMaterial: boolean;
  impactOnConsolidated: number;
  confidence: RuntimeConfidence;
  violation?: RuntimeViolation;
}

export interface EntityProvenance {
  sourceEntityId: string;
  metricOrigin: string;
  originalValue: number;
  eliminatedValue: number;
  consolidatedValue: number;
}

export interface ConsolidatedFinancialInput {
  groupId: string;
  legacyClientId?: string;
  fiscalYear: string;
  entities: ConsolidationEntity[];
  bpByEntity: Record<string, FinancialStatementLine[]>;
  dreByEntity: Record<string, FinancialStatementLine[]>;
  consolidationScope: string[];
  topologySnapshot: EntityGraphData;
  confidenceByEntity: Record<string, RuntimeConfidence>;
  sourceMetadata: Record<string, any>;
}

export interface ConsolidatedFinancialOutput {
  groupId: string;
  fiscalYear: string;
  consolidatedBP: ConsolidatedFinancialStatementLine[];
  consolidatedDRE: ConsolidatedFinancialStatementLine[];
  eliminations: EliminationRecord[];
  entityLineage: Record<string, EntityProvenance[]>;
  accountLineage: Record<string, AccountProvenance[]>;
  confidence: RuntimeConfidence;
  violations: RuntimeViolation[];
  warnings: string[];
  auditTrail: any[];
}
