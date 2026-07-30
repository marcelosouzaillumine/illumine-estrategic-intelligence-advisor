/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveFeedEngine } from '../index';

describe('Quality Gate 11 — Timeline Integrity Test', () => {
  it('should maintain feed item timestamp and structure integrity', () => {
    const feed = ExecutiveFeedEngine.buildFeed('empresa-demo', []);

    feed.items.forEach((item) => {
      expect(item.timestampIso).toBeDefined();
      expect(item.timeFormatted).toBeDefined();
    });
  });
});
