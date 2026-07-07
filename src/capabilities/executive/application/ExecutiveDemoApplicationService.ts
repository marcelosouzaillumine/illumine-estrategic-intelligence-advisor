import { ExecutiveDemoScenarioRegistry, DemoScenario } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveDemoSession, DemoSessionState } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveStorySequenceResolver } from '../../../services/FiduciaryRuntimeAdapter';
import { InstitutionalDemoDatasetGuard } from '../../../services/FiduciaryRuntimeAdapter';
import { GuidedJourneyStep } from '../../../services/FiduciaryRuntimeAdapter';

export class ExecutiveDemoApplicationService {
  static createSession(sessionId: string): DemoSessionState {
    return ExecutiveDemoSession.createSession(sessionId, 'CFO', true);
  }

  static getScenario(scenarioId: string): DemoScenario | undefined {
    return ExecutiveDemoScenarioRegistry.getScenario(scenarioId);
  }

  static loadScenario(sessionId: string, scenarioId: string, runtimeSnapshotId: string) {
    ExecutiveDemoSession.loadScenario(sessionId, scenarioId, runtimeSnapshotId);
  }

  static getSession(sessionId: string): DemoSessionState {
    return ExecutiveDemoSession.getSession(sessionId);
  }

  static acknowledgeDisclosure(sessionId: string) {
    ExecutiveDemoSession.acknowledgeDisclosure(sessionId);
  }

  static assertSafeDemonstration(scenario: DemoScenario, session: DemoSessionState) {
    InstitutionalDemoDatasetGuard.assertSafeDemonstration(scenario, session);
  }

  static resolveSteps(session: DemoSessionState, scenario: DemoScenario): GuidedJourneyStep[] {
    return ExecutiveStorySequenceResolver.resolveSteps(session.actorScope, scenario);
  }
}
