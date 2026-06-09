import { GovernanceSignal, SignalEngineResolution } from '../signal-hierarchy/types';

export class ExecutiveSignalVisibilityEngine {
  public determineVisibility(signal: GovernanceSignal, role: string): SignalEngineResolution<boolean> {
    if (!signal) return { status: 'INSUFFICIENT_SIGNAL_CONTEXT', data: null };
    // Fail-closed
    if (signal.severity !== 'CRITICAL' && role === 'BOARD') {
      return { status: 'SUPPRESSED', data: false };
    }
    return { status: 'READY', data: true };
  }
}
