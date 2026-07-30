/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveTrustEngine } from '../index';

describe('Quality Gate 6 — Executive Trust Engine Test', () => {
  it('should measure Time to Trusted Decision (TTTD) and trust score', () => {
    const trust = ExecutiveTrustEngine.measureTrust('empresa-trust');

    expect(trust.tttdSecondsToFirstTrust).toBeLessThan(300); // Menos de 5 minutos
    expect(trust.trustScore).toBeGreaterThan(90);
  });
});
