import React from 'react';
import { BoardFlowStep } from '../../../services/FiduciaryRuntimeAdapter';
import { useBoardNarrativeNavigatorViewModel } from '../../../capabilities/executive/presentation/view-models/useBoardNarrativeNavigatorViewModel';

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
  const { state, computed, actions } = useBoardNarrativeNavigatorViewModel();

  return (
    <div className="w-full bg-primary/50 p-4 border-b border-border">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {computed.steps.map(step => (
          <button
            key={step}
            onClick={() => actions.handleTransition(step, sessionId, hasEvidence, hasLineage, onStepChange)}
            className={`px-4 py-2 text-sm uppercase tracking-wider rounded whitespace-nowrap transition-colors
              ${state.currentStep === step ? 'bg-accent text-white font-bold' : 'bg-surface text-muted-foreground hover:bg-surface-low'}
            `}
          >
            {step.replace('_', ' ')}
          </button>
        ))}
      </div>
      {state.error && (
        <div className="mt-2 text-red-400 text-sm font-mono bg-red-900/20 p-2 rounded border border-red-500/30">
          [GOVERNANCE_BLOCK] {state.error}
        </div>
      )}
    </div>
  );
};

