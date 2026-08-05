export type JourneyStatus = 'not_started' | 'in_progress' | 'completed';

export interface ExecutiveJourneyState {
  domain: string;
  status: JourneyStatus;
  maturity?: string;
  nextRecommendedJourney?: string;
  advisoryReady: boolean;
  updatedAt: string;
}
