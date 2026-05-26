export interface ScaleLoadProfile {
  profileId: string;
  tenantId: string;
  activeSessions: number;
  concurrentWorkflows: number;
  iosDomainsSynced: number;
  memoryPressureLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ConcurrencyAnalysis {
  analysisId: string;
  simultaneousTenants: number;
  maxConcurrentWorkflows: number;
  isolationVerified: boolean;
  bottleneckDetected: boolean;
  bottleneckDescription?: string;
}

export interface SessionStabilityReport {
  reportId: string;
  tenantId: string;
  sessionDurationMinutes: number;
  stateConsistencyOk: boolean;
  memoryLeakDetected: boolean;
  iosStabilityOk: boolean;
}

export interface ScaleReadinessReport {
  reportId: string;
  tenantId: string;
  concurrencyScore: number;
  sessionStabilityScore: number;
  recoveryScore: number;
  crossTenantIsolationValid: boolean;
  status: 'READY' | 'NOT_READY' | 'WARNING';
}
