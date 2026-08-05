import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialMetricOntology } from '../ontology/FinancialMetricOntology';

describe('FinancialMetricOntology', () => {
  let ontology: FinancialMetricOntology;

  beforeEach(() => {
    ontology = new FinancialMetricOntology();
  });

  it('should resolve EBITDA margin definition correctly with business questions', () => {
    const ebitda = ontology.resolve('financial.profitability.ebitda_margin');
    
    expect(ebitda).toBeDefined();
    expect(ebitda?.category).toBe('profitability');
    expect(ebitda?.businessQuestion).toContain('gera valor suficiente');
    expect(ebitda?.relatedMetrics).toContain('cash_generation');
  });

  it('should return undefined for unknown metrics', () => {
    const unknown = ontology.resolve('financial.unknown.metric');
    expect(unknown).toBeUndefined();
  });
});
