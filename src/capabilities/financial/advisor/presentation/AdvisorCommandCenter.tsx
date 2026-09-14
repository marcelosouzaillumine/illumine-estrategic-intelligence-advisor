import React from 'react';
import { AdvisorWorkspaceShell } from '../../../../components/advisor/AdvisorWorkspaceShell';
import { useAdvisorCommandCenterViewModel } from '../../../executive/presentation/view-models/useAdvisorCommandCenterViewModel';

export const AdvisorCommandCenter: React.FC = () => {
  const { state } = useAdvisorCommandCenterViewModel();
  const { runtime, contextEngine, advisorId, tenantId } = state;

  return (
    <div className="bg-slate-950 min-h-screen text-muted-foreground">
      <AdvisorWorkspaceShell 
        runtime={runtime}
        contextEngine={contextEngine}
        advisorId={advisorId}
        tenantId={tenantId}
      />
    </div>
  );
};
