import { MemoryConfidenceLevel } from './MemoryConfidenceLevel';

export enum MemoryType {
  INSIGHT = 'INSIGHT',
  QUESTION = 'QUESTION',
  DECISION_CONTEXT = 'DECISION_CONTEXT',
  STRATEGIC_THEME = 'STRATEGIC_THEME',
  RISK = 'RISK',
  OPPORTUNITY = 'OPPORTUNITY'
}

export enum MemoryLifecycleStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  ARCHIVED = 'ARCHIVED'
}

export interface ExecutiveMemoryArtifact {
  id: string;
  tenantId: string;
  type: MemoryType;
  content: string;
  source: {
    conversationId: string;
    user: string; // The role or specific user who originated or validated it
    timestamp: string;
  };
  confidence: MemoryConfidenceLevel;
  lifecycle: {
    status: MemoryLifecycleStatus;
    reviewDate?: string; // Optional future review date
  };
  governance: {
    humanValidated: boolean;
    createdBy: string; // e.g. "CFO", "ExecutiveFinancialAgent"
  };
}
