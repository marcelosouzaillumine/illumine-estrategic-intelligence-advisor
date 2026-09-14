import { Identifier } from '@illumine/core-primitives';
import { EnterpriseContext } from '@illumine/enterprise-knowledge-fabric';

export interface AgentExecutionContext {
  readonly executionId: Identifier;
  readonly agentId: string;
  readonly domain: string;
  readonly enterpriseContext: EnterpriseContext;
  readonly triggeredBySignalId?: Identifier;
  readonly initiatedAt: Date;
}
