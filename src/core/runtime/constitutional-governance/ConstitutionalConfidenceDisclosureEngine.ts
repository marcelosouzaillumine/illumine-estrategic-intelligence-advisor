import { ConfidenceBreakdown } from './constitutional-dashboard-types';

export class ConstitutionalConfidenceDisclosureEngine {
  public static extractConfidence(runtimeOutput: any): ConfidenceBreakdown {
    // Aggregates and exposes confidence decomposition from certified runtime outputs.
    // Does NOT evaluate or calculate confidence.
    const isQuarantined = runtimeOutput?.status === 'CONSTITUTIONAL_QUARANTINE';
    const isFailed = runtimeOutput?.status === 'FAILED';
    const runtimeConfidence = runtimeOutput?.canonicalState?.confidence;
    
    let overallConfidence: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'FAIL_CLOSED' = 'HIGH_CONFIDENCE';
    
    if (isQuarantined || isFailed || runtimeConfidence === 'BLOCKED') {
      overallConfidence = 'FAIL_CLOSED';
    } else if (runtimeConfidence === 'LOW' || runtimeConfidence === 'RESTRICTED') {
      overallConfidence = 'LOW_CONFIDENCE';
    } else if (runtimeConfidence === 'MODERATE') {
      overallConfidence = 'MEDIUM_CONFIDENCE';
    } else {
      overallConfidence = 'HIGH_CONFIDENCE';
    }

    return {
      overallConfidence,
      completenessScore: runtimeOutput?.canonicalState?.confidenceScore || 100,
      historicalDepthMonths: runtimeOutput?.metrics?.historicalCyclesCount ? runtimeOutput.metrics.historicalCyclesCount * 12 : 12,
      runtimeConsistency: isQuarantined ? 'BROKEN' : (runtimeConfidence === 'LOW' ? 'DEGRADED' : 'CONSISTENT'),
      lineageContinuity: runtimeOutput?.canonicalState?.isLineageIncomplete ? 'ORPHANED' : 'UNBROKEN'
    };
  }
}
