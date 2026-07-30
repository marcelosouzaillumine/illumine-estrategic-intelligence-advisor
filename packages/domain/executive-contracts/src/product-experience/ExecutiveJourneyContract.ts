export type ExecutiveJourneyStage = 'DISCOVER' | 'UNDERSTAND' | 'PRIORITIZE' | 'DECIDE' | 'EXECUTE' | 'MONITOR' | 'LEARN';

export interface ExecutiveJourneyContract {
  readonly journeyId: string;
  readonly companyId: string;
  readonly currentStage: ExecutiveJourneyStage;
  readonly stageProgressPercent: number;
  readonly activeJourneyStepName: string;
  readonly nextRequiredAction: string;
}

export * from './ExecutiveNarrativeContract';
export * from './ExecutivePrioritizationContract';
export * from './ExecutiveValueVisualizationContract';
export * from './ExecutiveExperienceScoreContract';


