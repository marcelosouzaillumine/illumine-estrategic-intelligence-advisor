/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisoryWorkflowEngine } from '../partner-ecosystem/src';

describe('@illumine/governance (Wave 18.11 Advisory Workflow Engine)', () => {
  it('should transition recommendation through workflow stages with reviewer audit trailing', () => {
    const wf = AdvisoryWorkflowEngine.transitionStage('rec-01', 'adv-fin-01', 'APPROVED', 'Recomendação homologada pelo advisor');
    expect(wf.currentStage).toBe('APPROVED');
    expect(wf.reviewerComment).toBe('Recomendação homologada pelo advisor');
  });
});
