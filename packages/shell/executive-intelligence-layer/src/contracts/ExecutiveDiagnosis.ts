import { ExecutiveFinancialState } from './ExecutiveFinancialState';
import { ExecutiveRecommendation } from './ExecutiveRecommendation';

export type ExecutiveInsightCategory = 'LIQUIDITY' | 'CONTINUITY' | 'SOLVENCY' | 'WORKING_CAPITAL' | 'PROFITABILITY' | 'GROWTH' | 'DIVIDENDS' | 'CAPITAL' | 'COMPLIANCE' | 'PEOPLE' | 'CASH';

export interface ExecutiveDiagnosis {
  id: string; // Ex: ED-2026-08-001238
  generatedAt: string;
  evidenceHash: string;
  policyVersion: string;
  knowledgeVersion: string;
  validatorVersion: string;
  
  financialState: ExecutiveFinancialState;
  
  decisionMode: "ACCELERATE" | "OPTIMIZE" | "STABILIZE" | "PRESERVE";
  
  primaryDriver: ExecutiveInsightCategory;
  secondaryDrivers: ExecutiveInsightCategory[];
  criticalRisks: string[];
  
  blockedActions: string[];
  priorityKPIs: ExecutiveInsightCategory[];
  
  executiveSummary: string; // Resumo estruturado das restrições e estado.
  
  recommendations: ExecutiveRecommendation[];
}
