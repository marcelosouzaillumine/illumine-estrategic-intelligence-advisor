import { GroundingPackage } from './GroundingPackage';
import { GroundingTrace } from './GroundingTrace';

export interface GroundingSession {
  id: string;
  tenantId: string;
  workspaceId: string;
  objective: string;
  provider: string; // The selected AI provider
  budget: {
    allocatedTokens: number;
    consumedTokens: number;
  };
  trace: GroundingTrace;
  package: GroundingPackage;
  startedAt: Date;
  finishedAt: Date;
  costEstimate: number;
  latencyMs: number;
}
