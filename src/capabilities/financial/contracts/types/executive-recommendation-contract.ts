/**
 * ExecutiveRecommendationContract — Contrato Canônico de Recomendação Executiva
 * Wave 18.2 (EERAM v1.0 / ADR-076)
 *
 * Nenhuma recomendação pode existir como texto narrativo cru sem campos estruturados.
 */

export interface ExpectedKPIShift {
  pessimistic: string;
  expected: string;
  optimistic: string;
}

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ExecutiveRecommendationContract {
  id: string;
  decision: string;
  rationale: string;
  evidence: string[];
  expectedKPIShift: ExpectedKPIShift;
  owner: string;
  timeframe: string;
  priority: RecommendationPriority;
  successCriteria: string;
  monitoringMetrics: string[];
  createdAt?: string;
  status?: 'proposed' | 'approved' | 'in_execution' | 'completed';
}

export interface ExecutiveEvidenceBinding {
  id: string;
  conclusion: string;
  source: string;
  period: string;
  comparison: string;
  confidenceScore: number; // 0-100
  metrics: Array<{
    name: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    variance?: string;
  }>;
}

export type DecisionMonitoringStatus = 'pending' | 'in_progress' | 'verified' | 'recalibrated';

export interface ExecutiveDecisionMonitoringState {
  id: string;
  recommendationId: string;
  decisionTaken: string;
  expectedShift: ExpectedKPIShift;
  monitoringMetrics: string[];
  actualShift?: string;
  learningNote?: string;
  monitoringStatus: DecisionMonitoringStatus;
  lastEvaluatedAt: string;
}
