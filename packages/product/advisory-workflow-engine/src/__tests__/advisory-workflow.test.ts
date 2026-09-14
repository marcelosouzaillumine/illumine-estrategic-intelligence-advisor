import { describe, it, expect } from 'vitest';
import { AdvisoryCase } from '../index';

describe('@illumine/advisory-workflow-engine (Wave 15D Phase 4 Workflow Engine)', () => {
  it('should transition AdvisoryCase through the 8 canonical status steps from OPEN to LEARNED', () => {
    const advisoryCase = new AdvisoryCase('case-01', 'Reestruturação de Passivo', 'ent-holding-01');
    expect(advisoryCase.getStatus()).toBe('OPEN');

    advisoryCase.transitionTo('ANALYZING');
    expect(advisoryCase.getStatus()).toBe('ANALYZING');

    advisoryCase.transitionTo('RECOMMENDATION_READY');
    expect(advisoryCase.getStatus()).toBe('RECOMMENDATION_READY');

    advisoryCase.transitionTo('EXECUTIVE_REVIEW');
    expect(advisoryCase.getStatus()).toBe('EXECUTIVE_REVIEW');

    advisoryCase.transitionTo('APPROVED');
    expect(advisoryCase.getStatus()).toBe('APPROVED');

    advisoryCase.transitionTo('IMPLEMENTING');
    expect(advisoryCase.getStatus()).toBe('IMPLEMENTING');

    advisoryCase.transitionTo('MEASURED');
    expect(advisoryCase.getStatus()).toBe('MEASURED');

    advisoryCase.transitionTo('LEARNED');
    expect(advisoryCase.getStatus()).toBe('LEARNED');
  });
});
