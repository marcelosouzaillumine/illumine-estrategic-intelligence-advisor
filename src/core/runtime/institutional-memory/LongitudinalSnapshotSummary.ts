export interface LongitudinalSnapshotSummaryData {
  maturityScore: number;
  maturityTrend: string;
  dominantRisksSummary: string[];
  advisoryPosture: string;
  recommendationCount: number;
  ignoredRecommendationCount: number;
  anomalyCount: number;
  recurrenceFlags: string[];
  confidenceState: string;
  lineageHash: string;
  inputHash: string;
  advisoryHash: string;
}

export class LongitudinalSnapshotSummary {
  public static build(payload: any): LongitudinalSnapshotSummaryData {
    // Explicitly reject and strip any full payload structures
    if (
      payload.balanceSheet !== undefined ||
      payload.dre !== undefined ||
      payload.cashFlow !== undefined ||
      payload.bpData !== undefined ||
      payload.dreData !== undefined ||
      payload.cashFlowData !== undefined ||
      payload.runtimePayload !== undefined ||
      payload.fullAdvisoryPayload !== undefined
    ) {
      throw new Error('LongitudinalSnapshotSummary must not contain full financial payloads or runtime states.');
    }

    return {
      maturityScore: payload.maturityScore || 0,
      maturityTrend: payload.maturityTrend || 'STABLE',
      dominantRisksSummary: payload.dominantRisksSummary || [],
      advisoryPosture: payload.advisoryPosture || 'UNKNOWN',
      recommendationCount: payload.recommendationCount || 0,
      ignoredRecommendationCount: payload.ignoredRecommendationCount || 0,
      anomalyCount: payload.anomalyCount || 0,
      recurrenceFlags: payload.recurrenceFlags || [],
      confidenceState: payload.confidenceState || 'UNKNOWN',
      lineageHash: payload.lineageHash || '',
      inputHash: payload.inputHash || '',
      advisoryHash: payload.advisoryHash || ''
    };
  }
}
