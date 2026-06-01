export type RiskCategory = 
  | 'Estratégico'
  | 'Financeiro'
  | 'Operacional'
  | 'Jurídico'
  | 'Reputacional'
  | 'ESG'
  | 'Cibernético'
  | 'Compliance'
  | 'Liquidez'
  | 'Continuidade Operacional'
  | string; // Extensible for other sectors like Hospitalar, Industrial, etc.

export type RiskSeverity = 1 | 2 | 3 | 4 | 5; // 1: Very Low, 5: Very High

export type RiskStatus = 'Identificado' | 'Em Avaliação' | 'Mitigado' | 'Aceito' | 'Materializado' | 'Encerrado';

export interface RiskOwner {
  userId: string;
  role: string;
  department: string;
  assignedAt: string;
}

export interface RiskAuditTrail {
  auditId: string;
  action: string; // e.g., 'CREATED', 'MITIGATION_UPDATED', 'SEVERITY_CHANGED'
  timestamp: string;
  userId: string;
  changes: Record<string, unknown>;
  governanceContextSnapshot: Record<string, unknown>;
}

export interface RiskMitigationPlan {
  planId: string;
  description: string;
  ownerId: string;
  dueDate: string;
  status: 'Planejado' | 'Em Execução' | 'Atrasado' | 'Concluído';
  controls: string[];
  dependencies: string[]; // IDs of other risks or projects
}

export interface EnterpriseRisk {
  riskId: string;
  tenantId: string;
  entityId?: string; // Optional: specific to a company within a holding
  groupId?: string;  // Optional: specific to a group of companies
  title: string;
  description: string;
  category: RiskCategory;
  
  // Matrix scoring
  impact: RiskSeverity;
  probability: RiskSeverity;
  inherentRisk: number; // usually impact * probability
  residualRisk: number; // after mitigation

  mitigationPlan?: RiskMitigationPlan;
  owner?: RiskOwner;
  status: RiskStatus;

  // Systemic / Fiduciary 
  confidenceScore: number;
  lineageHash: string; // Traceability hash for AI/Engine decisions
  
  createdAt: string;
  updatedAt: string;
  auditTrail: RiskAuditTrail[];
}

export interface RiskMatrixInput {
  impact: RiskSeverity;
  probability: RiskSeverity;
  controlsEffectiveness: number; // 0 to 1
}

export interface RiskMatrixOutput {
  inherentRiskScore: number;
  residualRiskScore: number;
  criticalityLevel: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  recommendedAction: string;
}

export interface RiskKRI {
  kriId: string;
  riskId: string;
  metricName: string;
  currentValue: number;
  thresholdWarning: number;
  thresholdCritical: number;
  unit: string;
  lastMeasuredAt: string;
}

export interface RiskHeatmap {
  matrix: Record<string, EnterpriseRisk[]>; // key like 'impact-probability' e.g. '5-5'
  topCriticalRisks: EnterpriseRisk[];
  risksByCategory: Record<RiskCategory, number>;
  risksByEntity: Record<string, number>;
  risksWithoutOwner: EnterpriseRisk[];
  delayedMitigations: RiskMitigationPlan[];
  exposureTrend: 'Aumentando' | 'Estável' | 'Diminuindo';
  consolidatedResidualRisk: number;
}
