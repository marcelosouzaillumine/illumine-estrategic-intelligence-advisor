/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DomainCertificationPipelineEngine } from '../index';

describe('Quality Gate 2 — Certified Dataset Integrity Contract Test', () => {
  it('should enforce dataset hash, certification status, lineage, validator and boundary for any certified dataset', () => {
    const dataset = DomainCertificationPipelineEngine.routeAndCertify('FINANCIAL', 'ds-fin-integrity');

    expect(dataset.identity.datasetHash).toContain('certified-hash-');
    expect(dataset.governance.certificationStatus).toBe('CERTIFIED');
    expect(dataset.lineage.sourceSystem).toBe('EDIF_Ingestion_Pipeline');
    expect(dataset.lineage.validatorService).toBe('FinancialGovernanceBoundary');
    expect(dataset.lineage.certifierAuthority).toBe('DomainCertifiedDatasetRegistry');
  });
});
