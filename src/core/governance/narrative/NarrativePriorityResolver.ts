import { SignalEngineResolution } from '../signal-hierarchy/types';

export class NarrativePriorityResolver {
  public resolveWeight(narrative: string): SignalEngineResolution<number> {
    if (!narrative) return { status: 'BLOCKED_BY_LOW_CONFIDENCE', data: null };
    return { status: 'READY', data: narrative.includes('Deterioração') ? 100 : 50 };
  }
}
