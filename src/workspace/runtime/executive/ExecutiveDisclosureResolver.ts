import { ExecutiveNarrative } from './types';
import { ConfidenceDisclosurePolicy } from './ConfidenceDisclosurePolicy';

export class ExecutiveDisclosureResolver {
  /**
   * Resolves mandatory disclosures.
   */
  static resolveDisclosures(narrative: ExecutiveNarrative): string[] {
    const disclosures: string[] = [];
    const rules = ConfidenceDisclosurePolicy.evaluateDisclosureRequirements(narrative);

    if (rules.requiresWarning) {
      disclosures.push('WARNING: Executive Narrative is operating under sub-optimal confidence.');
    }

    if (rules.requiresDisclosure) {
      disclosures.push(`DISCLOSURE: Confidence Level is ${narrative.confidence}. Fiduciary reliance should consider uncertainty.`);
    }

    const hasCritical = narrative.violations.some(v => v.severity === 'CRITICAL');
    if (hasCritical) {
      disclosures.push('MANDATORY_DISCLOSURE: Critical violations detected in the underlying runtime execution.');
    }

    return disclosures;
  }
}
