import { FinancialEvidenceContract } from './FinancialEvidenceContract';
import { DecisionAssessmentContract } from './DecisionAssessmentContract';

export interface NarrativeBlock {
  type: 'DIAGNOSIS' | 'RISK' | 'EXECUTION' | 'MONITORING';
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  source: string;
  body: string;
  recommendation: string;
  evidenceRefs: string[];
  validationStatus: string;
  causalRelationship: boolean;
}

export interface ExecutionPlanItem {
  id: string;
  action: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner: string;
  deadline: string;
  status: string;
}

export interface RiskItem {
  id: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigation: string;
}

export interface GovernanceContext {
  decisionType: "INVESTMENT" | "DIVIDEND" | "HIRING" | "DEBT" | "RESTRUCTURING" | "ACQUISITION" | "UNKNOWN";
  approvalLevel: "MANAGEMENT" | "EXECUTIVE" | "BOARD";
  fiduciaryRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  requiresEvidenceReview: boolean;
}

/**
 * Contrato Global da Plataforma de Inteligência Executiva (Substitui o antigo ExecutiveIntelligenceContract).
 */
export interface ExecutiveEvidencePackage {
  cognitiveSessionId: string;
  
  executiveContext: {
    financialState: string;
    severity: string;
    confidence: number;
    dominantDriver: string;
    institutionalMoment: string;
    businessStage: string;
  };
  
  decisionIntent: {
    requestedDecision: string;
    decisionCategory: "INVESTMENT" | "DIVIDEND" | "HIRING" | "DEBT" | "RESTRUCTURING" | "ACQUISITION" | "UNKNOWN";
    assumptions: string[];
  };
  
  dataQuality: {
    integrityScore: number;
    originScore: number;
    recencyScore: number;
    completenessScore: number;
    historicalReliabilityScore: number;
    warnings: string[];
    missingEvidence: string[];
    isComplete: boolean;
    dataSource: string;
    lastUpdatedAt: string;
  };
  
  evidenceTrail: FinancialEvidenceContract[];
  
  financialIntegrity?: {
    balanceSheetStatus: "VALIDATED" | "REJECTED";
    earningsQualityScore: number;
    cashConversionStatus: "HEALTHY" | "ATTENTION" | "CRITICAL";
    narrativePermission: "FULL" | "RESTRICTED" | "BLOCKED";
  };
  
  governanceContext?: GovernanceContext;
  
  decisionAssessment?: DecisionAssessmentContract;
  
  narrativeBlocks: NarrativeBlock[];
  
  executionPlan: ExecutionPlanItem[];
  
  benchmark?: any; // To be typed if needed
  
  institutionalMemory?: {
    pastLearnings: string[];
    relevantPreviousDecisions: string[];
  };
  
  riskMap: RiskItem[];
  
  confidenceMap: {
    financial: { score: number; basis: string };
    causal: { score: number; basis: string };
    recommendation: { score: number; basis: string };
    uncertainties: string[];
    executiveJudgmentRequired: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}
