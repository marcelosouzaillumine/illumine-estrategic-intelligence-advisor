import React from 'react';
import { GuidedJourneyStep, GuidedBoardJourneyEngine } from '../../../services/FiduciaryRuntimeAdapter';

interface GuidedBoardJourneyNavigatorProps {
  currentStep: GuidedJourneyStep;
  allowedSteps: GuidedJourneyStep[];
  hasEvidence: boolean;
  hasLineage: boolean;
  hasRuntimeMemory: boolean;
  onStepChange: (step: GuidedJourneyStep) => void;
}

export const GuidedBoardJourneyNavigator: React.FC<GuidedBoardJourneyNavigatorProps> = ({
  currentStep,
  allowedSteps,
  hasEvidence,
  hasLineage,
  hasRuntimeMemory,
  onStepChange
}) => {
  const handleStepClick = (target: GuidedJourneyStep) => {
    try {
      // Enforce navigation flow guard
      GuidedBoardJourneyEngine.assertValidTransition(
        currentStep,
        target,
        hasEvidence,
        hasLineage,
        hasRuntimeMemory
      );
      onStepChange(target);
    } catch (err: any) {
      console.error(`Navigation Violation: ${err.message}`);
    }
  };

  return (
    <div className="w-full bg-slate-900 border-y border-slate-800 py-3 px-6 flex items-center justify-start gap-2 overflow-x-auto">
      {allowedSteps.map((step) => {
        const isActive = step === currentStep;
        return (
          <button
            key={step}
            onClick={() => handleStepClick(step)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-200 border whitespace-nowrap ${
              isActive
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {step.replace('_', ' ')}
          </button>
        );
      })}
    </div>
  );
};
