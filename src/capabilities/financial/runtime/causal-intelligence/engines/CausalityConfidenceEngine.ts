// src/core/runtime/causal-intelligence/engines/CausalityConfidenceEngine.ts

import { CausalConfidence } from '../causal-types';
import { HistoricalRuntimeCycle } from '../../../../workspace/runtime/executive-timeline/executive-timeline-types';

export class CausalityConfidenceEngine {
  public static determine(
    cycles: HistoricalRuntimeCycle[],
    timelineConfidence: string
  ): CausalConfidence {
    // 1. Fail Closed enforcement
    if (timelineConfidence === 'FAIL_CLOSED') {
      return 'CAUSALITY_RESTRICTED';
    }

    if (cycles.length < 2) {
      return 'CAUSALITY_RESTRICTED';
    }

    const latest = cycles[cycles.length - 1];

    if (latest.isQuarantined) {
      return 'CAUSALITY_RESTRICTED';
    }

    // Lineage broken check
    const hasBrokenLineage = cycles.some(c => !c.lineageHash || c.lineageHash === 'N/A' || c.lineageHash.includes('broken'));
    if (hasBrokenLineage) {
      return 'CAUSALITY_RESTRICTED';
    }

    // 2. Base confidence on cycles depth
    let confidence: CausalConfidence = 'LOW';

    if (cycles.length >= 4) {
      confidence = 'HIGH';
    } else if (cycles.length === 3) {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }

    // 3. Degrade if restricted
    if (latest.isRestricted) {
      if (confidence === 'HIGH') {
        confidence = 'MEDIUM';
      } else if (confidence === 'MEDIUM') {
        confidence = 'LOW';
      }
    }

    return confidence;
  }
}
