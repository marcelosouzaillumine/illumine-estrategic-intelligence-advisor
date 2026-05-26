import { ExecutiveNarrative } from './types';
import { ConfidenceDisclosurePolicy } from './ConfidenceDisclosurePolicy';
import { ExecutiveNarrativePolicy } from './ExecutiveNarrativePolicy';

export class InstitutionalPresentationGuard {
  /**
   * Fail-Closed Gatekeeper for Rendering.
   */
  static validateForRendering(narrative: ExecutiveNarrative): void {
    // 1. Verify integrity (Lineage, Evidence, Narrative Immutable Check)
    if (!ExecutiveNarrativePolicy.verifyIntegrity(narrative)) {
      throw new Error('PRESENTATION_BLOCKED: Narrative integrity validation failed. Mutation detected.');
    }

    // 2. Confidence Block Checks
    ConfidenceDisclosurePolicy.assertSafeRendering(narrative);

    // 3. Ensure Runtime and Evidence
    if (!narrative.sourceRuntime) {
      throw new Error('PRESENTATION_BLOCKED: Storytelling without runtime is prohibited.');
    }

    if (!narrative.evidenceChain || narrative.evidenceChain.length === 0) {
      throw new Error('PRESENTATION_BLOCKED: Advisory without evidence chain is prohibited.');
    }
  }
}
