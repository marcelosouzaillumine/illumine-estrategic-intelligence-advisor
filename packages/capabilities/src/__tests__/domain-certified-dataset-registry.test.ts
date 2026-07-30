/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DomainCertifiedDatasetRegistry } from '../domain-governance';

describe('@illumine/capabilities (Gate 19.2.6 Domain Certified Dataset Registry)', () => {
  it('should list canonical domain governance registry entries and identify certified financial dataset (v1.0)', () => {
    const entries = DomainCertifiedDatasetRegistry.getEntries();
    expect(entries).toHaveLength(5);

    const fin = DomainCertifiedDatasetRegistry.getEntryForDomain('FINANCIAL');
    expect(fin).toBeDefined();
    expect(fin?.status).toBe('CERTIFIED');
    expect(fin?.datasetName).toBe('CertifiedFinancialDataset');
  });
});
