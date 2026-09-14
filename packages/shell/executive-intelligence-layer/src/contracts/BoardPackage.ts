import { ExecutiveQuestion } from '../domain/ExecutiveQuestion';
import { TechnicalAssessmentPackage } from './TechnicalAssessmentPackage';
import { ExecutionPlanItem, RiskItem } from './ExecutiveEvidencePackage';

import { HumanDecisionBoundary } from './HumanDecisionBoundary';

export interface BoardPackage {
  id: string;
  sessionId: string;
  generatedAt: Date;
  
  executiveQuestion: ExecutiveQuestion;
  contextSnapshot: string;
  
  assessments: TechnicalAssessmentPackage;
  
  conflictsIdentified: string[];
  optionsConsidered: { id: string; name: string; description: string; impact: string[] }[];
  tradeoffs: string[];
  risks: RiskItem[];
  
  humanDecisionBoundary?: HumanDecisionBoundary;
  
  finalDecisionRecord?: {
    status: 'APPROVED' | 'PARTIALLY_APPROVED' | 'RESTRICTED' | 'BLOCKED' | 'POSTPONED';
    justification: string;
    conditions: string[];
  };
  
  expectedOutcomes: {
    metric: string;
    target: string;
    warningThreshold: string;
  }[];
  
  reviewDate?: string;
  institutionalMemory: string;
}
