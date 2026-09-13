export interface SovereignCacheKey {
  tenantId: string;
  groupId: string;
  targetEntityId: string;
  entityPathHash: string;
  consolidationScopeHash: string;
  reportingBoundary: string;
  runtimeMode: string;
  fiscalPeriod: string;
  sourceDataHash: string;
  lineageHash: string;
  confidenceFingerprint: string;
  schemaVersion: string;
}

export type LazyExecutionStatus = 'EXECUTED' | 'DEFERRED' | 'PENDING' | 'BLOCKED';

export interface DeferredExecutionResult<T> {
  status: LazyExecutionStatus;
  reason?: string;
  requiredData?: string[];
  expectedTrigger?: string;
  confidenceImpact?: number;
  violations?: string[];
  data?: T;
}

export interface RuntimeTelemetryData {
  tenantId: string;
  executionId: string;
  correlationId: string;
  runtimeScope: string;
  topologyScope: string;
  metrics: {
    executionTimeMs: number;
    orchestrationDepth: number;
    memoryUsageBytes: number;
    cacheHitRatio: number;
    propagationCostMs: number;
    stressExecutionCostMs: number;
    runtimeSaturationPercent: number;
    tenantExecutionLoadPercent: number;
  };
  timestamp: string;
}
