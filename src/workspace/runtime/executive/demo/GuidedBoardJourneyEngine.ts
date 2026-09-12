export type GuidedJourneyStep =
  | 'SUMMARY'
  | 'STRUCTURAL_TENSIONS'
  | 'ROOT_CAUSE'
  | 'PROPAGATION'
  | 'INSTITUTIONAL_RISKS'
  | 'RECOMMENDATIONS'
  | 'EVIDENCE_CHAIN'
  | 'TIMELINE'
  | 'FINAL_DISCLOSURE';

const STEP_ORDER: GuidedJourneyStep[] = [
  'SUMMARY',
  'STRUCTURAL_TENSIONS',
  'ROOT_CAUSE',
  'PROPAGATION',
  'INSTITUTIONAL_RISKS',
  'RECOMMENDATIONS',
  'EVIDENCE_CHAIN',
  'TIMELINE',
  'FINAL_DISCLOSURE'
];

/**
 * @deprecated This engine is part of the legacy Demo suite.
 * Do not use in production runtime. Scheduled for removal in HCA-003.
 */
export class GuidedBoardJourneyEngine {
  public static assertValidTransition(
    current: GuidedJourneyStep,
    target: GuidedJourneyStep,
    hasEvidence: boolean,
    hasLineage: boolean,
    hasRuntimeMemory: boolean
  ): void {
    const currentIndex = STEP_ORDER.indexOf(current);
    const targetIndex = STEP_ORDER.indexOf(target);

    if (currentIndex === -1 || targetIndex === -1) {
      throw new Error(`GUIDED_JOURNEY_VIOLATION: Invalid step names.`);
    }

    // 2. Specific step validation rules:
    // "impede saltar Root Cause"
    if (current === 'STRUCTURAL_TENSIONS' && targetIndex > STEP_ORDER.indexOf('ROOT_CAUSE')) {
      throw new Error(`GUIDED_JOURNEY_VIOLATION: Cannot skip Root Cause analysis.`);
    }

    // 1. Navigation order rules: No jumping steps arbitrarily (can only navigate to adjacent or backward)
    const diff = targetIndex - currentIndex;
    if (diff > 1) {
      throw new Error(`GUIDED_JOURNEY_VIOLATION: Direct jumps are forbidden. You must follow the causality sequence.`);
    }

    // "abrir Recommendation sem Evidence"
    if (target === 'RECOMMENDATIONS' && !hasEvidence) {
      throw new Error(`GUIDED_JOURNEY_VIOLATION: Cannot view recommendations without a valid Evidence Chain.`);
    }

    // "abrir Timeline sem Runtime Memory"
    if (target === 'TIMELINE' && !hasRuntimeMemory) {
      throw new Error(`GUIDED_JOURNEY_VIOLATION: Cannot render timeline without Runtime Memory backing.`);
    }

    // "abrir Propagation sem Lineage"
    if (target === 'PROPAGATION' && !hasLineage) {
      throw new Error(`GUIDED_JOURNEY_VIOLATION: Cannot inspect propagation without active Lineage validation.`);
    }
  }
}
