import { ExecutionCommitment, ExecutionSlippage, SlippageSeverity } from './ExecutionGovernanceTypes';

export function calculateExecutionSlippage(commitment: ExecutionCommitment, currentDate: Date = new Date()): ExecutionSlippage {
  // 1. Time Slippage
  let timeSlippageDays = 0;
  let timeSeverity: SlippageSeverity = 'NONE';
  
  const targetDate = commitment.expectedCompletionDate;
  const actualDate = commitment.actualCompletionDate;

  if (actualDate) {
    // Has completed
    timeSlippageDays = Math.max(0, (actualDate.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));
  } else if (currentDate > targetDate) {
    // Overdue and not completed
    timeSlippageDays = Math.max(0, (currentDate.getTime() - targetDate.getTime()) / (1000 * 3600 * 24));
  }

  if (timeSlippageDays > 90) timeSeverity = 'CRITICAL';
  else if (timeSlippageDays > 30) timeSeverity = 'MODERATE';
  else if (timeSlippageDays > 0) timeSeverity = 'LOW';

  // 2. Scope Deviation (e.g., using Capex as a proxy for scope size if available)
  let scopeDeviationPercent = 0;
  let scopeSeverity: SlippageSeverity = 'NONE';
  
  if (commitment.actualCapex !== undefined && commitment.expectedCapex > 0) {
    // If they spent less or more, we measure deviation
    scopeDeviationPercent = ((commitment.actualCapex - commitment.expectedCapex) / commitment.expectedCapex) * 100;
    const absScopeDev = Math.abs(scopeDeviationPercent);
    
    if (absScopeDev > 50) scopeSeverity = 'CRITICAL';
    else if (absScopeDev > 20) scopeSeverity = 'MODERATE';
    else if (absScopeDev > 5) scopeSeverity = 'LOW';
  }

  // 3. Impact Deviation
  let impactDeviationPercent = 0;
  let impactSeverity: SlippageSeverity = 'NONE';

  if (commitment.actualRevenueImpact !== undefined && commitment.expectedRevenueImpact > 0) {
    impactDeviationPercent = ((commitment.actualRevenueImpact - commitment.expectedRevenueImpact) / commitment.expectedRevenueImpact) * 100;
    
    if (impactDeviationPercent < -50) impactSeverity = 'CRITICAL';
    else if (impactDeviationPercent < -20) impactSeverity = 'MODERATE';
    else if (impactDeviationPercent < 0) impactSeverity = 'LOW';
  }

  // Calculate Overall Slippage Score (0 to 100)
  const severityWeights = { 'NONE': 0, 'LOW': 1, 'MODERATE': 2, 'CRITICAL': 3 };
  
  const totalSeverity = 
    severityWeights[timeSeverity] + 
    severityWeights[scopeSeverity] + 
    severityWeights[impactSeverity];

  // Max severity sum is 9. Map 0-9 to 0-100.
  let overallSlippageScore = Math.min(100, Math.round((totalSeverity / 9) * 100));

  return {
    timeSlippageDays,
    timeSeverity,
    scopeDeviationPercent,
    scopeSeverity,
    impactDeviationPercent,
    impactSeverity,
    overallSlippageScore
  };
}

export function updateExecutionCommitment(commitment: ExecutionCommitment, updateData: Partial<ExecutionCommitment>): ExecutionCommitment {
  const updated = { ...commitment, ...updateData, lastUpdated: new Date() };
  
  // Re-calculate slippage based on updated data
  updated.slippage = calculateExecutionSlippage(updated, updated.lastUpdated);

  return updated;
}
