import { GovernanceCatalog, GovernanceRecommendation } from './GovernanceRecommendationRegistry';

export interface RoadmapAction {
  priorityScore: number; // Impact / Effort logic
  title: string;
  category: string;
  impactLevel: string;
  estimatedTimeline: 'ciclo imediato' | 'médio ciclo' | 'longo horizonte';
}

export interface RoadmapPrioritizationInput {
  irg: number;
  gpi: number;
}

export interface RoadmapPrioritizationOutput {
  curtoPrazo: RoadmapAction[];
  medioPrazo: RoadmapAction[];
  longoPrazo: RoadmapAction[];
}

function getImpactValue(impact: string): number {
  switch (impact) {
    case 'Alto': return 3;
    case 'Médio': return 2;
    case 'Baixo': return 1;
    default: return 1;
  }
}

function getEffortValue(effort: string): number {
  switch (effort) {
    case 'Alto': return 3;
    case 'Médio': return 2;
    case 'Baixo': return 1;
    default: return 2;
  }
}

export function generateInstitutionalRoadmap(input: RoadmapPrioritizationInput): RoadmapPrioritizationOutput {
  // 1. Filter applicable actions based on triggers
  // (An action is applicable if the IRG or GPI exceeds its thresholds, meaning the problem exists)
  const applicableActions = GovernanceCatalog.filter(
    rec => input.irg >= rec.triggerIRGThreshold || input.gpi >= rec.triggerGPIThreshold
  );

  // 2. Score and map actions
  // The user specified: Order by Institutional Impact / Effort
  const scoredActions = applicableActions.map(rec => {
    const impactVal = getImpactValue(rec.impactLevel);
    const effortVal = getEffortValue(rec.implementationEffort);
    
    // Impact / Effort ratio. Multiply by 10 for better readability
    const priorityScore = (impactVal / effortVal) * 10;
    
    return {
      rec,
      priorityScore
    };
  });

  // Sort by priorityScore descending
  scoredActions.sort((a, b) => b.priorityScore - a.priorityScore);

  // 3. Distribute over timelines based on priority and effort
  const curtoPrazo: RoadmapAction[] = [];
  const medioPrazo: RoadmapAction[] = [];
  const longoPrazo: RoadmapAction[] = [];

  // Very simple distribution heuristic ensuring max ~3 actions per bucket to avoid overwhelming
  scoredActions.forEach((item) => {
    const action: RoadmapAction = {
      priorityScore: item.priorityScore,
      title: item.rec.title,
      category: item.rec.category,
      impactLevel: item.rec.impactLevel,
      estimatedTimeline: 'longo horizonte'
    };

    if (item.priorityScore >= 15 && curtoPrazo.length < 3) {
      action.estimatedTimeline = 'ciclo imediato';
      curtoPrazo.push(action);
    } else if (item.priorityScore >= 10 && medioPrazo.length < 4) {
      action.estimatedTimeline = 'médio ciclo';
      medioPrazo.push(action);
    } else if (longoPrazo.length < 4) {
      action.estimatedTimeline = 'longo horizonte';
      longoPrazo.push(action);
    }
  });

  // If a bucket is empty because scores were weird, fallback filling
  // omitted for simplicity but valid to do.

  return {
    curtoPrazo,
    medioPrazo,
    longoPrazo
  };
}
