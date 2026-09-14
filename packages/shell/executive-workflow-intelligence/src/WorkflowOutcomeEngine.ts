export interface WorkflowOutcomeFeedback {
  readonly outcomeId: string;
  readonly workflowId: string;
  readonly measuredKpiImpactDelta: number;
  readonly isTargetAchieved: boolean;
  readonly learningFeedbackSignal: 'REINFORCE' | 'CALIBRATE';
}

export class WorkflowOutcomeEngine {
  public static measureOutcome(workflowId: string, deltaEbitdaPercent: number): WorkflowOutcomeFeedback {
    const isTargetAchieved = deltaEbitdaPercent >= 0;

    return {
      outcomeId: `out-${workflowId}-${Date.now()}`,
      workflowId,
      measuredKpiImpactDelta: deltaEbitdaPercent,
      isTargetAchieved,
      learningFeedbackSignal: isTargetAchieved ? 'REINFORCE' : 'CALIBRATE'
    };
  }
}
