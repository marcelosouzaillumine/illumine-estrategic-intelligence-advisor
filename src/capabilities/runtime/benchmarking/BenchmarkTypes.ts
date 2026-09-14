export type BenchmarkConfidenceSignal = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';

export interface BenchmarkLineageReference {
  benchmarkExecutionId: string;
  cohortSignature: string;
  aggregationVersion: string;
  lineageHash: string;
  timestamp: string;
  privacyPolicyVersion: string;
}

export interface AnonymizedInstitutionalProfile {
  // ATENÇÃO: NENHUM tenantId, workspaceId ou groupId deve constar aqui.
  sector: string;
  revenueBand: string;
  maturityLevel: string;
  systemicRiskScore: number;
  confidence: BenchmarkConfidenceSignal;
}

export interface BenchmarkCohort {
  cohortSignature: string;
  size: number;
  sector: string;
  revenueBand: string;
  profiles: AnonymizedInstitutionalProfile[]; // No DB real, estariam hasheadas e irreconhecíveis
}

export interface BenchmarkMetric {
  metricName: string;
  p25: number;
  p50: number; // Median
  p75: number;
  average: number;
}

export interface BenchmarkComparison {
  cohortSignature: string;
  metrics: BenchmarkMetric[];
  confidenceDistribution: Record<BenchmarkConfidenceSignal, number>;
}

export interface BenchmarkRiskPattern {
  patternId: string;
  description: string;
  occurrenceRate: number;
  severity: 'WARNING' | 'CRITICAL' | 'NORMAL';
}

export interface BenchmarkExecutionRecord {
  executionId: string;
  cohortSignature: string;
  timestamp: string;
  status: 'COMPLETED' | 'BLOCKED_BY_PRIVACY';
  lineage: BenchmarkLineageReference;
  anonymizedComparison?: BenchmarkComparison;
}

export interface BenchmarkPrivacyViolation {
  violationId: string;
  rule: string;
  message: string;
  blockedAt: string;
}
