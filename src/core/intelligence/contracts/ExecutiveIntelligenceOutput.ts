export interface ExecutiveIntelligenceMeta {
  runtimeVersion: string;
  knowledgeVersion: string;
  ontologyVersion: string;
  processingTimeMs: number;
  pipelineId: string;
  sessionId: string;
  executionId: string;
}

export interface ExecutiveKnowledgeContext {
  packUsed: string;
  version: string;
  ontology: string;
  coverage: number;
  confidence: number;
}

export interface ExecutiveReasoning {
  facts: any[];
  observations: any[];
  patterns: any[];
  anomalies: any[];
  hypotheses: any[];
  insights: any[];
  findings: any[];
}

export interface ExecutiveDecision {
  decisionOptions: any[];
  tradeOffs: any[];
  recommendations: any[];
  nextBestActions: any[];
}

export interface DecisionProvenanceTrace {
  source: string;
  evidence: string;
  knowledgeUsed: string;
  ruleApplied: string;
  inference: string;
  finding: string;
  decision: string;
  outcome: string;
  confidence: number;
  timestamp: string;
  engine: string;
  knowledgeVersion: string;
  ontologyVersion: string;
  runtimeVersion: string;
}

export interface ExecutiveIntelligenceConfidence {
  score: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  factors: string[];
}

export interface ExecutiveGovernance {
  confidence: ExecutiveIntelligenceConfidence;
  validation: any;
  evidence: any;
  trace: DecisionProvenanceTrace[];
}

export interface FinancialIndicator {
  id?: string;
  name?: string;
  value?: number;
  unit?: string;
  category?: string;
  status?: string;
  interpretation?: string;
}

export interface FinancialDiagnostic {
  status: string;
  attention: string[];
  strengths: string[];
  executiveMessage: string;
}

export interface ExecutiveIntelligenceOutput {
  capabilityId?: string;
  confidence?: any;
  status?: string;
  diagnostics?: any[];
  exposures?: any[];
  insights?: any[];
  meta?: ExecutiveIntelligenceMeta;
  knowledgeContext?: ExecutiveKnowledgeContext;
  reasoning?: ExecutiveReasoning;
  decision?: ExecutiveDecision;
  governance?: ExecutiveGovernance;
  financialInsights?: any;
  financialDiagnosis?: any;
  financialDecisionContext?: any;
  evidence?: any;
  indicators?: any;
  financialPerformance?: {
    diagnosis: string;
    profitabilityInsights: any[];
    marginSignals: any[];
    earningsQuality: any[];
    performanceRisks: string[];
    growthOpportunities: string[];
  };
  financialCashFlow?: {
    diagnosis: string;
    cashGenerationProfile: string;
    conversionSignals: any[];
    liquidityRisks: string[];
    investmentSignals: any[];
    opportunities: string[];
    cfoQuestions: string[];
    workingCapitalImpact: string;
  };
  financialIntelligence?: {
    profile: string;
    findings: any[];
    themes: string[];
    questions: string[];
    history: any[];
  };
}
