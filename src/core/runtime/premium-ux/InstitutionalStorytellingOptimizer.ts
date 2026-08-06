import { StorytellingNarrative } from './PremiumUXTypes';
import { GoldenDatasetProfile } from '../reality-validation/RealityValidationTypes';

export class InstitutionalStorytellingOptimizer {
  static buildNarrative(dataset: GoldenDatasetProfile): StorytellingNarrative {
    const criticalEntity = dataset.entities.find(e => e.liquidityPressure === 'CRITICAL')
      ?? dataset.entities[0];

    return {
      narrativeId: 'NARR-' + dataset.datasetId,
      headline: dataset.name + ': Situação Requer Atenção Imediata',
      context: dataset.description,
      keyRisk: dataset.stressFactors[0] ?? 'Pressão operacional elevada',
      recommendedFocus: criticalEntity
        ? criticalEntity.name + ' apresenta pressão de liquidez CRÍTICA e demanda decisão executiva urgente.'
        : 'Monitorar evolução do contexto sistêmico.'
    };
  }
}
