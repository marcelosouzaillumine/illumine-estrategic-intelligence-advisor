import { ExecutiveDecisionObject } from './ExecutiveDecisionObject';

export interface ExecutiveDecisionReport {
  overallPriority: string;
  executiveDecisions: ExecutiveDecisionObject[];
  constitutionalStatus: string;
  decisionHash: string;
  generatedAt: string;
  decisionCompliance: {
    constitutionalStatus: string;
    lineageStatus: string;
    survivabilityStatus: string;
    conflictStatus: string;
  };
}
