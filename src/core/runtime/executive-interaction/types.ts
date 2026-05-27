export type ExecutiveSeverityLevel = 'INFO' | 'ATTENTION' | 'WARNING' | 'CRITICAL' | 'LOCKED';

export interface ExecutiveConfidenceDisclosure {
  confidenceScore: number; // 0 to 100
  confidenceLabel: string; // e.g. "Alta", "Média", "Baixa"
  evidenceCoverage: number; // 0 to 1.0
  lineageIntegrity: boolean;
  missingDependencies: string[];
  runtimeMode: 'production' | 'staging' | 'degraded';
}

export type ExecutiveInteractionState = 'LOADING' | 'READY' | 'DEGRADED' | 'INSUFFICIENT_DATA' | 'BLOCKED' | 'FAIL_CLOSED';

export type ExecutiveEscalationLevel = 'NORMAL' | 'SUPERVISION_REQUIRED' | 'EXECUTIVE_ATTENTION' | 'BOARD_CRITICAL';

export type ExecutiveModalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'FIDUCIARY';

export type ExecutiveEvidenceVisibility = 'SUMMARY' | 'EXPANDED' | 'FULL_TRACE';

export interface GovernanceDataDependency {
  id: string;
  name: string;
  type: 'financial' | 'compliance' | 'operational' | 'scenario';
  status: 'available' | 'missing' | 'stale';
  updatedAt?: string;
  lineageHash?: string;
}

export interface FiduciaryAuditLog {
  timestamp: string;
  userId: string;
  action: string;
  implications: string;
  lineageHash: string;
}

export interface CausalEdge {
  sourceId: string;
  sourceLabel: string;
  targetId: string;
  targetLabel: string;
  description: string;
  impactScore: number;
}
