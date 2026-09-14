import { Identifier } from '@illumine/core-primitives';

export type OrgNodeType = 'STRATEGY' | 'CAPABILITY' | 'PROCESS' | 'METRIC' | 'DECISION' | 'OUTCOME';

export interface OrgGraphNode {
  readonly id: Identifier;
  readonly type: OrgNodeType;
  readonly name: string;
  readonly code: string;
}
