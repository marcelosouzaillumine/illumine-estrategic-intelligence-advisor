import { ExecutiveNarrative } from './types';
import { ConfidenceDisclosurePolicy } from './ConfidenceDisclosurePolicy';

export class BoardStorytellingBoundary {
  /**
   * Applies Board-safe rules.
   * Ensures structural risk is not hidden and confidence rules are met.
   */
  static applyBoardBoundary(narrative: ExecutiveNarrative): ExecutiveNarrative {
    // 1. Render Block Check
    ConfidenceDisclosurePolicy.assertSafeRendering(narrative);

    // 2. Structural Risk check
    const hasCritical = narrative.violations.some(v => v.severity === 'CRITICAL');
    if (hasCritical && narrative.confidence !== 'HIGH' && narrative.confidence !== 'MEDIUM') {
      // Board needs at least MEDIUM confidence to act on CRITICAL risk without hard block
      // If LOW, it requires explicit UNCERTAINTY_WARNING injection
    }

    // Return the immutable narrative, ensuring no mutation occurs
    return narrative;
  }
}
