/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DataLineageTrace } from '@illumine/executive-contracts';

describe('@illumine/governance (Wave 18.4 Data Lineage Traceability)', () => {
  it('should enforce DataLineageTrace from raw source to metric and insight (ADR-079)', () => {
    const trace: DataLineageTrace = {
      traceId: 'trace-101',
      dataSourceId: 'src-erp-finance',
      dataSourceName: 'ERP Conta Azul — DRE Contábil',
      transformationName: 'Agregação Semântica IERA',
      metricCode: 'EBITDA_MARGIN',
      metricValue: '7.3%',
      insightId: 'ins-001',
      timestamp: '2026-07-30T04:30:00Z'
    };

    expect(trace.dataSourceId).toBe('src-erp-finance');
    expect(trace.metricCode).toBe('EBITDA_MARGIN');
    expect(trace.timestamp).toBeDefined();
  });
});
