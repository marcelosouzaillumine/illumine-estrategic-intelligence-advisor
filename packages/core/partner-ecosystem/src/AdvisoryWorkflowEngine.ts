import { AdvisoryWorkflowContract, WorkflowStage } from '@illumine/executive-contracts';

export class AdvisoryWorkflowEngine {
  public static transitionStage(recommendationId: string, advisorId: string, nextStage: WorkflowStage, comment?: string): AdvisoryWorkflowContract {
    return {
      workflowId: `wf-${recommendationId}`,
      recommendationId,
      currentStage: nextStage,
      assignedAdvisorId: advisorId,
      lastUpdated: new Date().toISOString(),
      reviewerComment: comment
    };
  }
}
