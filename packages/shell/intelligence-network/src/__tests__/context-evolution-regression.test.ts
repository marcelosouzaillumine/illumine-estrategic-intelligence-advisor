/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveContextAssembler, ExecutiveContextEnrichment, ExecutiveContextValidator } from '../index';

describe('Quality Gate 4 — Context Evolution Regression Test', () => {
  it('should maintain backward compatibility of ExecutiveContextEnvelope during assembly and enrichment', () => {
    const raw = ExecutiveContextAssembler.assembleBaseContext('empresa-regr-check', 'FINANCIAL');
    const enriched = ExecutiveContextEnrichment.enrichContext(raw);
    const validated = ExecutiveContextValidator.validateEnvelope(enriched);

    expect(validated.contextId).toBe(raw.contextId);
    expect(validated.companyId).toBe('empresa-regr-check');
    expect(validated.activeDomain).toBe('FINANCIAL');
    expect(validated.isValidated).toBe(true);
  });
});
