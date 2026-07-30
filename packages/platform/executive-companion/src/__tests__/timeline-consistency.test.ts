/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveTimelineEngine } from '../index';

describe('Quality Gate 8 — Timeline Consistency Test', () => {
  it('should maintain chronological timeline ordering', () => {
    const timeline = ExecutiveTimelineEngine.buildTimeline('empresa-demo');

    expect(timeline.events[0].dateIso).toBe('2025-01-15');
    expect(timeline.events[1].dateIso).toBe('2025-04-10');
    expect(timeline.events[2].dateIso).toBe('2025-08-20');
  });
});
