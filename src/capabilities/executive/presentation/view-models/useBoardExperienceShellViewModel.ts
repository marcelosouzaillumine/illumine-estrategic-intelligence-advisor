import { useState } from 'react';
import { ExecutiveNarrative } from '../../../../services/FiduciaryRuntimeAdapter';
import { BoardModeGuard } from '../../../../services/FiduciaryRuntimeAdapter';
import { BoardFlowStep } from '../../../../services/FiduciaryRuntimeAdapter';

export interface UseBoardExperienceShellViewModelProps {
  narrative: ExecutiveNarrative;
  sessionId: string;
}

export function useBoardExperienceShellViewModel({
  narrative,
  sessionId
}: UseBoardExperienceShellViewModelProps) {
  const [currentStep, setCurrentStep] = useState<BoardFlowStep>('SUMMARY');
  const [guardError, setGuardError] = useState<string | null>(null);

  // Fail-closed enforcement on render
  try {
    BoardModeGuard.assertSafeRendering(narrative, sessionId);
  } catch (err: any) {
    if (guardError !== err.message) {
      setGuardError(err.message);
    }
  }

  const hasEvidence = narrative.evidenceChain && narrative.evidenceChain.length > 0;
  const hasLineage = narrative.lineage && narrative.lineage.length > 0;

  return {
    state: {
      currentStep,
      guardError,
    },
    computed: {
      hasEvidence,
      hasLineage,
    },
    actions: {
      setCurrentStep,
    }
  };
}
