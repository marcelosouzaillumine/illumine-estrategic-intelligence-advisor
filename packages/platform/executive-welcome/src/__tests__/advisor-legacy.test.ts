/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisorLegacyEngine } from '../index';

describe('Quality Gate 17 — Advisor Legacy Test', () => {
  it('should build advisor impact narrative with active orgs and cash preserved', () => {
    const legacy = AdvisorLegacyEngine.buildAdvisorLegacy('Dr. Eduardo');

    expect(legacy.activeOrganizationsCount).toBe(18);
    expect(legacy.totalCashPreservedValueFormatted).toBe('R$ 12,4 milhões');
    expect(legacy.legacyNarrativeText).toContain('Esse é o impacto que sua atuação gera');
  });
});
