import { ConfidenceTrend } from './MonitoringTypes';

export class ConfidenceDriftDetector {
  /**
   * Detecta passivamente degradação na linha do tempo de confidence fiduciária.
   */
  static analyzeDrift(historicalConfidences: string[], groupId: string): ConfidenceTrend | null {
    if (historicalConfidences.length < 2) return null;

    const current = historicalConfidences[historicalConfidences.length - 1];
    const previous = historicalConfidences[historicalConfidences.length - 2];

    const driftDetected = (previous === 'HIGH' && current !== 'HIGH') || 
                          (previous === 'MEDIUM' && current === 'LOW');

    return {
      trendId: `TREND-${Date.now()}`,
      groupId,
      previousConfidence: previous,
      currentConfidence: current,
      driftDetected,
      timestamp: new Date().toISOString()
    };
  }
}
