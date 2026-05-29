import { GovernanceSignal, SignalEngineResolution } from './types';

export class SignalSuppressionEngine {
  private activeSignals: Map<string, GovernanceSignal> = new Map();

  public evaluateSignal(signal: GovernanceSignal): SignalEngineResolution<GovernanceSignal> {
    const existing = Array.from(this.activeSignals.values()).find(
      s => s.sourceModule === signal.sourceModule && s.category === signal.category && s.message === signal.message
    );

    if (existing) {
      return { status: 'SUPPRESSED', data: null, reason: 'Redundant alert' };
    }

    if (signal.severity === 'LOW' && signal.fiduciaryCriticality === 'NO_IMPACT') {
      // Optional: Logic to suppress low-priority noise under high load
    }

    this.activeSignals.set(signal.id, signal);
    return { status: 'READY', data: signal };
  }
}
