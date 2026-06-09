// tests/governance-copilot-conflict-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotConflictEngine } from '../src/lib/governance-copilot-conflict-engine';

describe('GovernanceCopilotConflictEngine', () => {
  it('must return empty array on undefined input', () => {
    const conflicts = GovernanceCopilotConflictEngine.detectConflicts(undefined as any);
    assert.deepStrictEqual(conflicts, []);
  });

  it('must detect Conflict Type 4: CAIL HIGH and IOD LOW', () => {
    const input: any = {
      capitalAllocationIntelligence: { strategicInvestmentPriorities: ['M&A'] },
      institutionalOutcomes: { conversionMetrics: { decisionToActionRate: 0.3 } }
    };
    const conflicts = GovernanceCopilotConflictEngine.detectConflicts(input);
    assert.strictEqual(conflicts.length, 1);
    assert.strictEqual(conflicts[0].layersInvolved.join(','), 'CAIL,IOD');
  });

  it('must detect Conflict Type 5: ESL SOVEREIGN and IOD FEW RESULTS', () => {
    const input: any = {
      executiveSovereignty: { sovereigntyClassification: 'SOVEREIGN' },
      institutionalOutcomes: { conversionMetrics: { totalOutcomes: 1 } }
    };
    const conflicts = GovernanceCopilotConflictEngine.detectConflicts(input);
    assert.strictEqual(conflicts.length, 1);
    assert.strictEqual(conflicts[0].layersInvolved.join(','), 'ESL,IOD');
    assert.strictEqual(conflicts[0].severity, 'CRITICAL');
  });
});
