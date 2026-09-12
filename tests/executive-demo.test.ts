import { describe, it } from 'node:test';
import assert from 'node:assert';

import { ExecutiveDemoScenarioRegistry, DemoScenario } from '../src/workspace/runtime/executive/demo/ExecutiveDemoScenarioRegistry';
import { ExecutiveDemoSession, DemoSessionState } from '../src/workspace/runtime/executive/demo/ExecutiveDemoSession';
import { GuidedBoardJourneyEngine } from '../src/workspace/runtime/executive/demo/GuidedBoardJourneyEngine';
import { ExecutiveStorySequenceResolver } from '../src/workspace/runtime/executive/demo/ExecutiveStorySequenceResolver';
import { InstitutionalDemoDatasetGuard } from '../src/workspace/runtime/executive/demo/InstitutionalDemoDatasetGuard';

describe('RC-1.1B: Executive Demonstrability Layer', () => {

  it('1. Registry loads valid, frozen scenarios', () => {
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND');
    assert.ok(sc);
    assert.strictEqual(sc?.scenarioId, 'TURNAROUND');
    assert.throws(() => {
      (sc as any).title = 'Hacked Scenario Title';
    });
  });

  it('2. Block demo start if disclosure is PENDING', () => {
    const sessionId = 'test-sess-pending';
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND');
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    
    assert.strictEqual(session.disclosureState, 'PENDING');
    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(sc, session),
      /Mandatory disclosure not acknowledged/
    );
  });

  it('3. Block demo start if disclosure is BLOCKED', () => {
    const sessionId = 'test-sess-blocked';
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND');
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.setBlocked(sessionId);

    assert.strictEqual(session.disclosureState, 'BLOCKED');
    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(sc, session),
      /Mandatory disclosure not acknowledged/
    );
  });

  it('4. Allows access if disclosure is ACKNOWLEDGED', () => {
    const sessionId = 'test-sess-ack';
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND');
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    assert.doesNotThrow(() => InstitutionalDemoDatasetGuard.assertSafeDemonstration(sc, session));
  });

  it('5. Blocks corrupt scenarios (missing integrity hashes)', () => {
    const sessionId = 'test-sess-corrupt';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const corruptScenario: DemoScenario = {
      scenarioId: 'FAKE_SCENARIO',
      scenarioVersion: '1.0.0',
      title: 'Corrupted Demo',
      description: 'Missing lineage details',
      tenantScope: 'demo-hacked',
      topologyProfile: 'SINGLE_ENTITY',
      narrativeMode: 'Turnaround',
      runtimeSnapshotId: 'snap-fake-01',
      lineageIntegrityHash: '', // EMPTY
      evidenceIntegrityHash: 'ev-123',
      disclosureRequirements: [] as string[],
      activeViolations: [] as any[],
      confidenceState: 'HIGH',
      timelineEvents: [] as any[],
      recommendations: [] as string[]
    };

    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(corruptScenario, session),
      /Missing lineageIntegrityHash reference/
    );
  });

  it('6. GuidedBoardJourneyEngine restricts step jumps (summary -> root cause directly)', () => {
    assert.throws(
      () => GuidedBoardJourneyEngine.assertValidTransition('SUMMARY', 'ROOT_CAUSE', true, true, true),
      /Direct jumps are forbidden/
    );
  });

  it('7. GuidedBoardJourneyEngine blocks skip Root Cause', () => {
    assert.throws(
      () => GuidedBoardJourneyEngine.assertValidTransition('STRUCTURAL_TENSIONS', 'PROPAGATION', true, true, true),
      /Cannot skip Root Cause analysis/
    );
  });

  it('8. GuidedBoardJourneyEngine blocks Recommendations without Evidence', () => {
    assert.throws(
      () => GuidedBoardJourneyEngine.assertValidTransition('INSTITUTIONAL_RISKS', 'RECOMMENDATIONS', false, true, true),
      /Cannot view recommendations without a valid Evidence Chain/
    );
  });

  it('9. GuidedBoardJourneyEngine blocks Timeline without Runtime Memory', () => {
    assert.throws(
      () => GuidedBoardJourneyEngine.assertValidTransition('EVIDENCE_CHAIN', 'TIMELINE', true, true, false),
      /Cannot render timeline without Runtime Memory backing/
    );
  });

  it('10. GuidedBoardJourneyEngine blocks Propagation without Lineage', () => {
    assert.throws(
      () => GuidedBoardJourneyEngine.assertValidTransition('ROOT_CAUSE', 'PROPAGATION', true, false, true),
      /Cannot inspect propagation without active Lineage validation/
    );
  });

  it('11. Story sequence resolver generates deterministic steps based on roles', () => {
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;
    const cfoSteps = ExecutiveStorySequenceResolver.resolveSteps('CFO', sc);
    const boardSteps = ExecutiveStorySequenceResolver.resolveSteps('CONSELHO', sc);

    assert.ok(cfoSteps.includes('EVIDENCE_CHAIN'));
    assert.ok(!boardSteps.includes('EVIDENCE_CHAIN'));
  });

  it('12. Prohibits sequence resolution for UNVERIFIED scenarios', () => {
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;
    const unverifiedScenario = { ...sc, confidenceState: 'UNVERIFIED' as const };

    assert.throws(
      () => ExecutiveStorySequenceResolver.resolveSteps('CFO', unverifiedScenario),
      /Cannot resolve sequence for UNVERIFIED/
    );
  });

  it('13. Failure Vector: Cenário fake', () => {
    const sessionId = 'test-fake-scenario';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const fakeScenario = {
      scenarioId: 'FABRICATED_ID',
      scenarioVersion: '1.0.0',
      title: 'Fabricated Scenario',
      description: 'Not in registry',
      tenantScope: 'demo-tenant-turnaround',
      topologyProfile: 'SINGLE_ENTITY',
      narrativeMode: 'Turnaround',
      runtimeSnapshotId: 'snap-turnaround-01',
      lineageIntegrityHash: 'lin-hash-turnaround-999',
      evidenceIntegrityHash: 'ev-hash-turnaround-999',
      disclosureRequirements: ['fiduciary-terms'],
      activeViolations: [],
      confidenceState: 'HIGH' as const,
      timelineEvents: [],
      recommendations: []
    };

    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(fakeScenario, session),
      /is not homologated by ExecutiveDemoScenarioRegistry/
    );
  });

  it('14. Failure Vector: Cenário corrompido (missing properties)', () => {
    const sessionId = 'test-corrupt-properties';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;

    // Missing activeViolations
    const corrupt1 = { ...sc, activeViolations: undefined as any };
    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(corrupt1, session),
      /Missing activeViolations reference/
    );

    // Missing disclosureRequirements
    const corrupt2 = { ...sc, disclosureRequirements: undefined as any };
    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(corrupt2, session),
      /Missing disclosure requirements reference/
    );
  });

  it('15. Failure Vector: Disclosure oculto', () => {
    const sessionId = 'test-hidden-disclosure';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;

    // Session starts with PENDING disclosure
    assert.strictEqual(session.disclosureState, 'PENDING');
    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(sc, session),
      /Mandatory disclosure not acknowledged/
    );
  });

  it('16. Failure Vector: Tentativa de free navigation', () => {
    // Assert navigation sequence violations are thrown
    assert.throws(
      () => GuidedBoardJourneyEngine.assertValidTransition('SUMMARY', 'RECOMMENDATIONS', true, true, true),
      /Direct jumps are forbidden/
    );
  });

  it('17. Failure Vector: Timeline reconstruída localmente', () => {
    const sessionId = 'test-local-timeline';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;
    const missingTimeline = { ...sc, timelineEvents: undefined as any };

    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(missingTimeline, session),
      /Missing timelineEvents reference/
    );
  });

  it('18. Failure Vector: Summary sem lineage', () => {
    const sessionId = 'test-summary-no-lineage';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;
    const missingLineage = { ...sc, lineageIntegrityHash: '' };

    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(missingLineage, session),
      /Missing lineageIntegrityHash reference/
    );
  });

  it('19. Failure Vector: Tentativa de ocultar violations', () => {
    const sessionId = 'test-hide-violations';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const sc = ExecutiveDemoScenarioRegistry.getScenario('TURNAROUND')!;
    // Emptied violations list to try and hide the warning
    const hiddenViolations = { ...sc, activeViolations: [] };

    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(hiddenViolations, session),
      /Attempt to hide active violations detected/
    );
  });

  it('20. Failure Vector: Cenário não homologado', () => {
    const sessionId = 'test-non-homologated';
    const session = ExecutiveDemoSession.createSession(sessionId, 'CFO');
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);

    const nonHomologatedScenario: DemoScenario = {
      scenarioId: 'UNREGISTERED_SCENARIO',
      scenarioVersion: '1.0.0',
      title: 'Strategic Expansion Spec',
      description: 'An unverified roadmap spec.',
      tenantScope: 'demo-tenant-turnaround',
      topologyProfile: 'SINGLE_ENTITY',
      narrativeMode: 'Expansion',
      runtimeSnapshotId: 'snap-turnaround-01',
      lineageIntegrityHash: 'lin-hash-turnaround-999',
      evidenceIntegrityHash: 'ev-hash-turnaround-999',
      disclosureRequirements: ['fiduciary-terms'],
      activeViolations: [],
      confidenceState: 'HIGH',
      timelineEvents: [],
      recommendations: []
    };

    assert.throws(
      () => InstitutionalDemoDatasetGuard.assertSafeDemonstration(nonHomologatedScenario, session),
      /is not homologated by ExecutiveDemoScenarioRegistry/
    );
  });

});
