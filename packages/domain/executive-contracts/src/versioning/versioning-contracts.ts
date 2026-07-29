import { Version } from '@illumine/core-primitives';

export enum CompatibilityLevel {
  PATCH = 'PATCH',
  MINOR = 'MINOR',
  MAJOR = 'MAJOR'
}

export interface ContractVersion {
  readonly version: Version;
  readonly compatibilityLevel: CompatibilityLevel;
  readonly releasedAt: string;
}

export interface BreakingChangePolicy {
  readonly allowBreakingChanges: boolean;
  readonly minimumSupportedVersion: Version;
}
