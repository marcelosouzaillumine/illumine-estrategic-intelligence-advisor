import { Identifier } from '@illumine/core-primitives';

export interface EnterpriseContext {
  readonly enterpriseId: Identifier;
  readonly legalName: string;
  readonly tradingName: string;
  readonly headquartersRegion: string;
  readonly activeBusinessUnits: string[];
}
