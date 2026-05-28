import { HistoricalReplayIndexEntry, DeteriorationState } from './types';

export class InstitutionalDeteriorationModel {
  public static evaluate(
    history: HistoricalReplayIndexEntry[],
    anomalyCount: number,
    ignoredRecommendationsCount: number
  ): DeteriorationState {
    if (history.length < 3) {
      return {
        deteriorationScore: 0,
        deteriorationVelocity: 0,
        deteriorationSeverity: 'LOW',
        deteriorationPersistence: 0,
        institutionalRiskLevel: 'INSUFFICIENT_HISTORY'
      };
    }

    let score = 0;
    let persistence = 0;
    
    // Sort chronological: oldest to newest
    const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let velocity = 0;
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];

      // If maturity drops, deterioration increases
      if (curr.maturityScore < prev.maturityScore) {
        score += (prev.maturityScore - curr.maturityScore) * 2;
        persistence++;
        velocity += 1.5;
      }

      // If anomaly references grow
      if (curr.anomalyReferences.length > prev.anomalyReferences.length) {
        score += 15;
        persistence++;
        velocity += 2;
      }
    }

    // Impact of current raw numbers
    score += (anomalyCount * 5);
    score += (ignoredRecommendationsCount * 10);

    let severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score > 100) severity = 'CRITICAL';
    else if (score > 60) severity = 'HIGH';
    else if (score > 30) severity = 'MODERATE';

    let riskLevel: 'STABLE' | 'ELEVATED' | 'SEVERE' | 'INSUFFICIENT_HISTORY' = 'STABLE';
    if (severity === 'CRITICAL' && persistence >= 2) riskLevel = 'SEVERE';
    else if (severity === 'HIGH' || persistence >= 1) riskLevel = 'ELEVATED';

    return {
      deteriorationScore: Math.min(score, 100), // Cap at 100
      deteriorationVelocity: Number(velocity.toFixed(2)),
      deteriorationSeverity: severity,
      deteriorationPersistence: persistence,
      institutionalRiskLevel: riskLevel
    };
  }
}
