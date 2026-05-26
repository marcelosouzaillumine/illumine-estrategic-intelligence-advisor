import { describe, it } from 'node:test';
import assert from 'node:assert';

import { BoardModeGuard } from '../src/core/runtime/executive/board/BoardModeGuard';
import { InstitutionalBoardFlow } from '../src/core/runtime/executive/board/InstitutionalBoardFlow';
import { ExecutiveSessionContext } from '../src/core/runtime/executive/board/ExecutiveSessionContext';
import { ExecutiveNarrativePolicy } from '../src/core/runtime/executive/ExecutiveNarrativePolicy';
import { RuntimeBackedStorytelling } from '../src/core/runtime/executive/RuntimeBackedStorytelling';
import { ExecutiveNarrativeData } from '../src/core/runtime/executive/types';

// ─── Fixtures ──────────────────────────────────────────────────────────────

const buildValidNarrativeData = (): ExecutiveNarrativeData =>
  RuntimeBackedStorytelling.createBaseNarrative(
    'tenant-board-1',
    'ConsolidatedRuntime-v2',
    ['Node-A', 'Node-B', 'Node-C'],
    [
      {
        evidenceId: 'EV-1',
        sourceNodes: ['Node-A'],
        metrics: { liquidity: 85 },
        timestamp: new Date().toISOString(),
      },
    ],
    'HIGH',
    { executionId: 'EX-BOARD-1', totalEntities: 5, criticalChains: 2, consolidationHash: 'chash-board' },
    [{ violationId: 'V-BOARD-1', severity: 'WARNING', message: 'Margin compression detected', sourceContext: 'BU-Alpha' }],
    'Board Q2 Institutional Review',
    'Structural analysis indicates stable cash position with isolated margin risk.',
    ['Node-A', 'Node-B', 'Node-C'],
    1
  );

const buildSealedNarrative = () => {
  const data = buildValidNarrativeData();
  return ExecutiveNarrativePolicy.sealNarrative(data);
};

// ─── Suite ─────────────────────────────────────────────────────────────────

describe('RC-Board-Experience: BoardModeGuard — Fail-Closed', () => {

  it('1. Blocks render when session does not exist', () => {
    const narrative = buildSealedNarrative();
    assert.throws(
      () => BoardModeGuard.assertSafeRendering(narrative, 'NON-EXISTENT-SESSION'),
      /SESSION_NOT_FOUND/
    );
  });

  it('2. Blocks render when disclosure not acknowledged', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-board-1', 'CFO', 'BOARD');
    const narrative = buildSealedNarrative();
    // Disclosure stays PENDING — not acknowledged
    assert.throws(
      () => BoardModeGuard.assertSafeRendering(narrative, sessionId),
      /BOARD_GUARD_BLOCKED: Mandatory disclosure not acknowledged/
    );
  });

  it('3. Passes render when all conditions satisfied', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-board-1', 'CFO', 'BOARD');
    ExecutiveSessionContext.acknowledgeDisclosure(sessionId);
    const narrative = buildSealedNarrative();
    // Should NOT throw
    assert.doesNotThrow(() => BoardModeGuard.assertSafeRendering(narrative, sessionId));
  });

  it('4. Blocks render when narrative hash was mutated', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-board-1', 'CFO', 'BOARD');
    ExecutiveSessionContext.acknowledgeDisclosure(sessionId);
    const narrative = buildSealedNarrative();
    // Simulate mutation: create a new object to bypass Object.freeze on sealed
    const mutated = { ...narrative, title: 'Injected title by UI layer' };
    assert.throws(
      () => BoardModeGuard.assertSafeRendering(mutated as any, sessionId),
      /BOARD_GUARD_BLOCKED: Narrative Hash verification failed/
    );
  });

  it('5. Blocks render when confidence is UNVERIFIED', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-board-1', 'CFO', 'BOARD');
    ExecutiveSessionContext.acknowledgeDisclosure(sessionId);
    const data = buildValidNarrativeData();
    data.confidence = 'UNVERIFIED';
    const narrative = ExecutiveNarrativePolicy.sealNarrative(data);
    assert.throws(
      () => BoardModeGuard.assertSafeRendering(narrative, sessionId),
      /BOARD_GUARD_BLOCKED: Cannot render UNVERIFIED confidence/
    );
  });

  it('6. Blocks render when narrative is missing (null)', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-board-1', 'CFO', 'BOARD');
    ExecutiveSessionContext.acknowledgeDisclosure(sessionId);
    assert.throws(
      () => BoardModeGuard.assertSafeRendering(null as any, sessionId),
      /BOARD_GUARD_BLOCKED: Narrative missing/
    );
  });

});

