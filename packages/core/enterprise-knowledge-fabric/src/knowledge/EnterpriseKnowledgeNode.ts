import { Identifier } from '@illumine/core-primitives';

export interface EnterpriseKnowledgeNode {
  readonly nodeId: Identifier;
  readonly entityType: 'ORGANIZATION' | 'UNIT' | 'PROCESS' | 'CAPABILITY' | 'STRATEGY' | 'METRIC';
  readonly name: string;
  readonly domainCode: string;
  readonly attributes: Record<string, unknown>;
}
