import { ExecutiveInsight } from './executive-insight.types';

export type InnovationTrend = 'accelerating' | 'stable' | 'stagnating';

export interface ExecutiveInnovationHealthScore {
  overallScore: number;
  pipelineScore: number; // 25%
  portfolioScore: number; // 20%
  experimentationScore: number; // 20%
  digitalMaturityScore: number; // 20%
  knowledgeScore: number; // 15%
  innovationVelocity: number; // e.g., time to market / speed of adaptation
  strategicAlignment: number; // 0-100
  trend: InnovationTrend;
}

export interface InnovationPortfolioData {
  activeProjects: number;
  strategicInitiatives: number;
  totalCapexAllocated: number;
  expectedROI: number; // percentage
  projectsAtRisk: number;
  portfolioAlignmentIndex: number; // 0-100
}

export interface OpportunityIntelligenceData {
  mappedMarketTrends: number;
  disruptiveThreats: number;
  newBusinessTheses: number;
  strategicPartnerships: number;
  opportunityCaptureRate: number; // percentage
}

export interface ExperimentManagementData {
  activeExperiments: number;
  fastFailRate: number; // percentage of experiments successfully failed fast
  successfulConversions: number;
  averageExperimentCycleDays: number;
  innovationFunnelYield: number; // percentage
}

export interface DigitalTransformationData {
  digitalMaturityLevel: 'Nascent' | 'Developing' | 'Mature' | 'Optimized';
  automationRate: number; // percentage of core processes automated
  techAdoptionIndex: number; // 0-100
  legacySystemsToModernize: number;
  digitalTransformationROI: number;
}

export interface KnowledgeEvolutionData {
  strategicTrainingHours: number;
  activeCommunitiesOfPractice: number;
  knowledgeRetentionIndex: number; // 0-100
  internalSMEs: number; // Subject Matter Experts mapped
  organizationalLearningRate: number; // 0-100
}

export interface InnovationExecutiveDataPayload<T> {
  metadata: {
    generatedAt: string;
    office: 'innovation';
    capability: string;
    version: string;
  };
  healthScore?: ExecutiveInnovationHealthScore;
  insights: ExecutiveInsight[];
  risks: string[];
  recommendations: string[];
  metrics: T;
}

export interface InnovationExecutiveSummaryData {
  healthScore: ExecutiveInnovationHealthScore;
  velocity: number;
  strategicAlignment: number;
  activeProjects: number;
  digitalMaturityLevel: string;
  criticalInsights: ExecutiveInsight[];
}
