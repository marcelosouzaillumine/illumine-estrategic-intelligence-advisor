/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveTimelineEngine } from '../index';

describe('Quality Gate 2 — Timeline Regression Test', () => {
  it('should build historical timeline events with learning and value generated', () => {
    const timeline = ExecutiveTimelineEngine.buildTimeline('empresa-demo');

    expect(timeline.totalEventsCount).toBe(3);
    expect(timeline.events[0].title).toContain('Implantação da Illumine OS™');
    expect(timeline.events[2].valueGeneratedFormatted).toBe('R$ 4.800.000,00');
  });
});
