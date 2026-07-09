import { DemoScenario, ExecutiveDemoScenarioRegistry } from './ExecutiveDemoScenarioRegistry';
import { DemoSessionState } from './ExecutiveDemoSession';

/**
 * @deprecated This guard is part of the legacy Demo suite.
 * Do not use in production runtime. Scheduled for removal in HCA-003.
 */
export class InstitutionalDemoDatasetGuard {
  public static assertSafeDemonstration(
    scenario: DemoScenario | null,
    session: DemoSessionState | null
  ): void {
    // Fail-closed checks
    if (!scenario) {
      throw new Error(`DEMO_GUARD_BLOCKED: Scenario metadata is missing.`);
    }

    if (!session) {
      throw new Error(`DEMO_GUARD_BLOCKED: Active Demo session is missing.`);
    }

    // 1. Check disclosure requirements
    if (session.disclosureState !== 'ACKNOWLEDGED') {
      throw new Error(`DEMO_GUARD_BLOCKED: Mandatory disclosure not acknowledged (current state: ${session.disclosureState}).`);
    }

    // 2. Validate essential lineage and confidence properties
    if (scenario.lineageIntegrityHash === undefined || scenario.lineageIntegrityHash === null || scenario.lineageIntegrityHash === '') {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing lineageIntegrityHash reference.`);
    }

    if (scenario.evidenceIntegrityHash === undefined || scenario.evidenceIntegrityHash === null || scenario.evidenceIntegrityHash === '') {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing evidenceIntegrityHash reference.`);
    }

    if (scenario.confidenceState === undefined || scenario.confidenceState === null) {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing confidence state.`);
    }

    if (scenario.runtimeSnapshotId === undefined || scenario.runtimeSnapshotId === null || scenario.runtimeSnapshotId === '') {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing runtimeSnapshotReference.`);
    }

    if (scenario.disclosureRequirements === undefined || scenario.disclosureRequirements === null) {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing disclosure requirements reference.`);
    }

    if (scenario.activeViolations === undefined || scenario.activeViolations === null) {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing activeViolations reference.`);
    }

    if (scenario.timelineEvents === undefined || scenario.timelineEvents === null) {
      throw new Error(`DEMO_GUARD_BLOCKED: Missing timelineEvents reference.`);
    }

    // 3. Prohibit UNVERIFIED confidence level
    if (scenario.confidenceState === 'UNVERIFIED') {
      throw new Error(`DEMO_GUARD_BLOCKED: Rendering of UNVERIFIED confidence is strictly prohibited.`);
    }

    // 4. Verify evidence integrity state
    if (session.evidenceIntegrityState === 'INVALID') {
      throw new Error(`DEMO_GUARD_BLOCKED: Evidence integrity corruption detected.`);
    }

    // 5. Ensure violations are present if designated
    if (scenario.scenarioId === 'SYSTEMIC_CONTAGION' && scenario.activeViolations.length === 0) {
      throw new Error(`DEMO_GUARD_BLOCKED: Critical violations missing in systemic risk scenario.`);
    }

    // 6. Verify with ExecutiveDemoScenarioRegistry
    const registered = ExecutiveDemoScenarioRegistry.getScenario(scenario.scenarioId);
    if (!registered) {
      throw new Error(`DEMO_GUARD_BLOCKED: Scenario ${scenario.scenarioId} is not homologated by ExecutiveDemoScenarioRegistry.`);
    }

    // Ensure client did not modify or hide anything
    if (registered.lineageIntegrityHash !== scenario.lineageIntegrityHash) {
      throw new Error(`DEMO_GUARD_BLOCKED: Lineage integrity hash mismatch.`);
    }

    if (registered.evidenceIntegrityHash !== scenario.evidenceIntegrityHash) {
      throw new Error(`DEMO_GUARD_BLOCKED: Evidence integrity hash mismatch.`);
    }

    if (registered.runtimeSnapshotId !== scenario.runtimeSnapshotId) {
      throw new Error(`DEMO_GUARD_BLOCKED: Runtime snapshot reference mismatch.`);
    }

    if (registered.confidenceState !== scenario.confidenceState) {
      throw new Error(`DEMO_GUARD_BLOCKED: Confidence state mismatch.`);
    }

    // Verify disclosure requirements
    if (registered.disclosureRequirements.length !== scenario.disclosureRequirements.length) {
      throw new Error(`DEMO_GUARD_BLOCKED: Disclosure requirements count mismatch.`);
    }
    for (const req of registered.disclosureRequirements) {
      if (!scenario.disclosureRequirements.includes(req)) {
        throw new Error(`DEMO_GUARD_BLOCKED: Disclosure requirement ${req} was removed or hidden.`);
      }
    }

    // Verify active violations
    if (scenario.activeViolations.length < registered.activeViolations.length) {
      throw new Error(`DEMO_GUARD_BLOCKED: Attempt to hide active violations detected.`);
    }
    if (registered.activeViolations.length !== scenario.activeViolations.length) {
      throw new Error(`DEMO_GUARD_BLOCKED: Violation count mismatch.`);
    }
    for (const v of registered.activeViolations) {
      const match = scenario.activeViolations.find(sv => sv.violationId === v.violationId);
      if (!match) {
        throw new Error(`DEMO_GUARD_BLOCKED: Violation ${v.violationId} was hidden or removed.`);
      }
      if (match.severity !== v.severity || match.message !== v.message || match.sourceContext !== v.sourceContext) {
        throw new Error(`DEMO_GUARD_BLOCKED: Violation ${v.violationId} was modified.`);
      }
    }
  }
}
