import { ArchitectureOption } from '../models/ArchitectureOption';
import { RecommendationScenario } from '../models/RecommendationScenario';

export class ScenarioEvaluationEngine {
  evaluate(options: ArchitectureOption[]): RecommendationScenario[] {
    return options.map(opt => ({
      id: `SCENARIO-${opt.id}`,
      option: opt.type,
      potentialChanges: opt.expectedEffects,
      affectedAreas: ['To be computed from Knowledge Graph']
    }));
  }
}
