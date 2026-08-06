export interface FinancialIndicator {
  code: string;
  name: string;
  value: number | string;
  classification: string;
  observation: string;
  evidence: string;
  financialMeaning: string;
}

export interface IntelligenceSignal {
  id: string;
  title: string;
  observation: string;
  evidence: string;
  financialMeaning: string;
}

export interface TechnicalEvidence {
  id: string;
  metric: string;
  value: string;
  referenceRange: string;
  methodologicalNotes: string;
}

export interface HistoricalSeries {
  year: number;
  data: Record<string, number>;
}

export interface FinancialPositionPureViewModel {
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
    capitalStructure: FinancialIndicator[];
    workingCapital: FinancialIndicator[];
    assetQuality: FinancialIndicator[];
  };
  signals: IntelligenceSignal[];
  historicalEvolution: HistoricalSeries[];
  executiveQuestions: string[];
  technicalEvidence: TechnicalEvidence[];
}

export interface FinancialPositionIntelligenceContract {
  pureViewModel: FinancialPositionPureViewModel;
  filterYear: number;
}
