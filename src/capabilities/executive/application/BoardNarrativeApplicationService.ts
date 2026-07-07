import { BoardFlowStep, InstitutionalBoardFlow, ExecutiveSessionContext } from '../../../services/FiduciaryRuntimeAdapter';

export class BoardNarrativeApplicationService {
  public static assertValidTransition(currentStep: BoardFlowStep, nextStep: BoardFlowStep, hasEvidence: boolean, hasLineage: boolean): void {
    InstitutionalBoardFlow.assertValidTransition(currentStep, nextStep, hasEvidence, hasLineage);
  }

  public static appendAudit(sessionId: string, step: BoardFlowStep): void {
    ExecutiveSessionContext.appendAudit(sessionId, step);
  }
}
