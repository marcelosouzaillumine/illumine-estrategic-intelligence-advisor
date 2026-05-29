import { SignalEngineResolution } from '../signal-hierarchy/types';

export class RoleBasedNarrativeResolver {
  public adapt(narrative: string, role: string): SignalEngineResolution<string> {
    if (!narrative) return { status: 'INSUFFICIENT_SIGNAL_CONTEXT', data: null };
    return { status: 'READY', data: '[' + role + ' VIEW]: ' + narrative };
  }
}
