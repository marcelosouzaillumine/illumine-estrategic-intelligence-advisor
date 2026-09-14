// tests/governance-copilot-context-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotContextEngine } from '../src/lib/governance-copilot-context-engine';
import { runGovernanceCopilotAdapter } from '../src/capabilities/runtime/governance-copilot/governance-copilot-adapter';
import type { GovernanceCopilotContextInput } from '../src/lib/governance-copilot-types';

describe('GovernanceCopilotContextEngine', () => {
  it('must return empty context for undefined input', () => {
    const ctx = GovernanceCopilotContextEngine.buildContext(undefined as any);
    assert.deepStrictEqual(ctx.availableTopics, []);
    assert.deepStrictEqual(ctx.availableEvidence, []);
    assert.deepStrictEqual(ctx.institutionalStrengths, []);
  });

  it('must correctly aggregate Strengths, Risks, Dependencies, and Opportunities without modification', () => {
    const input: GovernanceCopilotContextInput = {
      executiveSovereignty: {
        sovereigntyStrengths: ['Strong cash position'],
        sovereigntyConstraints: ['Dependency on single supplier'],
        sovereigntyOpportunities: ['Market expansion'],
        sovereigntyRisks: ['Regulatory changes'],
        sovereigntyDependencies: ['Preserve capital over growth']
      } as any,
      governanceDigitalTwin: {
        executionCapacity: {
          classification: 'LOW'
        }
      } as any,
      institutionalOutcomes: {
        records: [
          {
            id: 'EVIDENCE-1',
            level: 'E3',
            description: 'Board decided to approve CAPEX'
          }
        ]
      }
    };

    const ctx = GovernanceCopilotContextEngine.buildContext(input);

    assert.deepStrictEqual(ctx.institutionalStrengths, ['Strong cash position']);
    assert.deepStrictEqual(ctx.institutionalConstraints, ['Dependency on single supplier', 'Digital Twin identifies restricted execution capacity']);
    assert.deepStrictEqual(ctx.institutionalDependencies, ['Preserve capital over growth']);
    assert.deepStrictEqual(ctx.institutionalRisks, ['Regulatory changes']);
    assert.deepStrictEqual(ctx.institutionalOpportunities, ['Market expansion']);
    
    assert.strictEqual(ctx.availableEvidence.length, 1);
    assert.strictEqual(ctx.availableEvidence[0].insightId, 'EVIDENCE-1');
  });

  it('must preserve deep non-interference (Deep Non-Interference Audit)', () => {
    const originalReport = {
      esgIntelligence: { overallScore: 85 } as any,
      institutionalOutcomes: { records: [{ id: 'REC-1', level: 'E4', description: 'Action executed' }] },
      executiveSovereignty: {
        sovereigntyStrengths: ['Liquidity']
      } as any
    };

    // Deep clone to ensure we detect mutations
    const originalClone = JSON.parse(JSON.stringify(originalReport));

    const finalReport = runGovernanceCopilotAdapter(originalReport);

    // 1. Ensure the copilot context was attached
    assert.ok(finalReport.governanceCopilotContext);
    assert.ok(finalReport.governanceCopilotContext.availableTopics.includes('ESG'));

    // 2. Deep Equality check to guarantee original fields weren't mutated
    assert.deepStrictEqual(finalReport.esgIntelligence, originalClone.esgIntelligence);
    assert.deepStrictEqual(finalReport.institutionalOutcomes, originalClone.institutionalOutcomes);
    assert.deepStrictEqual(finalReport.executiveSovereignty, originalClone.executiveSovereignty);

    // 3. Ensure no new generative properties were added to base layers
    assert.strictEqual((finalReport.esgIntelligence as any).generativeComment, undefined);
  });
});
