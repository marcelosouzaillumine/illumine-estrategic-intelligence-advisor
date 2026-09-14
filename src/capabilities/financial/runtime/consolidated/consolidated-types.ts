export interface EntityLineageNode {
  entityId: string;
  role: 'Holding' | 'Subsidiary' | 'Branch' | 'JV';
  contributionPercentage: number;
}

import { SystemicRiskProfile } from './stress/stress-types';

export interface EntityProvenance {
  sourceEntityId: string;
  metricOrigin: string;
  originalValue: number;
  eliminatedValue: number;
  consolidatedValue: number;
}

export interface ConsolidatedConfidence {
  overallLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
  confidenceByEntity: Record<string, 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'>;
  degradationReason?: string;
}

export interface ConsolidatedViolation {
  violationId: string;
  severity: 'WARNING' | 'CRITICAL' | 'DEFAULT';
  sourceEntityId: string;
  propagatedToGroup: boolean;
  description: string;
}

export interface EliminatedValueRecord {
  eliminationId: string;
  type: 'Intercompany Receivables' | 'Intercompany Payables' | 'Intercompany Revenue' | 'Intercompany Expense' | 'Capital Investment' | 'Mutuo';
  sourceEntityId: string;
  targetEntityId: string;
  amount: number;
  justification: string;
}

export type EliminationMatchConfidence = 'EXACT_MATCH' | 'PROBABLE_MATCH' | 'LOW_CONFIDENCE_MATCH' | 'UNRECONCILED';

export interface UnreconciledIntercompany {
  unreconciledId: string;
  sourceEntityId: string;
  targetEntityId?: string;
  declaredAmount: number;
  counterpartyAmount: number;
  discrepancy: number;
  category: string;
  reason: string;
}

export interface EliminationWarning {
  warningId: string;
  message: string;
  relatedEntities: string[];
}

export interface ConsolidationAdjustment {
  adjustmentId: string;
  entityId: string;
  accountAffected: string;
  originalValue: number;
  adjustmentValue: number;
  finalValue: number;
  eliminationRefId?: string;
}


export interface ConsolidatedRuntimeInputExt {
  groupId?: string;
  targetEntityId?: string;
  entityPath?: string[];
  consolidationScope?: 'FULL' | 'PROPORTIONAL' | 'EQUITY';
  reportingBoundary?: string;
}

export interface EntityInputPayload {
  entityId: string;
  tenantId?: string; // Obrigatório no futuro, opcional no legacy
  role: 'Holding' | 'Subsidiary' | 'Branch' | 'JV';
  parentId?: string;
  rawData: any; 
}

import { TenantExecutionContext } from '../../../../core/runtime/tenancy/hardening/TenantExecutionContext';

export interface ConsolidatedOrchestratorInput {
  groupId?: string;
  tenantContext?: TenantExecutionContext;
  entities: EntityInputPayload[];
}

export interface ConsolidatedRuntimeOutputExt {
  groupId?: string;
  targetEntityId?: string;
  consolidationScope?: 'FULL' | 'PROPORTIONAL' | 'EQUITY';
  reportingBoundary?: string;
  consolidationPath?: EntityLineageNode[];
  lineage?: Record<string, EntityProvenance[]>;
  eliminatedValues?: EliminatedValueRecord[];
  confidenceByEntity?: Record<string, 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'>;
  violationsByEntity?: Record<string, ConsolidatedViolation[]>;
  entityProvenance?: EntityProvenance;
  consolidatedConfidence?: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
  consolidatedViolations?: ConsolidatedViolation[];
  eliminatedEntries?: EliminatedValueRecord[];
  unreconciledIntercompany?: UnreconciledIntercompany[];
  eliminationConfidence?: EliminationMatchConfidence;
  eliminationWarnings?: EliminationWarning[];
  consolidationAdjustments?: ConsolidationAdjustment[];
  systemicRiskProfile?: SystemicRiskProfile;
}
