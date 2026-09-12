import { describe, it, expect } from 'vitest';
import { AgentLifecycleManager } from '../index';

describe('@illumine/agent-runtime (Wave 15B Phase 2 Lifecycle)', () => {
  it('should transition through the 7 canonical lifecycle states from IDLE to LEARN', () => {
    const manager = new AgentLifecycleManager();
    expect(manager.getState()).toBe('IDLE');

    manager.transitionTo('OBSERVE');
    expect(manager.getState()).toBe('OBSERVE');

    manager.transitionTo('ANALYZE');
    expect(manager.getState()).toBe('ANALYZE');

    manager.transitionTo('REASON');
    expect(manager.getState()).toBe('REASON');

    manager.transitionTo('RECOMMEND');
    expect(manager.getState()).toBe('RECOMMEND');

    manager.transitionTo('WAIT_HUMAN_APPROVAL');
    expect(manager.getState()).toBe('WAIT_HUMAN_APPROVAL');

    manager.transitionTo('LEARN');
    expect(manager.getState()).toBe('LEARN');

    manager.transitionTo('IDLE');
    expect(manager.getState()).toBe('IDLE');
  });

  it('should throw error on invalid state transition', () => {
    const manager = new AgentLifecycleManager();
    expect(() => manager.transitionTo('LEARN')).toThrow();
  });
});
