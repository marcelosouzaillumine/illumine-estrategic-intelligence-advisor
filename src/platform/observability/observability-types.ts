import { ExplainabilityOutput } from '../../core/runtime/shared/runtime-contracts';

export type ExecutionStatus = 'STARTED' | 'COMPLETED' | 'FAILED' | 'BLOCKED';

export interface RuntimePerformanceMetrics {
  totalExecutionTimeMs: number;
  engineExecutionTimes: Record<string, number>;
  memoryUsageBytes?: number;
  isDegradedMode: boolean;
  warnings: string[];
}

export interface RuntimeLineageNode {
  nodeId: string;
  engineName: string;
  inputs: string[];
  output: string;
  timestamp: string;
  durationMs: number;
  children?: RuntimeLineageNode[];
}

export interface ConfidenceTelemetry {
  baseConfidenceScore: number;
  finalConfidenceScore: number;
  confidenceCollapse: boolean;
  collapseReasons: string[];
  isDegraded: boolean;
}

export interface AdvisoryTraceNode {
  advisoryId: string;
  decision: string;
  criticalInputs: string[];
  causalPath: string[];
  timestamp: string;
}


export interface RuntimeExecutionTrace {
  executionId: string;
  timestamp: string;
  runtimeMode: 'SINGLE_ENTITY' | 'MULTI_ENTITY' | 'SCENARIO_SIMULATION' | 'PASS_THROUGH';
  performance: RuntimePerformanceMetrics;
  lineage: RuntimeLineageNode[];
  confidenceTelemetry: ConfidenceTelemetry;
  explainability: ExplainabilityOutput;
  advisoryLineage: AdvisoryTraceNode[];
  status: ExecutionStatus;
  executionLoopsDetected: boolean;
  excessiveExecutionTime: boolean;
  lineageHash?: string;
  historicalCyclesAvailable?: number;
  auditTrail?: string[];
}

// Retro-compatibility (for files not yet migrated)
export interface GovernanceViolationRecord {
  violationId: string;
  executionId: string;
  groupId: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  source: string;
  timestamp: string;
  message: string;
  affectedEntities: string[];
  runtimeStage: string;
  resolved: boolean;
}

export interface ConfidenceTimelineEntry {
  id: string;
  executionId: string;
  groupId: string;
  timestamp: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  fiscalYear: string;
}

export interface ExecutionTrace {
  executionId: string;
  lineageHash?: string;
  runtimeVersion?: string;
  inputFingerprint?: string;
  outputFingerprint?: string;
  latencyMs?: number;
  failClosedTriggered?: boolean;
  restrictionFlags?: string[];
  payloadIntegrityStatus?: string;
  semanticCorruptionFlags?: string[];
  replayToken?: string;
  
  stages: {
    stageName: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
    status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
    metadata?: Record<string, unknown>;
  }[];
  totalDurationMs: number;
}

export interface RuntimeReplayEnvelope {
  inputFingerprint: string;
  runtimeVersion: string;
  lineageHash: string;
  traceId: string;
  timestamp: string;
  deterministicSeed?: string;
  executionPath: string[];
  triggeredEngines: string[];
  failClosedEvents: string[];
}

export interface RuntimeExecutionRecord {
  executionId: string;
  runtimeType: 'CONSOLIDATED_ADVISORY';
  timestamp: string;
  groupId: string;
  entityIds: string[];
  runtimeVersion: string;
  confidenceInitial: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceFinal: 'HIGH' | 'MEDIUM' | 'LOW';
  violations: GovernanceViolationRecord[];
  warnings: string[];
  systemicRisks: any[];
  runtimeDurationMs: number;
  executionStatus: ExecutionStatus;
  advisoryHash: string;
  lineageSnapshot: Record<string, unknown>;
}

export interface RuntimeHealthSnapshot {
  id: string;
  timestamp: string;
  avgDurationMs: number;
  totalExecutions: number;
  failureRate: number;
  criticalViolationsDetected: number;
  anomalies: string[];
}

export interface ReplayExecutionResult {
  executionRecord: RuntimeExecutionRecord;
  trace: ExecutionTrace;
  snapshotReport: any; // Using any instead of ConsolidatedExecutiveAdvisoryReport for now to fix circular/missing imports
}
