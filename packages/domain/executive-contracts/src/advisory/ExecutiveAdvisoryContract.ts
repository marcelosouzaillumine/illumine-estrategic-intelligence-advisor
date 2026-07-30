import { ExecutiveRecommendationObject } from './ExecutiveRecommendationObject';

export interface ExecutiveAdvisoryContract {
  readonly advisoryId: string;
  readonly companyId: string;
  readonly recommendations: readonly ExecutiveRecommendationObject[];
  readonly totalActiveRecommendations: number;
  readonly generatedAt: string;
}

export * from './AdvisoryEvidenceContract';
export * from './StrategicScenarioContract';
export * from './ExecutiveRecommendationObject';
