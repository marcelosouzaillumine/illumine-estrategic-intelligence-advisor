import { ExecutionGovernanceAdapter, ExecutionCommitment } from '../../../services/ExecutionGovernanceAdapter';

export class ExecutionTrackingApplicationService {
  public static validateExecutionImpact(commitment: ExecutionCommitment) {
    return ExecutionGovernanceAdapter.validateExecutionImpact(commitment);
  }
}
