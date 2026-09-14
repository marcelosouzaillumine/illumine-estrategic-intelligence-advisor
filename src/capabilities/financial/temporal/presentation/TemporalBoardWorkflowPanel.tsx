import React from 'react';
import { TemporalWorkflowState } from '../../../../core/workflows/ExecutiveTemporalWorkflow';

interface TemporalBoardWorkflowPanelProps {
  currentState: TemporalWorkflowState;
  auditReference: string;
  lineageHash: string;
  onAcknowledge?: () => void;
}

export const TemporalBoardWorkflowPanel: React.FC<TemporalBoardWorkflowPanelProps> = ({ 
  currentState, 
  auditReference, 
  lineageHash, 
  onAcknowledge 
}) => {
  if (!currentState || !auditReference || !lineageHash) {
    return null; // Dummy Renderer - Fail-closed
  }

  return (
    <div className="temporal-board-workflow p-6 bg-slate-900 border border-border rounded-lg shadow-md text-muted-foreground">
      <div className="mb-4 border-b border-border pb-2">
        <h3 className="text-lg font-semibold text-muted-foreground">Board Workflow State</h3>
        <p className="text-xs text-muted-foreground mt-1">Official Escallation Control</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current Protocol:</div>
          <div className="text-sm font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded border border-orange-400/30 inline-block">
            {currentState.replace(/_/g, ' ')}
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs font-mono text-muted-foreground">Audit Ref: {auditReference}</div>
          <div className="text-xs font-mono text-muted-foreground">Lineage: {lineageHash.substring(0, 8)}</div>
        </div>
      </div>

      {onAcknowledge && (
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
          <button 
            onClick={onAcknowledge}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Acknowledge & Sign-off
          </button>
        </div>
      )}
    </div>
  );
};
