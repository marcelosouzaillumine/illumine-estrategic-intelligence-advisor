/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisoryOrganizationEngine, WhiteLabelEngine } from '../partner-ecosystem/src';

describe('@illumine/governance (Wave 18.11 Advisory Organization Engine)', () => {
  it('should create advisory organization with custom white label branding parameters (EAE v1.0)', () => {
    const org = AdvisoryOrganizationEngine.createOrganization('Illumine Consultoria', '#0052FF');
    expect(org.name).toBe('Illumine Consultoria');
    expect(org.certificationLevel).toBe('EXECUTIVE_FELLOW');

    const branding = WhiteLabelEngine.generateCustomBrandingStyle(org);
    expect(branding.primaryColor).toBe('#0052FF');
  });
});
