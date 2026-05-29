import { GovernanceSignal, SignalEngineResolution } from '../signal-hierarchy/types';

export class CognitiveLoadGovernor {
  private recentAlertsCount = 0;

  public throttle(signal: GovernanceSignal): SignalEngineResolution<GovernanceSignal> {
    if (this.recentAlertsCount > 5 && signal.severity !== 'CRITICAL') {
      return { status: 'SUPPRESSED', data: null, reason: 'Cognitive overload prevention' };
    }
    this.recentAlertsCount++;
    return { status: 'READY', data: signal };
  }
  
  public reset() {
    this.recentAlertsCount = 0;
  }
}
