import { Identifier } from '@illumine/core-primitives';

export type ExecutiveRoleType = 'BOARD' | 'CEO' | 'ADVISOR' | 'COMMITTEE_MEMBER';

export interface ExecutiveNode {
  readonly nodeId: Identifier;
  readonly role: ExecutiveRoleType;
  readonly name: string;
  readonly capabilitiesAssigned: string[];
}
