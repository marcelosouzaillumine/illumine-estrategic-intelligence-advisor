export enum FreezeLevel {
  LEVEL_1_SEMANTIC = 'SEMANTIC_FREEZE',
  LEVEL_2_CONTRACTS = 'CONTRACTS_FREEZE',
  LEVEL_3_ARCHITECTURE = 'ARCHITECTURE_FREEZE'
}

export enum FreezeState {
  UNLOCKED = 'UNLOCKED',
  LOCKED = 'LOCKED'
}

export interface FreezeStatus {
  readonly level: FreezeLevel;
  readonly state: FreezeState;
  readonly lockedAt: string;
  readonly lockedBy: string;
}

export class ArchitectureFreezeRegistry {
  private static readonly statuses: Map<FreezeLevel, FreezeStatus> = new Map([
    [FreezeLevel.LEVEL_1_SEMANTIC, { level: FreezeLevel.LEVEL_1_SEMANTIC, state: FreezeState.LOCKED, lockedAt: '2026-07-28T00:00:00Z', lockedBy: 'IERA Council' }],
    [FreezeLevel.LEVEL_2_CONTRACTS, { level: FreezeLevel.LEVEL_2_CONTRACTS, state: FreezeState.LOCKED, lockedAt: '2026-07-28T00:00:00Z', lockedBy: 'IERA Council' }],
    [FreezeLevel.LEVEL_3_ARCHITECTURE, { level: FreezeLevel.LEVEL_3_ARCHITECTURE, state: FreezeState.LOCKED, lockedAt: '2026-07-28T00:00:00Z', lockedBy: 'IERA Council' }]
  ]);

  public static getStatus(level: FreezeLevel): FreezeStatus {
    return this.statuses.get(level)!;
  }

  public static isLocked(level: FreezeLevel): boolean {
    return this.statuses.get(level)?.state === FreezeState.LOCKED;
  }
}
