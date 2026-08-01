import { DecisionRecord, DecisionOutcome } from '../governance/DecisionRecord';

export interface CriticalSignal {
  domain: "FINANCIAL" | "COMMERCIAL" | "OPERATIONAL" | "PEOPLE" | "RISK" | "GOVERNANCE" | "INNOVATION";
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  recommendedAction?: string;
}

export interface ActiveDecisionSummary {
  id: string;
  topic: string;
  status: string;
  risk: string;
  urgency: string;
}

/**
 * Domain Entity: Executive Organization State
 * Representa o estado cognitivo e operacional "vivo" da organização.
 * Esta é uma view materializada construída a partir de eventos passados e presentes,
 * e não uma tabela estática no banco de dados.
 */
export interface ExecutiveOrganizationState {
  identity: {
    companyId: string;
    companyName: string;
    lastAggregatedAt: string;
  };
  
  institutionalMoment: string;
  
  financialCondition: {
    confidenceLevel: number;
    healthStatus: string;
    keyMetricFocus: string;
  };
  
  strategicPressure: {
    level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    reason: string;
  };
  
  criticalSignals: CriticalSignal[];
  
  activeDecisions: ActiveDecisionSummary[];
  
  unresolvedRisks: string[];
  
  organizationalLearning: {
    recentLearnings: string[];
    successfulDecisionsCount: number;
    failedDecisionsCount: number;
  };
  
  maturityLevel: "AD-HOC" | "REACTIVE" | "PROACTIVE" | "PREDICTIVE" | "INSTITUTIONAL";
  
  recommendedAttention: string;
}
