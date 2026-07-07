import { useState, useMemo } from 'react';
import { ExecutionCommitment } from '../../../../services/ExecutionGovernanceAdapter';
import { ExecutionTrackingApplicationService } from '../../application/ExecutionTrackingApplicationService';

export interface ExecutionTrackingDashboardState {
  selectedCommitment: string | null;
}

export interface ExecutionTrackingDashboardComputed {
  pending: ExecutionCommitment[];
  completed: ExecutionCommitment[];
}

export interface ExecutionTrackingDashboardActions {
  setSelectedCommitment: (id: string | null) => void;
  validateExecutionImpact: (commitment: ExecutionCommitment) => ReturnType<typeof ExecutionTrackingApplicationService.validateExecutionImpact>;
}

export interface ExecutionTrackingDashboardViewModel {
  state: ExecutionTrackingDashboardState;
  computed: ExecutionTrackingDashboardComputed;
  actions: ExecutionTrackingDashboardActions;
}

export function useExecutionTrackingDashboardViewModel(
  commitments: ExecutionCommitment[]
): ExecutionTrackingDashboardViewModel {
  const [selectedCommitment, setSelectedCommitment] = useState<string | null>(null);

  const pending = useMemo(() => 
    commitments.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS'),
    [commitments]
  );

  const completed = useMemo(() => 
    commitments.filter(c => c.status === 'EXECUTED' || c.status === 'DEVIATED'),
    [commitments]
  );

  return {
    state: {
      selectedCommitment
    },
    computed: {
      pending,
      completed
    },
    actions: {
      setSelectedCommitment,
      validateExecutionImpact: ExecutionTrackingApplicationService.validateExecutionImpact
    }
  };
}