// ─── Navigation Flow Guard ──────────────────────────────────────────────────

describe('RC-Board-Experience: InstitutionalBoardFlow — Causal Navigation Constraints', () => {

  it('7. Allows valid transition: SUMMARY -> STRUCTURAL_TENSIONS', () => {
    assert.doesNotThrow(() =>
      InstitutionalBoardFlow.assertValidTransition('SUMMARY', 'STRUCTURAL_TENSIONS', true, true)
    );
  });

  it('8. Blocks Summary -> Recommendations (skips Root Cause)', () => {
    // SUMMARY does not list RECOMMENDATIONS in its allowed transitions
    assert.throws(
      () => InstitutionalBoardFlow.assertValidTransition('SUMMARY', 'RECOMMENDATIONS', true, true),
      /FLOW_VIOLATION/
    );
  });

  it('9. Blocks Tensions -> Root Cause when Evidence is absent', () => {
    assert.throws(
      () => InstitutionalBoardFlow.assertValidTransition('STRUCTURAL_TENSIONS', 'ROOT_CAUSE', false, true),
      /FLOW_VIOLATION: Cannot navigate to causality without Evidence Chain/
    );
  });

  it('10. Blocks Propagation without Lineage', () => {
    assert.throws(
      () => InstitutionalBoardFlow.assertValidTransition('ROOT_CAUSE', 'PROPAGATION', true, false),
      /FLOW_VIOLATION: Cannot navigate to propagation or drilldown without Lineage/
    );
  });

  it('11. Blocks non-adjacent transition: SUMMARY -> DRILLDOWN', () => {
    assert.throws(
      () => InstitutionalBoardFlow.assertValidTransition('SUMMARY', 'DRILLDOWN', true, true),
      /FLOW_VIOLATION/
    );
  });

  it('12. Allows STRUCTURAL_TENSIONS -> EVIDENCE_CHAIN (evidence-first path)', () => {
    assert.doesNotThrow(() =>
      InstitutionalBoardFlow.assertValidTransition('STRUCTURAL_TENSIONS', 'EVIDENCE_CHAIN', true, true)
    );
  });

});

// ─── Session Context ────────────────────────────────────────────────────────

describe('RC-Board-Experience: ExecutiveSessionContext — Session Lifecycle', () => {

  it('13. Creates session with PENDING disclosure state', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-ctx-1', 'CEO', 'C_LEVEL');
    const session = ExecutiveSessionContext.getSession(sessionId);
    assert.strictEqual(session.disclosureState, 'PENDING');
    assert.strictEqual(session.presentationMode, 'C_LEVEL');
    assert.strictEqual(session.tenantScope, 'tenant-ctx-1');
  });

  it('14. Acknowledges disclosure transitions state to ACKNOWLEDGED', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-ctx-1', 'CEO', 'BOARD');
    ExecutiveSessionContext.acknowledgeDisclosure(sessionId);
    const session = ExecutiveSessionContext.getSession(sessionId);
    assert.strictEqual(session.disclosureState, 'ACKNOWLEDGED');
  });

  it('15. Throws for non-existent session ID', () => {
    assert.throws(
      () => ExecutiveSessionContext.getSession('FAKE-SESSION-XYZ'),
      /SESSION_NOT_FOUND/
    );
  });

  it('16. Appends navigation audit entries correctly', () => {
    const sessionId = ExecutiveSessionContext.createSession('tenant-ctx-2', 'BOARD_MEMBER', 'BOARD');
    ExecutiveSessionContext.appendAudit(sessionId, 'SUMMARY', 'EV-AUDIT-1');
    ExecutiveSessionContext.appendAudit(sessionId, 'STRUCTURAL_TENSIONS');
    const session = ExecutiveSessionContext.getSession(sessionId);
    assert.strictEqual(session.navigationAudit.length, 2);
    assert.strictEqual(session.navigationAudit[0].step, 'SUMMARY');
    assert.strictEqual(session.navigationAudit[0].evidenceReference, 'EV-AUDIT-1');
    assert.strictEqual(session.navigationAudit[1].step, 'STRUCTURAL_TENSIONS');
    assert.strictEqual(session.navigationAudit[1].evidenceReference, undefined);
  });

});
