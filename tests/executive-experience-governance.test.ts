import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RuntimeBackedStorytelling } from '../src/workspace/runtime/executive/RuntimeBackedStorytelling';
import { ExecutiveNarrativePolicy } from '../src/workspace/runtime/executive/ExecutiveNarrativePolicy';
import { ConfidenceDisclosurePolicy } from '../src/workspace/runtime/executive/ConfidenceDisclosurePolicy';
import { ViolationVisibilityPolicy } from '../src/workspace/runtime/executive/ViolationVisibilityPolicy';
import { AdvisoryCompressionEngine } from '../src/workspace/runtime/executive/AdvisoryCompressionEngine';
import { InstitutionalPresentationGuard } from '../src/workspace/runtime/executive/InstitutionalPresentationGuard';
import { ExecutiveNarrativeData, ExecutiveViolation } from '../src/workspace/runtime/executive/types';

describe('RC-1.1B: Executive Experience Governance Model', () => {

  const createBaseData = (): ExecutiveNarrativeData => RuntimeBackedStorytelling.createBaseNarrative(
    'tenant-1',
    'ConsolidatedRuntime-v2',
    ['Node-A', 'Node-B'],
    [{ evidenceId: 'EV-1', sourceNodes: ['Node-A'], metrics: { risk: 90 }, timestamp: new Date().toISOString() }],
    'HIGH',
    { executionId: 'EX-1', totalEntities: 3, criticalChains: 1, consolidationHash: 'hash-abc' },
    [{ violationId: 'V1', severity: 'WARNING', message: 'Liquidity drain', sourceContext: 'Sub-A' }],
    'Executive Summary',
    'Overall stable with minor risks.',
    ['Node-A', 'Node-B'],
    1
  );

  it('1. Narrative Immutability / Mutation blocking', () => {
    const data = createBaseData();
    const sealed = ExecutiveNarrativePolicy.sealNarrative(data);
    
    assert.ok(ExecutiveNarrativePolicy.verifyIntegrity(sealed));

    // Attempting mutation (bypassing TS with any)
    const mutated = { ...sealed, priority: 99 };
    assert.strictEqual(ExecutiveNarrativePolicy.verifyIntegrity(mutated as any), false);
  });

  it('2. Compression altering severity (Blocking)', () => {
    const data = createBaseData();
    const sealed = ExecutiveNarrativePolicy.sealNarrative(data);
    const compressed = AdvisoryCompressionEngine.compress(sealed);

    assert.ok(compressed.summary.includes('[COMPRESSED_STRUCTURALLY]'));
    assert.deepStrictEqual(sealed.violations, compressed.violations, 'Compression must preserve violations exactly');
    assert.strictEqual(sealed.confidence, compressed.confidence, 'Compression must preserve confidence');
  });

  it('3. Narrative sem EvidenceChain / Lineage / Confidence / SourceRuntime (Fail-Closed)', () => {
    assert.throws(() => {
      RuntimeBackedStorytelling.createBaseNarrative('t1', '', ['A'], [], 'HIGH' as any, {} as any, [], 'T', 'S', [], 1);
    }, /MISSING_RUNTIME/);

    assert.throws(() => {
      RuntimeBackedStorytelling.createBaseNarrative('t1', 'R1', [], [], 'HIGH' as any, {} as any, [], 'T', 'S', [], 1);
    }, /MISSING_LINEAGE/);
  });

  it('4. UI trying to hide violations / Downgrading visual warnings (Blocking)', () => {
    const data = createBaseData();
    data.violations.push({ violationId: 'V2', severity: 'CRITICAL', message: 'Breach', sourceContext: 'Sub-B' });
    const sealed = ExecutiveNarrativePolicy.sealNarrative(data);

    // Simulated UI rendering missing V2
    const renderedMissing: ExecutiveViolation[] = [ sealed.violations[0] ];
    assert.throws(() => ViolationVisibilityPolicy.assertVisibilityCompliance(sealed, renderedMissing), /VIOLATION_VISIBILITY_BREACH/);

    // Simulated UI downgrading CRITICAL to WARNING
    const renderedDowngrade: ExecutiveViolation[] = [ 
      sealed.violations[0],
      { ...sealed.violations[1], severity: 'WARNING' }
    ];
    assert.throws(() => ViolationVisibilityPolicy.assertVisibilityCompliance(sealed, renderedDowngrade), /VIOLATION_DOWNGRADE/);
  });

  it('5. Rendering without confidence or with UNVERIFIED (Institutional Presentation Guard)', () => {
    const data = createBaseData();
    data.confidence = 'UNVERIFIED';
    const sealed = ExecutiveNarrativePolicy.sealNarrative(data);

    assert.throws(() => InstitutionalPresentationGuard.validateForRendering(sealed), /RENDER_BLOCKED/);
  });

  it('6. Fake executive summary (Mutation check by Gatekeeper)', () => {
    const data = createBaseData();
    const sealed = ExecutiveNarrativePolicy.sealNarrative(data);
    
    const fake = { ...sealed, summary: "Fake summary injected by UI" };
    assert.throws(() => InstitutionalPresentationGuard.validateForRendering(fake as any), /PRESENTATION_BLOCKED: Narrative integrity validation failed/);
  });

  it('7. Reordered causality logic', () => {
    const data = createBaseData();
    const sealed = ExecutiveNarrativePolicy.sealNarrative(data);

    const reordered = { ...sealed, causalityOrder: ['Node-B', 'Node-A'] };
    assert.throws(() => InstitutionalPresentationGuard.validateForRendering(reordered as any), /PRESENTATION_BLOCKED/);
  });

});
