import { Identifier } from '@illumine/core-primitives';

export interface OrganizationalBoundary {
  readonly boundaryId: Identifier;
  readonly scope: 'INTERNAL' | 'SUBSIDIARY' | 'JOINT_VENTURE' | 'PARTNER_ECOSYSTEM';
  readonly name: string;
  readonly governanceLevel: 'STRICT' | 'SHARED' | 'ADVISORY';
}
