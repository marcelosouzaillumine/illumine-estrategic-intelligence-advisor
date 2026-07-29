import { Identifier } from '@illumine/core-primitives';
import { AgentDomainContext } from '@illumine/executive-contracts';

export interface IntelligenceContext {
  readonly contextId: Identifier;
  readonly domainContext: AgentDomainContext;
  readonly activeCapabilities: string[];
}
