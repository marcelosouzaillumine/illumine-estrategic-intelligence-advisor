import { useState } from 'react';
import { BoardFlowStep } from '../../../../services/FiduciaryRuntimeAdapter';
import { BoardNarrativeApplicationService } from '../../application/BoardNarrativeApplicationService';

export interface BoardNarrativeNavigatorState {
  currentStep: BoardFlowStep;
  error: string | null;
}

export interface BoardNarrativeNavigatorActions {
  handleTransition: (
    nextStep: BoardFlowStep,
    sessionId: string,
    hasEvidence: boolean,
    hasLineage: boolean,
    onStepChange: (step: BoardFlowStep) => void
  ) => void;
}

export interface BoardNarrativeNavigatorViewModel {
  state: BoardNarrativeNavigatorState;
  computed: {
    steps: BoardFlowStep[];
  };
  actions: BoardNarrativeNavigatorActions;
}

export function useBoardNarrativeNavigatorViewModel(): BoardNarrativeNavigatorViewModel {
  const [currentStep, setCurrentStep] = useState<BoardFlowStep>('SUMMARY');
  const [error, setError] = useState<string | null>(null);

  const handleTransition = (
    nextStep: BoardFlowStep,
    sessionId: string,
    hasEvidence: boolean,
    hasLineage: boolean,
    onStepChange: (step: BoardFlowStep) => void
  ) => {
    try {
      BoardNarrativeApplicationService.assertValidTransition(currentStep, nextStep, hasEvidence, hasLineage);
      BoardNarrativeApplicationService.appendAudit(sessionId, nextStep);
      setCurrentStep(nextStep);
      setError(null);
      onStepChange(nextStep);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const steps: BoardFlowStep[] = ['SUMMARY', 'STRUCTURAL_TENSIONS', 'ROOT_CAUSE', 'PROPAGATION', 'INSTITUTIONAL_RISKS', 'RECOMMENDATIONS', 'EVIDENCE_CHAIN', 'TIMELINE', 'DRILLDOWN'];

  return {
    state: {
      currentStep,
      error
    },
    computed: {
      steps
    },
    actions: {
      handleTransition
    }
  };
}
