export type ExecutiveDecisionStatus =
  | 'CRITICAL'
  | 'ATTENTION'
  | 'MONITORING'
  | 'EXECUTION'
  | 'OPTIMIZATION'
  | 'COMPLETED'
  | 'INSUFFICIENT_DATA';

export type ExecutiveConfidenceLevel =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INSUFFICIENT_DATA';

export interface ExecutiveExecutionStep {
  domain: string; // área responsável
  horizon: string; // horizonte temporal
  description: string; // ação recomendada
  expectedResult?: string; // resultado esperado
  isPrimaryStep?: boolean;
}

export interface ExecutiveDecisionWorkspaceModel {
  sectionTitle: string;
  sectionSubtitle: string;
  status: ExecutiveDecisionStatus;
  statusLabel: string;
  confidence: ExecutiveConfidenceLevel;
  confidenceLabel: string;
  objective: string;
  recommendedDecision: string;
  rationale: string;
  primaryDriver: string;
  steps: ExecutiveExecutionStep[];
}
