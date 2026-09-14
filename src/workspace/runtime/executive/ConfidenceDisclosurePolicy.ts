import { ConfidenceLevel, ExecutiveNarrative } from './types';

export class ConfidenceDisclosurePolicy {
  /**
   * Applies the confidence rendering rules to the narrative.
   */
  static evaluateDisclosureRequirements(narrative: ExecutiveNarrative): {
    requiresWarning: boolean;
    requiresDisclosure: boolean;
    isBlocked: boolean;
    reason?: string;
  } {
    switch (narrative.confidence) {
      case 'HIGH':
        return { requiresWarning: false, requiresDisclosure: false, isBlocked: false };
      case 'MEDIUM':
        return { requiresWarning: false, requiresDisclosure: true, isBlocked: false };
      case 'LOW':
        return { requiresWarning: true, requiresDisclosure: true, isBlocked: false };
      case 'UNVERIFIED':
        return { requiresWarning: true, requiresDisclosure: true, isBlocked: true, reason: 'UNVERIFIED_CONFIDENCE_BLOCKED' };
      default:
        return { requiresWarning: true, requiresDisclosure: true, isBlocked: true, reason: 'UNKNOWN_CONFIDENCE_STATE' };
    }
  }

  static assertSafeRendering(narrative: ExecutiveNarrative) {
    const rules = this.evaluateDisclosureRequirements(narrative);
    if (rules.isBlocked) {
      throw new Error(`RENDER_BLOCKED: Narrative confidence is ${narrative.confidence} (${rules.reason})`);
    }
  }
}
