/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionTimelineEngine, ExecutiveActionCenterEngine } from '../index';

describe('Quality Gate 6 — Executive Onboarding & Commercial Tour Test', () => {
  it('should build executive decision timeline and action plan for 5-minute presentation mode', () => {
    const timeline = ExecutiveDecisionTimelineEngine.buildTimeline('empresa-demo-tour');
    expect(timeline.length).toBe(3);

    const actionPlan = ExecutiveActionCenterEngine.createActionPlan('Ação Imediata 5 Min', 'CFO');
    expect(actionPlan.status).toBe('IN_PROGRESS');
    expect(actionPlan.checklist.length).toBe(3);
  });
});
