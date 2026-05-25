export type WorkflowStatus = 'DRAFT' | 'WAITING_APPROVAL' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'ESCALATED' | 'COMPLETED' | 'CANCELLED';
export type ActionItemStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'ESCALATED' | 'COMPLETED' | 'CANCELLED';
export type WorkflowType = 'ALERT_RESPONSE' | 'BOARD_PACK_APPROVAL' | 'SCENARIO_APPROVAL' | 'GOVERNANCE_CORRECTION';

export interface DecisionLineageReference {
  tenantId: string;
  workspaceId: string;
  groupId?: string;
  executionId?: string;
  reportVersion?: string;
  scenarioId?: string;
  alertId?: string;
  decisionHash: string;
  timestamp: string;
}

export interface WorkflowActor {
  userId: string;
  role: string;
  name: string;
}

export interface WorkflowApproval {
  approvalId: string;
  stepId: string;
  actor: WorkflowActor;
  status: 'APPROVED' | 'REJECTED';
  justification: string;
  timestamp: string;
}

export interface WorkflowStep {
  stepId: string;
  order: number;
  title: string;
  requiredRole: string;
  status: WorkflowStatus;
  approvals: WorkflowApproval[];
}

export interface DecisionWorkflow {
  workflowId: string;
  type: WorkflowType;
  title: string;
  description: string;
  status: WorkflowStatus;
  lineage: DecisionLineageReference;
  steps: WorkflowStep[];
  createdBy: WorkflowActor;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  actionId: string;
  workflowId: string;
  title: string;
  responsibleUserId: string;
  status: ActionItemStatus;
  relatedAlertId?: string;
  relatedScenarioId?: string;
  relatedReportId?: string;
  escalationLevel: string;
  dueDate?: string;
  completionTimestamp?: string;
}

export interface InstitutionalDeliberation {
  deliberationId: string;
  workflowId: string;
  quorumMet: boolean;
  finalDecision: 'APPROVED' | 'REJECTED';
  recordedAt: string;
}

export interface ApprovalPolicy {
  policyId: string;
  workflowType: WorkflowType;
  requiredRoles: string[];
  quorum: number;
}

export interface WorkflowAuditRecord {
  auditId: string;
  workflowId: string;
  tenantId: string;
  event: 'WORKFLOW_CREATED' | 'STEP_APPROVED' | 'STEP_REJECTED' | 'ACTION_ESCALATED' | 'WORKFLOW_COMPLETED' | 'WORKFLOW_CANCELLED' | 'WORKFLOW_REOPENED';
  actor: WorkflowActor;
  timestamp: string;
  details?: string;
}
