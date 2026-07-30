/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCaseGeneratorEngine } from '../index';

describe('Quality Gate 5 — Executive Case Generator Test', () => {
  it('should generate institutional case study based on real evidence', () => {
    const caseStudy = ExecutiveCaseGeneratorEngine.generateCase('Empresa Case');

    expect(caseStudy.beforeEbitdaMarginPercent).toBe(8.0);
    expect(caseStudy.afterEbitdaMarginPercent).toBe(11.5);
    expect(caseStudy.executiveTestimonial).toContain('Illumine OS™');
  });
});
