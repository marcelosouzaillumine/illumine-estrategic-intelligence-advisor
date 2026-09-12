export type LifecycleStage = 'DAY_0_ACTIVATION' | 'DAY_3_TWIN_ACTIVE' | 'DAY_15_PLAN' | 'DAY_30_FIRST_BOARD' | 'DAY_90_VALUE_REVIEW';

export interface PartnerLifecycleStatus {
  partnerId: string;
  currentStage: LifecycleStage;
  nextMilestoneDate: string;
  valueReviewCompleted: boolean;
}

export class FoundingPartnerLifecycleEngine {
  public static advanceLifecycle(partnerId: string, currentStage: LifecycleStage): PartnerLifecycleStatus {
    const stages: LifecycleStage[] = [
      'DAY_0_ACTIVATION',
      'DAY_3_TWIN_ACTIVE',
      'DAY_15_PLAN',
      'DAY_30_FIRST_BOARD',
      'DAY_90_VALUE_REVIEW'
    ];

    const idx = stages.indexOf(currentStage);
    const nextStage = idx < stages.length - 1 ? stages[idx + 1] : stages[idx];

    return {
      partnerId,
      currentStage: nextStage,
      nextMilestoneDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      valueReviewCompleted: nextStage === 'DAY_90_VALUE_REVIEW'
    };
  }
}
