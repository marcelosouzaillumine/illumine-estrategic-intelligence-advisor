import { ExecutiveSignalContract } from './ExecutiveSignalContract';
import { ExecutiveFeedContract } from './ExecutiveFeedContract';
import { ExecutiveReflectionContract } from './ExecutiveReflectionContract';
import { ExecutiveMomentContract } from './ExecutiveMomentContract';
import { ExecutiveNudgeContract } from './ExecutiveNudgeContract';

export interface ExecutiveLivingContract {
  readonly livingId: string;
  readonly companyId: string;
  readonly userId: string;
  readonly feed: ExecutiveFeedContract;
  readonly signals: readonly ExecutiveSignalContract[];
  readonly nudges: readonly ExecutiveNudgeContract[]; // máximo 3
  readonly moments: readonly ExecutiveMomentContract[];
  readonly reflection: ExecutiveReflectionContract;
  readonly generatedAt: string;
}

export * from './ExecutiveSignalContract';
export * from './ExecutiveFeedContract';
export * from './ExecutiveReflectionContract';
export * from './ExecutiveMomentContract';
export * from './ExecutiveNudgeContract';
