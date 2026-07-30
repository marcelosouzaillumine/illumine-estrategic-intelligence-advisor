/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveLeadEngine } from '../index';

describe('Quality Gate 1 — Executive CRM Regression Test', () => {
  it('should manage pipeline stages and calculate weighted pipeline value', () => {
    const crm = ExecutiveLeadEngine.getActiveCRM();

    expect(crm.opportunities.length).toBeGreaterThan(0);
    expect(crm.totalPipelineValue).toBeGreaterThan(0);
    expect(crm.weightedPipelineValue).toBeLessThanOrEqual(crm.totalPipelineValue);
  });
});
