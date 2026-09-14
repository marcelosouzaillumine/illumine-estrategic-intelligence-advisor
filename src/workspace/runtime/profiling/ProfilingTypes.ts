export type RuntimeStage = 
  | 'DATA_FETCH'
  | 'VALIDATION'
  | 'CONSOLIDATION'
  | 'ADVISORY'
  | 'SCENARIO_PROPAGATION'
  | 'REPORT_GENERATION'
  | 'REPLAY_LOADING'
  | 'CACHE_SERIALIZATION';

export interface StageLatency {
  stage: RuntimeStage;
  durationMs: number;
  timestamp: string;
}

export interface RuntimeLatencySnapshot {
  executionId: string;
  tenantId: string;
  workspaceId: string;
  totalDurationMs: number;
  stages: StageLatency[];
  bottlenecks: string[];
}

export interface MemorySpikeRecord {
  timestamp: string;
  action: string;
  estimatedBytes: number;
}

export interface ScenarioExecutionBudget {
  maxScenarios: number;
  maxReplays: number;
  maxSnapshotSizeKb: number;
  maxExecutionTimeMs: number;
  maxPropagationDepth: number;
  maxEntitiesPerSimulation: number;
}

export interface QueryPerformanceMetric {
  queryId: string;
  collection: string;
  durationMs: number;
  returnedDocs: number;
  tenantId: string;
  workspaceId: string;
  timestamp: string;
  isCached: boolean;
}
