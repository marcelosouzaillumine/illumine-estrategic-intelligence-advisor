/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveMomentEngine } from '../index';

describe('Quality Gate 9 — Moment Detection Test', () => {
  it('should detect institutional moments and flag simulated benchmark when needed', () => {
    const momentsSimulated = ExecutiveMomentEngine.detectMoments('empresa-demo', false);
    expect(momentsSimulated[0].isSimulatedBenchmark).toBe(true);

    const momentsReal = ExecutiveMomentEngine.detectMoments('empresa-demo', true);
    expect(momentsReal[0].isSimulatedBenchmark).toBe(false);
  });
});
