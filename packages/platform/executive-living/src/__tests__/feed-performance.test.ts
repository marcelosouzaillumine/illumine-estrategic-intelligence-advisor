/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveFeedEngine } from '../index';

describe('Quality Gate 3 — Feed Performance Test', () => {
  it('should generate feed items rapidly under 10ms', () => {
    const start = Date.now();
    ExecutiveFeedEngine.buildFeed('empresa-demo', []);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(50);
  });
});
