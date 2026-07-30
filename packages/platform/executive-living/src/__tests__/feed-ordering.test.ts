/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveFeedEngine } from '../index';

describe('Quality Gate 2 — Feed Ordering Test', () => {
  it('should format feed items with timestamps and chronological sequence', () => {
    const feed = ExecutiveFeedEngine.buildFeed('empresa-demo', []);

    expect(feed.items[0].timeFormatted).toBe('08:14');
    expect(feed.items[1].timeFormatted).toBe('09:20');
  });
});
