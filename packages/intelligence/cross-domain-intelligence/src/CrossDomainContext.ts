import { Identifier } from '@illumine/core-primitives';
import { CorporateDimensionType } from '@illumine/semantic-model';

export interface CrossDomainContext {
  readonly contextId: Identifier;
  readonly primaryDomain: CorporateDimensionType;
  readonly impactedDomains: CorporateDimensionType[];
  readonly description: string;
}
