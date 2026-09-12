import { SegmentCode, SegmentRiskProfile } from './types';
import { SegmentIntelligenceRegistry } from './SegmentIntelligenceRegistry';

export class SegmentRiskProfileEngine {
  /**
   * Avalia os riscos predominantes e vulnerabilidades contextuais do setor.
   */
  static getRiskProfile(segmentCode: SegmentCode): SegmentRiskProfile {
    const registryEntry = SegmentIntelligenceRegistry[segmentCode];
    if (registryEntry) {
      return registryEntry.baseRiskProfile;
    }
    // Fallback prudencial
    return SegmentIntelligenceRegistry['GENERIC_OPERATION'].baseRiskProfile;
  }
}
