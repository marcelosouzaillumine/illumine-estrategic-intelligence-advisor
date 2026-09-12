import { calculateExecutionSlippage, updateExecutionCommitment } from '../capabilities/runtime/execution-governance/ExecutionTrackingEngine';
import { validateExecutionImpact } from '../capabilities/runtime/execution-governance/ImpactValidationEngine';
import { generateBoardFollowupAgenda } from '../capabilities/runtime/execution-governance/BoardFollowupEngine';
import { ExecutionCommitment, ExecutionStatus, SlippageSeverity, ExecutionSlippage } from '../capabilities/runtime/execution-governance/ExecutionGovernanceTypes';

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
