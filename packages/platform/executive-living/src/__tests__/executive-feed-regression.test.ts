/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveLivingOrchestrator } from '../index';

describe('Quality Gate 1 — Executive Feed Regression Test', () => {
  it('should generate complete living experience with feed items and signals', () => {
    const living = ExecutiveLivingOrchestrator.buildLivingExperience('u-feed-reg', 'empresa-demo');

    expect(living.feed.items.length).toBeGreaterThan(0);
    expect(living.signals.length).toBeGreaterThan(0);
  });
});
