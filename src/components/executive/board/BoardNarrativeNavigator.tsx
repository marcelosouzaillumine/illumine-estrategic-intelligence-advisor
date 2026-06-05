import React, { useState } from 'react';
import { BoardFlowStep, InstitutionalBoardFlow } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSessionContext } from '../../../services/FiduciaryRuntimeAdapter';

interface BoardNarrativeNavigatorProps {
  sessionId: string;
  hasEvidence: boolean;
  hasLineage: boolean;
  onStepChange: (step: BoardFlowStep) => void;
}

export const BoardNarrativeNavigator: React.FC<BoardNarrativeNavigatorProps> = ({
  sessionId,
  hasEvidence,
  hasLineage,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState<BoardFlowStep>('SUMMARY');
  const [error, setError] = useState<string | null>(null);

  const handleTransition = (nextStep: BoardFlowStep) => {
    try {
      InstitutionalBoardFlow.assertValidTransition(currentStep, nextStep, hasEvidence, hasLineage);
      ExecutiveSessionContext.appendAudit(sessionId, nextStep);
      setCurrentStep(nextStep);
      setError(null);
      onStepChange(nextStep);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const steps: BoardFlowStep[] = ['SUMMARY', 'STRUCTURAL_TENSIONS', 'ROOT_CAUSE', 'PROPAGATION', 'INSTITUTIONAL_RISKS', 'RECOMMENDATIONS', 'EVIDENCE_CHAIN', 'TIMELINE', 'DRILLDOWN'];

  return (
    <div className="w-full bg-slate-900/50 p-4 border-b border-slate-800">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map(step => (
          <button
            key={step}
            onClick={() => handleTransition(step)}
            className={`px-4 py-2 text-sm uppercase tracking-wider rounded whitespace-nowrap transition-colors
              ${currentStep === step ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
            `}
          >
            {step.replace('_', ' ')}
          </button>
        ))}
      </div>
      {error && (
        <div className="mt-2 text-red-400 text-sm font-mono bg-red-900/20 p-2 rounded border border-red-500/30">
          [GOVERNANCE_BLOCK] {error}
        </div>
      )}
    </div>
  );
};
