import { ArchitectureOptionType } from './ArchitectureOption';

export interface RecommendationScenario {
  readonly id: string;
  readonly option: ArchitectureOptionType;
  readonly potentialChanges: readonly string[];
  readonly affectedAreas: readonly string[];
}
