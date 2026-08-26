export interface FinancialIndicator {
  code?: string;
  name?: string;
  value: number | string | null;
  classification?: string;
  observation?: string;
  evidence?: string;
  financialMeaning?: string;
  formattedValue?: string;
  availability?: string;
}

export interface IntelligenceSignal {
  id: string;
  title: string;
  observation: string;
  evidence: string;
  financialMeaning: string;
  severity?: string;
  sourceMetric?: string;
  interpretation?: string;
  relatedQuestion?: string;
  traceability?: any;
  persistence?: any;
}

export interface HistoricalIntelligenceResult {
  available: boolean;
  periodCoverage: any;
  trajectory: any;
  movements: any[];
  executiveContext: any;
}

export interface TechnicalEvidenceRow {
  item: string;
  value: number;
  type: string;
}

export interface ExecutivePositionSummaryResult {
  available: boolean;
  status: {
    classification: string;
    narrative: string;
  };
  strengths: any[];
  attentionPoints: any[];
  centralQuestion: {
    question: string;
  };
}

export interface FinancialPositionScoreResult {
  available: boolean;
  overall: {
    value: number;
    classification: string;
    finalStatus: string;
    confidence: string;
    explanation: string;
    structuralEvents: any[];
  };
  dimensions: {
    liquidity: any;
    solvencyAndCapitalStructure: any;
    workingCapital: any;
    assetQuality: any;
    evolution: any;
  };
  methodology: any;
}

export interface FinancialPositionPureViewModel {
  executiveSummary?: ExecutivePositionSummaryResult;
  score?: FinancialPositionScoreResult;
  overview: {
    healthStatus: string;
    confidence: string;
    drivers: string[];
    observation: string;
    evidence: string;
    financialMeaning: string;
  };
  diagnosis: {
    liquidity: FinancialIndicator[];
    solvencyAndCapitalStructure: FinancialIndicator[];
    workingCapital: FinancialIndicator[];
    assetQuality: FinancialIndicator[];
  };
  signals: any;
  historicalEvolution: any;
  executiveQuestions: any;
  technicalEvidence: any;
}

export interface FinancialPositionIntelligenceContract {
  pureViewModel: FinancialPositionPureViewModel;
  filterYear: number;
}
