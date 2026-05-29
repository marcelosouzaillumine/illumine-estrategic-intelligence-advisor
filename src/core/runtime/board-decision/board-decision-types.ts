// src/core/runtime/board-decision/board-decision-types.ts
import { InstitutionalScenarioResult } from '../scenario-intelligence/scenario-types';

export type ResolutionStatus = 'DRAFT' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
export type DecisionImpactScale = 'LOCAL' | 'STRUCTURAL' | 'SYSTEMIC';

export interface BoardResolution {
  id: string; // e.g., RES-2026-001
  tenantId: string;
  clientId: string;
  scenarioId: string;
  scenarioLineageHash: string;
  resolutionHash: string; // Hash from (scenarioLineageHash + rationale + approver)
  
  status: ResolutionStatus;
  rationale: string;
  structuralImpact: DecisionImpactScale;
  
  approverId: string;
  approverRole: string;
  timestamp: string;
  
  // Fiduciary tracking of the exact state being approved
  baselineSnapshotHash?: string; 
}

export interface ScenarioTradeoffEdge {
  scenarioAId: string;
  scenarioBId: string;
  dimension: string; // e.g. DFC, LIQUIDITY
  winnerId: string | null; // Null if neutral
  tradeoffRationale: string; // Strict structural explanation
}

export interface ScenarioTradeoffProfile {
  id: string;
  comparisonTimestamp: string;
  scenarios: InstitutionalScenarioResult[];
  edges: ScenarioTradeoffEdge[];
  criticalTensions: string[];
}
