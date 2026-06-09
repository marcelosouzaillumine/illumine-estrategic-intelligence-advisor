import { 
  DeteriorationState, 
  FatigueState, 
  ResponsivenessMetrics, 
  PredictiveRecurrenceState, 
  TemporalGovernanceScore 
} from './types';

export class TemporalGovernanceScoring {
  public static evaluate(
    deterioration: DeteriorationState,
    responsiveness: ResponsivenessMetrics,
    fatigue: FatigueState,
    recurrence: PredictiveRecurrenceState
  ): TemporalGovernanceScore {
    
    // Default base score is highly sensitive to the four core pillars
    const baseScore = 100;

    const deteriorationWeight = Math.min(deterioration.deteriorationScore, 100);
    const fatigueWeight = Math.min(fatigue.fatigueScore, 100);
    const recurrenceSeverityWeight = recurrence.recurrenceScore;
    
    // Responsiveness mitigates damage (positive weight)
    const responsivenessWeight = responsiveness.responsivenessScore;
    
    // Simplified resilience modifier: higher execution and low fatigue indicates resilience
    const resilienceWeight = (responsiveness.advisoryExecutionRate * 0.7) - (fatigue.fatigueScore * 0.3);

    let finalScore = baseScore - (deteriorationWeight * 0.4) - (fatigueWeight * 0.3) - (recurrenceSeverityWeight * 0.3) + (responsivenessWeight * 0.2);

    finalScore = Math.max(0, Math.min(100, finalScore));

    let trajectory: 'IMPROVING' | 'STABLE' | 'DETERIORATING' = 'STABLE';
    if (finalScore > 75 && deterioration.deteriorationVelocity === 0 && recurrence.recurrenceFrequency === 0) {
      trajectory = 'IMPROVING';
    } else if (deterioration.deteriorationVelocity > 0 || recurrence.recurrenceScore > 50) {
      trajectory = 'DETERIORATING';
    }

    const institutionalStabilityIndex = Number((finalScore / 100).toFixed(2));

    return {
      temporalGovernanceScore: Number(finalScore.toFixed(2)),
      governanceTrajectory: trajectory,
      institutionalStabilityIndex,
      recurrenceSeverityWeight: Number(recurrenceSeverityWeight.toFixed(2)),
      responsivenessWeight: Number(responsivenessWeight.toFixed(2)),
      fatigueWeight: Number(fatigueWeight.toFixed(2)),
      deteriorationWeight: Number(deteriorationWeight.toFixed(2)),
      resilienceWeight: Number(resilienceWeight.toFixed(2))
    };
  }
}
