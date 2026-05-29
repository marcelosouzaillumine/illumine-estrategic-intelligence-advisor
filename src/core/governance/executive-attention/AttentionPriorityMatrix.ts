import { SignalEngineResolution } from '../signal-hierarchy/types';

export class AttentionPriorityMatrix {
  public getPriorityForRole(role: string): SignalEngineResolution<number> {
    return { status: 'READY', data: role === 'CEO' ? 1 : 2 };
  }
}
