// src/core/runtime/strategic-intelligence/strategic-intelligence-types.ts

export type StrategicPosture = 
  | 'EXPANSION_POSTURE'
  | 'PRESERVATION_POSTURE'
  | 'STABILIZATION_POSTURE'
  | 'RESTRICTION_POSTURE'
  | 'CONTINUITY_POSTURE'
  | 'UNVERIFIABLE_POSTURE';

export type InstitutionalVectorDirection = 
  | 'RECURRENT_GROWTH'
  | 'STRUCTURAL_COMPRESSION'
  | 'LONGITUDINAL_DETERIORATION'
  | 'CONSISTENT_PRESERVATION'
  | 'ACCUMULATIVE_PRESSURE'
  | 'STRAINED_EXPANSION'
  | 'NEUTRAL';

export type StrategicContradictionType = 
  | 'DIRECTIONAL_DIVERGENCE'
  | 'CONTINUITY_STRATEGY_TENSION'
  | 'STRUCTURAL_DIRECTIONAL_INCONSISTENCY'
  | 'OBSERVED_STRATEGIC_CONTRADICTION';

export type LongitudinalTrajectoryStatus = 
  | 'TRAJECTORY_STABLE'
  | 'TRAJECTORY_SENSITIVE'
  | 'TRAJECTORY_PRESSURED'
  | 'TRAJECTORY_UNSTABLE';

export type CapitalStrategyAlignmentStatus =
  | 'ALIGNED'
  | 'MISALIGNED_EXPANSION'
  | 'MISALIGNED_DISTRIBUTION'
  | 'MISALIGNED_CAPEX'
  | 'STRUCTURAL_DISCONNECT';

export interface InstitutionalVector {
  direction: InstitutionalVectorDirection;
  vectorPersistence: number; // 0 to 1
  vectorStability: number; // 0 to 1
  vectorConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIABLE';
  description: string;
}

export interface StrategicContradiction {
  id: string;
  type: StrategicContradictionType;
  description: string;
  severity: 'WARNING' | 'CRITICAL';
  involvedEngines: string[];
}

export interface ExpansionSustainability {
  isSustainable: boolean;
  structuralCapacity: 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT';
  financialSustainability: 'SUSTAINABLE' | 'PRESSURED' | 'UNSUSTAINABLE';
  institutionalAbsorption: 'STABLE' | 'STRAINED' | 'OVERLOADED';
  rationale: string;
}

export interface CapitalStrategyAlignment {
  status: CapitalStrategyAlignmentStatus;
  isCoherent: boolean;
  tensions: string[];
  rationale: string;
}

export interface StrategicInstitutionalThesis {
  strategicPosture: StrategicPosture;
  primaryVector: InstitutionalVectorDirection;
  trajectoryStatus: LongitudinalTrajectoryStatus;
  expansionIsSustainable: boolean;
  capitalIsAligned: boolean;
  unifiedThesisStatement: string;
}

export interface StrategicMemoryRecord {
  timestamp: string;
  lineageHash: string;
  tenantId: string;
  cycleReference: string;
  postureSignals: StrategicPosture[];
  vectorSignals: InstitutionalVectorDirection[];
  contradictionSignals: StrategicContradictionType[];
}

export interface StrategicExplainability {
  strategicLineage: string;
  vectorRationale: string;
  trajectoryRationale: string;
  contradictionDecomposition: string[];
  sustainabilityExplanation: string;
}

export interface InstitutionalStrategicIntelligenceOutput {
  posture: StrategicPosture;
  vectors: InstitutionalVector[];
  contradictions: StrategicContradiction[];
  expansionSustainability: ExpansionSustainability;
  trajectory: LongitudinalTrajectoryStatus;
  capitalAlignment: CapitalStrategyAlignment;
  thesis: StrategicInstitutionalThesis;
  explainability: StrategicExplainability;
  memorySync: {
    requiresSync: boolean;
    record?: StrategicMemoryRecord;
  };
}

export interface StrategicEvaluationContext {
  metadata: {
    lineageHash: string;
    tenantId: string;
    cycleReference: string;
    historicalCyclesCount: number;
  };
  capitalStructure: {
    fundingDependenceLevel: string;
    rolloverRisk: string;
  };
  metrics: {
    financialMetrics: {
      ocf: number;
      revenue: number;
    };
    scaleEfficiency: {
      recGrowth: number | null;
      ebitdaGrowth: number | null;
    };
  };
  survivalReport?: {
    activeSurvivalMode?: string;
  };
  treasuryReport?: {
    directives?: string[];
    stressStatus?: string;
  };
  operatingPressureReport?: {
    structuralPressureSeverity?: string;
  };
  continuityReport?: {
    status?: string;
  };
  executiveCommand?: {
    activeDirectives?: { category: string }[];
  };
  operationalGovernance?: {
    executionIntegrity?: { status: string };
    frictions?: { nature: string }[];
  };
}
