import { InstitutionalWisdomObject, InstitutionalMemoryType } from '@illumine/executive-contracts';

export class InstitutionalWisdomEngine {
  public static synthesizeWisdom(
    decisionId: string,
    memoryType: InstitutionalMemoryType,
    observedDeltaPercent: number,
    causalStatement: string
  ): InstitutionalWisdomObject {
    const confidenceAdjustment = observedDeltaPercent >= 0 ? 0.05 : -0.05;

    return {
      wisdomId: `wisdom-${decisionId}-${Date.now()}`,
      memoryType,
      decisionId,
      observedOutcomeDeltaPercent: observedDeltaPercent,
      confidenceAdjustment,
      causalLearningStatement: causalStatement,
      governanceImpact: observedDeltaPercent < -5 ? 'HIGH' : 'MEDIUM',
      applicabilityScope: ['FINANCIAL', 'COMMERCIAL'],
      createdAt: new Date().toISOString(),
      wisdomHash: `wisdom-hash-${decisionId}-${Date.now()}-sha256`
    };
  }
}
