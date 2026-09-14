import { LifecycleStage } from './LifecycleClassificationEngine';

export class EarlyStageConsistencyValidator {
  public static validate(lifecycleStage: LifecycleStage, narrativeText: string): void {
    if (lifecycleStage === 'INITIAL_CAPITALIZATION') {
      const lowerText = narrativeText.toLowerCase();
      
      const contradictions = [
        'deterioração histórica',
        'empresa madura em declínio',
        'colapso operacional consolidado',
        'perda estrutural recorrente',
        'deterioração longitudinal'
      ];

      for (const contradiction of contradictions) {
        if (lowerText.includes(contradiction)) {
          throw new Error(`EARLY_STAGE_SEMANTIC_CONTRADICTION: Encontrado o termo proibido "${contradiction}" para estágio INITIAL_CAPITALIZATION.`);
        }
      }
    }
  }
}
