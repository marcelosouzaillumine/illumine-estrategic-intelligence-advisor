import { FatigueState } from './types';

export class GovernanceFatigueDetection {
  public static evaluate(
    ignoredAlertsCount: number, 
    unresolvedWorkflowCount: number,
    isVolumeHigh: boolean
  ): FatigueState {
    
    // We cannot infer fatigue solely on volume. There MUST be ignored alerts or unresolved workflows.
    if (ignoredAlertsCount === 0 && unresolvedWorkflowCount === 0) {
      return {
        fatigueScore: 0,
        fatigueTrend: 'STABLE',
        governanceExhaustionLevel: 'NONE',
        operationalPressureLevel: isVolumeHigh ? 'ELEVATED' : 'NORMAL'
      };
    }

    let score = (ignoredAlertsCount * 15) + (unresolvedWorkflowCount * 10);
    if (isVolumeHigh) {
      score += 10; // Volume acts as an amplifier, not a root cause
    }

    let exhaustionLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 80) exhaustionLevel = 'CRITICAL';
    else if (score >= 50) exhaustionLevel = 'HIGH';
    else if (score >= 30) exhaustionLevel = 'MODERATE';

    let trend: 'DECREASING' | 'STABLE' | 'INCREASING' = 'INCREASING'; // Assuming increasing if there are unresolved workflows
    if (score === 0) trend = 'STABLE';

    return {
      fatigueScore: Math.min(score, 100),
      fatigueTrend: trend,
      governanceExhaustionLevel: exhaustionLevel,
      operationalPressureLevel: isVolumeHigh ? (score >= 50 ? 'SEVERE' : 'ELEVATED') : 'NORMAL'
    };
  }
}
