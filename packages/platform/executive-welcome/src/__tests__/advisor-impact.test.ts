/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisorLegacyEngine } from '../index';

describe('Quality Gate 5 — Advisor Impact Test', () => {
  it('should deliver aggregated portfolio impact narrative for advisor role', () => {
    const legacy = AdvisorLegacyEngine.buildAdvisorLegacy('Dr. Eduardo');

    expect(legacy.activeOrganizationsCount).toBe(18);
    expect(legacy.totalCashPreservedValueFormatted).toBe('R$ 12,4 milhões');
    expect(legacy.legacyNarrativeText).toContain('impacto que sua atuação gera');
  });
});
