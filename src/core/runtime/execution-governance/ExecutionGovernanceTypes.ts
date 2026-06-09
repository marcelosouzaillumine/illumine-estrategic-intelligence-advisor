export type ExecutionStatus = 'PENDING' | 'IN_PROGRESS' | 'EXECUTED' | 'ABORTED' | 'DEVIATED';

export type SlippageSeverity = 'NONE' | 'LOW' | 'MODERATE' | 'CRITICAL';

export interface ExecutionSlippage {
  timeSlippageDays: number;
  timeSeverity: SlippageSeverity;
  
  scopeDeviationPercent: number; // 0 = no deviation, > 0 = scope reduced or changed
  scopeSeverity: SlippageSeverity;

  impactDeviationPercent: number; // Negative means worse impact than expected
  impactSeverity: SlippageSeverity;

  overallSlippageScore: number; // 0 to 100, where 100 is complete failure
}

export interface ExecutionCommitment {
  id: string;
  sourceRecommendationId: string;
  title: string;
  description: string;
  
  // Baseline Expectations (from PRGIF)
  expectedCompletionDate: Date;
  expectedCapex: number;
  expectedRevenueImpact: number;
  
  // Actuals
  actualStartDate?: Date;
  actualCompletionDate?: Date;
  actualCapex?: number;
  actualRevenueImpact?: number;

  status: ExecutionStatus;
  slippage: ExecutionSlippage;
  
  ownerRole: string;
  lastUpdated: Date;
}
