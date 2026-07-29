import { describe, it, expect } from 'vitest';
import { ArchitectureFreezeRegistry, FreezeLevel, FreezeState } from '../index';

describe('@illumine/architecture-registry Freeze Lock Validation', () => {
  it('should confirm Level 1 Semantic Freeze is LOCKED', () => {
    expect(ArchitectureFreezeRegistry.isLocked(FreezeLevel.LEVEL_1_SEMANTIC)).toBe(true);
    expect(ArchitectureFreezeRegistry.getStatus(FreezeLevel.LEVEL_1_SEMANTIC).state).toBe(FreezeState.LOCKED);
  });

  it('should confirm Level 2 Contracts Freeze is LOCKED', () => {
    expect(ArchitectureFreezeRegistry.isLocked(FreezeLevel.LEVEL_2_CONTRACTS)).toBe(true);
  });

  it('should confirm Level 3 Architecture Freeze is LOCKED', () => {
    expect(ArchitectureFreezeRegistry.isLocked(FreezeLevel.LEVEL_3_ARCHITECTURE)).toBe(true);
  });
});
