import { calculateExecutionSlippage, updateExecutionCommitment } from '../../../runtime/execution-governance/ExecutionTrackingEngine';
import { validateExecutionImpact } from '../../../runtime/execution-governance/ImpactValidationEngine';
import { generateBoardFollowupAgenda } from '../../../runtime/execution-governance/BoardFollowupEngine';
import { ExecutionCommitment, ExecutionStatus, SlippageSeverity, ExecutionSlippage } from '../../../runtime/execution-governance/ExecutionGovernanceTypes';

export const ExecutionGovernanceAdapter = {
  calculateExecutionSlippage,
  updateExecutionCommitment,
  validateExecutionImpact,
  generateBoardFollowupAgenda
};

export type {
  ExecutionCommitment,
  ExecutionStatus,
  SlippageSeverity,
  ExecutionSlippage
};
