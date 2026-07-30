export type WorkflowStage = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED' | 'VALIDATED' | 'ARCHIVED';

export interface AdvisoryWorkflowContract {
  readonly workflowId: string;
  readonly recommendationId: string;
  readonly currentStage: WorkflowStage;
  readonly assignedAdvisorId: string;
  readonly lastUpdated: string;
  readonly reviewerComment?: string;
}
