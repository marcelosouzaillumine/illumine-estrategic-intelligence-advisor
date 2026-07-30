import { InstitutionalWisdomObject } from './InstitutionalWisdomObject';

export interface InstitutionalLearningContract {
  readonly learningId: string;
  readonly companyId: string;
  readonly wisdomObjects: readonly InstitutionalWisdomObject[];
  readonly totalWisdomCount: number;
  readonly lastEvolutionTimestamp: string;
}

export * from './InstitutionalMemoryType';
export * from './InstitutionalWisdomObject';
