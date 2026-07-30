/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveROIEngine } from '../index';

describe('Quality Gate 3 — Executive ROI Calculation Test', () => {
  it('should calculate ROI multiplier and payback period days', () => {
    const roi = ExecutiveROIEngine.calculateROI('Empresa ROI', 50000);

    expect(roi.roiRatioMultiplier).toBe(5.5);
    expect(roi.annualSavingsEstimated).toBe(275000);
    expect(roi.paybackPeriodDays).toBe(45);
  });
});
