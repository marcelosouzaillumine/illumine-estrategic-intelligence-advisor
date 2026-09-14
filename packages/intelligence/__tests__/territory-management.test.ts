/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { TerritoryManagementEngine } from '../platform-distribution/src';

describe('@illumine/governance (Wave 19.2 Territory Management Engine)', () => {
  it('should register exclusive partner territories by state, city and sector', () => {
    const terr = TerritoryManagementEngine.registerExclusiveTerritory('SP', 'São Paulo', 'Tecnologia', 'partner-illumine');
    expect(terr.exclusivePartnerOrgId).toBe('partner-illumine');
    expect(terr.city).toBe('São Paulo');
  });
});
