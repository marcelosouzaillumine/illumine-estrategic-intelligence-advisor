import { AnalyticalAvailability } from '../../../core/contracts/AnalyticalAvailability';
import { DataCollection } from '../../../core/contracts/DataCollection';
import { IntelligenceSignal } from './IntelligenceSignal';
import { ExecutiveQuestion } from './ExecutiveQuestion';
import { HistoricalIntelligence } from './HistoricalIntelligence';
import { OperationalScore } from '../intelligence/operational/score/OperationalScoreEngine';
import { OperationalMetrics } from '../intelligence/operational/OperationalMetricsEngine';

export interface OperationalPositionSummary {
    healthStatus: 'STRONG' | 'VULNERABLE' | 'CRITICAL' | 'NEUTRAL';
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    drivers: string[];
    observation: string;
    evidence: string;
    financialMeaning: string;
}

export interface OperationalIntelligenceContract {
    executiveSummary: DataCollection<any>; // OperationalPositionSummary
    score: DataCollection<OperationalScore>;
    overview: OperationalPositionSummary;
    metrics: OperationalMetrics;
    signals: DataCollection<IntelligenceSignal>;
    historicalEvolution: DataCollection<HistoricalIntelligence>;
    executiveQuestions: DataCollection<ExecutiveQuestion>;
    technicalEvidence: DataCollection<any>;
}
