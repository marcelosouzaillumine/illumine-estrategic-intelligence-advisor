import { GovernanceSignal } from '../signal-hierarchy/types';
import { RuntimeResolutionStatus } from '../types';

export interface CausalRelationship {
  sourceSignalId: string;
  targetDomain: string;
  impactWeight: number;
}

export interface CausalityEngineResolution<T> {
  status: RuntimeResolutionStatus;
  data: T | null;
  reason?: string;
}
