export interface ProposalImplementationPlan {
  milestones: Array<{
    title: string;
    description: string;
    estimatedDays: number;
  }>;
  startDateEstimate?: string;
}
