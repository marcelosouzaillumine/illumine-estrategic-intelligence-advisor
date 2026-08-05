import { ExecutiveProfilePortfolio } from '../executive-profile/portfolio-types';
import { ExecutiveProfileRecord } from '../executive-profile/profile-types';

export interface ProgressionRecommendation {
  recommendedJourney: string;
  reason: string;
  expectedEvolution: string;
}

export interface ProgressionEngineContract {
  getNextExecutiveJourney(
    currentPortfolio: ExecutiveProfilePortfolio | null,
    latestProfile: ExecutiveProfileRecord | null
  ): ProgressionRecommendation;
}
