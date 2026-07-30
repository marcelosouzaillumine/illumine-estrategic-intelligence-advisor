export interface ActionMilestone {
  readonly milestoneId: string;
  readonly title: string;
  readonly dueDate: string;
  readonly isCompleted: boolean;
}

export interface ExecutiveActionPlanContract {
  readonly actionId: string;
  readonly recommendationId: string;
  readonly owner: string;
  readonly responsibleArea: string;
  readonly deadline: string;
  readonly milestones: readonly ActionMilestone[];
  readonly expectedOutcome: string;
  readonly executionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
}
