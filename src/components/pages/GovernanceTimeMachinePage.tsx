import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { GovernanceTimeMachineWorkspace } from '../workspaces/GovernanceTimeMachineWorkspace';
import { GovernanceTimeMachineViewModel } from '../../viewmodels/temporal/GovernanceTimeMachineViewModel';
import { GovernanceTimeMachineRuntime } from '../../core/temporal/GovernanceTimeMachineRuntime';
import { TimelineQueryEngine } from '../../core/temporal/TimelineQueryEngine';
import { FirestoreTimelineRepository } from '../../services/temporal/FirestoreTimelineRepository';
import { InstitutionalDriftEngine } from '../../core/temporal/InstitutionalDriftEngine';

export const GovernanceTimeMachinePage: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  
  // Setup the DI chain for the Time Machine
  const dependencies = useMemo(() => {
    const repository = new FirestoreTimelineRepository();
    const runtime = new GovernanceTimeMachineRuntime(repository);
    const queryEngine = new TimelineQueryEngine(repository);
    const driftEngine = new InstitutionalDriftEngine(repository);
    const viewModel = new GovernanceTimeMachineViewModel(runtime, queryEngine);
    
    return { repository, runtime, queryEngine, driftEngine, viewModel };
  }, []);

  const tenantId = 'SYSTEM_TENANT';
  // Use param node as timelineId, or fallback to a main tenant timeline
  const timelineId = nodeId || 'main-institutional-timeline';

  return (
    <div className="bg-slate-950 min-h-screen text-muted-foreground">
      <GovernanceTimeMachineWorkspace 
        viewModel={dependencies.viewModel}
        runtime={dependencies.runtime}
        driftEngine={dependencies.driftEngine}
        tenantId={tenantId}
        timelineId={timelineId}
      />
    </div>
  );
};
