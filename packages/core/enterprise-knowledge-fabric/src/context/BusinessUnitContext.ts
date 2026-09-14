import { Identifier } from '@illumine/core-primitives';

export interface BusinessUnitContext {
  readonly unitId: Identifier;
  readonly enterpriseId: Identifier;
  readonly unitName: string;
  readonly operationalRegion: string;
  readonly primaryDomain: string;
}
