import { GovernanceSignal, SignalEngineResolution } from './types';

export class SignalPriorityEngine {
  public calculatePriority(signal: GovernanceSignal): SignalEngineResolution<number> {
    if (!signal.severity || !signal.fiduciaryCriticality) {
      return { status: 'INSUFFICIENT_SIGNAL_CONTEXT', data: null, reason: 'Missing severity or criticality' };
    }
    
    let score = 0;
    
    if (signal.severity === 'CRITICAL') score += 100;
    else if (signal.severity === 'HIGH') score += 75;
    else if (signal.severity === 'MEDIUM') score += 50;
    else score += 25;

    if (signal.fiduciaryCriticality === 'SEVERE_BREACH') score += 100;
    else if (signal.fiduciaryCriticality === 'ELEVATED_RISK') score += 50;

    return { status: 'READY', data: score };
  }
}
