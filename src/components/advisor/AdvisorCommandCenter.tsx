import React from 'react';
import { AdvisorWorkspaceShell } from './AdvisorWorkspaceShell';
import { useAdvisorCommandCenterViewModel } from '../../capabilities/executive/presentation/view-models/useAdvisorCommandCenterViewModel';

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
