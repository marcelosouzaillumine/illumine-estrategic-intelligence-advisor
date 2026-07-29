import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionTimeline, ExperienceRecord } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/organizational-memory (Wave 16.5 Phase 5 Institutional Memory)', () => {
  it('should find historical decision matches and key learnings (ADR-045)', () => {
    const timeline = new ExecutiveDecisionTimeline();

    const record: ExperienceRecord = {
      recordId: 'rec-hist-01',
      identity: { agentId: 'cfo-agent' },
      provenance: { source: 'DRE Q3' },
      context: { businessUnit: 'Holding', summary: 'Emissão de dívida 2024' },
      observedSignals: [],
      appliedDecision: 'Debêntures',
      timestamp: new Date()
    };

    timeline.addRecord(record);

    const matches = timeline.findSimilarDecisions('Captação de dívida');
    expect(matches.length).toBe(1);
    expect(matches[0].similarityScore.value).toBe(88);
  });
});
