import { describe, it, expect } from 'vitest';
import { ExecutiveActionResolver } from '@illumine/executive-decision-intelligence';

describe('@illumine/intelligence (Wave 17.12 Decision Flow)', () => {
  it('should resolve decision actions (Investigate, Simulate, Decide) for DRE', () => {
    const actions = ExecutiveActionResolver.resolveActions({ pageId: 'DREPage' });

    expect(actions.length).toBe(3);
    expect(actions[0].type).toBe('INVESTIGATE');
    expect(actions[1].type).toBe('SIMULATE');
    expect(actions[2].type).toBe('DECIDE');
  });
});
