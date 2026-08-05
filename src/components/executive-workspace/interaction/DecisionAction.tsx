import React from 'react';
import { ExecutiveAction } from '../foundation/ExecutiveAction';
import { Check, X } from 'lucide-react';

interface DecisionActionProps {
  onApprove?: () => void;
  onReject?: () => void;
  approveLabel?: string;
  rejectLabel?: string;
}

export function DecisionAction({
  onApprove,
  onReject,
  approveLabel = 'Aprovar Decisão',
  rejectLabel = 'Rejeitar'
}: DecisionActionProps) {
  return (
    <div className="flex items-center gap-3 w-full mt-4 border-t border-border pt-4">
      <ExecutiveAction variant="primary" icon={Check} onClick={onApprove} className="flex-1">
        {approveLabel}
      </ExecutiveAction>
      <ExecutiveAction variant="ghost" icon={X} onClick={onReject} className="flex-1 text-muted-foreground hover:text-destructive">
        {rejectLabel}
      </ExecutiveAction>
    </div>
  );
}
