import { DataCollection } from '../../../core/contracts/DataCollection';
import { IntelligenceSignal } from './IntelligenceSignal';
import { ExecutiveQuestion as IntelligenceExecutiveQuestion } from './ExecutiveQuestion';
import { ExecutivePositionSummary } from './ExecutivePositionSummary';
import { FinancialPositionScore } from './FinancialPositionScore';
import { HistoricalIntelligence } from './HistoricalIntelligence';

export interface IntelligenceOverview {
  healthStatus: string;
  confidence: string;
  drivers: string[];
  observation: string;
  evidence: string;
  financialMeaning: string;
}

export interface IntelligenceDiagnosis {
  liquidity: any[];
  solvencyAndCapitalStructure: any[];
  workingCapital: any[];
  assetQuality: any[];
}

export interface IntelligenceHistoricalEvolution {
  series: any[];
  comparison: any;
  waterfall: any;
  composition: any;
  trends: any[];
}



export interface IntelligenceTechnicalEvidence {
  bpSummary: any;
  rows: any[];
  auditMetadata: any;
  structuralTables: any[];
}

export interface FinancialPositionIntelligenceContract {
  executiveSummary: DataCollection<ExecutivePositionSummary>;
  overview: IntelligenceOverview;
  score: DataCollection<FinancialPositionScore>;
  diagnosis: IntelligenceDiagnosis;
  signals: DataCollection<IntelligenceSignal>;
  historicalEvolution: DataCollection<HistoricalIntelligence>;
  executiveQuestions: DataCollection<IntelligenceExecutiveQuestion>;
  technicalEvidence: DataCollection<IntelligenceTechnicalEvidence>;
}
