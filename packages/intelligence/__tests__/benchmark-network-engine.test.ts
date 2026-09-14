/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { BenchmarkQuery } from '@illumine/executive-contracts';
import { BenchmarkEngine, OrganizationalPatternMiner } from '../benchmark-intelligence/src';

describe('@illumine/governance (Wave 18.8 Multi-Tenant Benchmark Network Engine)', () => {
  it('should calculate industry statistics and percentile position with gap analysis (MBAI v2.0)', () => {
    const query: BenchmarkQuery = {
      metricCode: 'EBITDA_MARGIN',
      industrySegment: 'Varejo / Alimentos',
      companySize: 'MEDIUM',
      managementMaturity: 'STRUCTURED'
    };

    const calc = BenchmarkEngine.calculatePercentilePosition(query, 11.0); // EBITDA 11% vs Mediana 17%
    expect(calc.percentile).toBe(38); // P38
    expect(calc.medianValue).toBe(17.0);
    expect(calc.gapPoints).toBe(-6.0); // -6 p.p.
    expect(calc.sampleSize).toBe(450);
  });

  it('should mine aggregated organizational patterns across multi-tenant dataset', () => {
    const patterns = OrganizationalPatternMiner.mineAggregatedPatterns();
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0].observedCorrelation).toBeGreaterThan(0.8);
  });
});
