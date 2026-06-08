export type ShareholderDependencyStatus = 
  | 'AUTOSSUFICIENTE'
  | 'DEPENDENCIA_MODERADA'
  | 'DEPENDENCIA_RELEVANTE'
  | 'DEPENDENCIA_CRITICA';

export type DFCDivergenceSeverity = 
  | 'NONE'
  | 'EXPLAINABLE_WARNING'
  | 'MATHEMATICAL_BLOCKING';

export interface CashFlowGovernanceOutput {
  exerciseYear: number;
  sourceStatement: 'CASH_FLOW_STATEMENT';
  
  // Strict mathematical core (No NaNs)
  metrics: {
    fco: number;
    fci: number;
    fcf: number;
    netVariation: number;
    accountingProfit: number;
    shareholderContributions: number;
    receitaLiquida?: number;
  };

  // Classifications
  classifications: {
    shareholderDependency: ShareholderDependencyStatus;
    cashGenerationStatus: 'GERACAO_OPERACIONAL' | 'CONSUMO_OPERACIONAL';
    divergenceSeverity: DFCDivergenceSeverity;
  };

  // Explainability and narratives
  narratives: {
    divergenceExplanation: string | null;
    executiveSummary: string;
    primaryRecommendation: string;
    causalNarrative: string;
    cashConversionAnalysis?: {
      ratio: number;
      cashConversionPer100Revenue: number;
      rationale: string;
    };
  };

  explainability: {
    generators: string[];
    consumers: string[];
    externalDependencies: string[];
    recommendationDrivers: string[];
  };

  // Mathematical constraints validation
  validation: {
    isValid: boolean;
    blockReason: string | null;
  };
}
