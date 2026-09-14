/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { UniversalTaxonomyEngine } from '../enterprise-knowledge-foundation/src';

describe('@illumine/governance (Wave 19.2.5 Universal Taxonomy Engine)', () => {
  it('should map corporate concepts to universal taxonomy codes', () => {
    const tax = UniversalTaxonomyEngine.mapTaxonomy('REV_SAAS_ARR', 'Annual Recurring Revenue', 'FINANCIAL');
    expect(tax.categoryCode).toBe('REV_SAAS_ARR');
    expect(tax.mappedDomain).toBe('FINANCIAL');
  });
});
