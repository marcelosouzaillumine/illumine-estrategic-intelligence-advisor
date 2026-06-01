// src/core/runtime/operational-governance/operational-governance-types.ts

import { RuntimeOutputBase } from '../shared/runtime-contracts';
import { GovernanceLineageHash } from '../shared/lineage-types';

export type ExecutionCapabilityConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIABLE';

export type ExecutionIntegrityStatus = 
  | 'EXECUTION_STABLE' 
  | 'EXECUTION_PRESSURED' 
  | 'EXECUTION_UNDER_COORDINATION_STRAIN' 
  | 'EXECUTION_UNDER_STRAIN';

export interface ExecutionIntegrityState {
  status: ExecutionIntegrityStatus;
  capabilityConfidence: ExecutionCapabilityConfidence;
  strainFactors: string[];
  inferenceBasis?: string;
  confidenceScore?: number;
}

export type FrictionNature = 'TRANSITIONAL' | 'STRUCTURAL' | 'EXPANSION_RELATED' | 'CONTINUITY_RELATED';

export interface OperationalFrictionEvent {
  id: string;
  description: string; 
  nature: FrictionNature;
  causalMetrics: string[];
}

export type OperationalContinuityStatus = 
  | 'CONTINUITY_STABLE' 
  | 'CONTINUITY_SENSITIVE' 
  | 'CONTINUITY_PRESSURED' 
  | 'CONTINUITY_RESTRICTED';

export interface OperationalContinuityState {
  status: OperationalContinuityStatus;
  resilienceScore: number; 
  stabilityFactors: string[];
}

export interface InstitutionalDependencyRisk {
  id: string;
  category: 'FUNDING' | 'LIQUIDITY_CONCENTRATION' | 'SUPPLY_CHAIN_PROPERTIES' | 'OPERATIONAL_FLOW';
  description: string;
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface StrategicExecutionAlignment {
  isAligned: boolean;
  alignmentNarrative: string;
  tensions: string[];
}

export interface OperationalGovernanceThesis {
  thesisStatement: string;
  primaryStrain: string | null;
  institutionalPosture: 'ALIGNED_EXECUTION' | 'STRAINED_EXECUTION' | 'RESTRICTED_EXECUTION';
  lineageHash: string;
}

export interface OperationalGovernanceMemoryDelta {
  timestamp: string;
  tenantId: string;
  lineageHash: string;
  operationalRecurrenceSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  frictionEventsRecorded: number;
}

export interface InstitutionalOperationalGovernanceOutput extends RuntimeOutputBase {
  executionIntegrity: ExecutionIntegrityState;
  frictions: OperationalFrictionEvent[];
  continuity: OperationalContinuityState;
  dependencies: InstitutionalDependencyRisk[];
  strategicAlignment: StrategicExecutionAlignment;
  thesis: OperationalGovernanceThesis;
  _persistenceDelta: OperationalGovernanceMemoryDelta | null;
}
