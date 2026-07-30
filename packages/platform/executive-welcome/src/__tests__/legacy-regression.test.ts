/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveLegacyEngine } from '../index';

describe('Quality Gate 2 — Legacy Regression Test', () => {
  it('should calculate historical legacy and flag simulated benchmark when real data is unavailable', () => {
    const simulatedLegacy = ExecutiveLegacyEngine.calculateExecutiveLegacy(false);

    expect(simulatedLegacy.valuePreservedFormatted).toBe('R$ 4.800.000,00');
    expect(simulatedLegacy.isSimulatedBenchmark).toBe(true);

    const realLegacy = ExecutiveLegacyEngine.calculateExecutiveLegacy(true);
    expect(realLegacy.isSimulatedBenchmark).toBe(false);
  });
});
