import { calculateExecutionSlippage, updateExecutionCommitment } from '../core/runtime/execution-governance/ExecutionTrackingEngine';
import { validateExecutionImpact } from '../core/runtime/execution-governance/ImpactValidationEngine';
import { generateBoardFollowupAgenda } from '../core/runtime/execution-governance/BoardFollowupEngine';
import { ExecutionCommitment, ExecutionStatus, SlippageSeverity, ExecutionSlippage } from '../core/runtime/execution-governance/ExecutionGovernanceTypes';

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
