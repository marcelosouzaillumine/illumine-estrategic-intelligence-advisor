
export type DRERevenueEconomicStructureViewModel = {
  available: boolean;
  reason?: 'INSUFFICIENT_HISTORY' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
  narrative?: string;
};

export type DREEconomicBurnRateViewModel = {
  available: boolean;
  reason?: 'INSUFFICIENT_HISTORY' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
  narrative?: string;
  monthlyEconomicBurnFormatted?: string;
  annualEconomicBurnFormatted?: string;
  hasBurn: boolean;
};

export type DREBreakEvenAnalysisViewModel = {
  available: boolean;
  reason?: 'INSUFFICIENT_HISTORY' | 'INSUFFICIENT_DATA' | 'NOT_APPLICABLE';
  narrative?: string;
  absorptionClassification?: string;
  absorptionTone?: 'success' | 'warning' | 'critical';
};

export type BoardQuestionVM = {
  title: string;
  response: string;
  rationale: string;
  recommendation: string;
};

export type DREBoardDecisionSupportViewModel = {
  p1ValueCreation: BoardQuestionVM;
  p2StructureSupport: BoardQuestionVM;
  p3EconomicEquilibrium: BoardQuestionVM;
  p4PrimaryConstraint: BoardQuestionVM;
  p5EconomicOpportunity: BoardQuestionVM;
  p6InactionRisk: BoardQuestionVM;
  p7BoardPriority: BoardQuestionVM;
  overallStatus: string;
  confidenceScore: number;
};

export type DREExecutiveAdvisorySectionViewModel = {
  currentSituation: string;
  strategicPriority: string;
  operationalOutlook: string;
  primaryRecommendation: string;
  primaryEconomicDriver: string;
  severityState: "critical" | "warning" | "healthy" | "neutral";
  recommendationPriority: "high" | "medium" | "low";
  dominantStrength: string;
  secondaryAttention: string;
};






export type DRETechnicalRowViewModel = {
  label: string;
  val: number;
  av: number;
  ah1: number | null;
  ah2: number | null;
  ah3: number | null;
  level: number;
  isTotal: boolean;
};

export type DRETechnicalLayerViewModel = {
  rows: DRETechnicalRowViewModel[];
};
