import { LifecycleStage } from './LifecycleClassificationEngine';

export class EarlyStageNarrativeEngine {
  public static interpret(lifecycleStage: LifecycleStage, defaultNarrative: string, context: { hasPositiveEquity: boolean, analysisYear?: string | number }): string {
    if (lifecycleStage === 'INITIAL_CAPITALIZATION') {
      const year = context.analysisYear || '2022';
      let narrative = `A companhia encontra-se em fase inicial de capitalização e estruturação operacional.\nO prejuízo contábil, a geração operacional negativa de caixa e a dependência de aporte societário representam riscos financeiros relevantes, porém compatíveis com o estágio inicial de desenvolvimento da operação.\nA continuidade do negócio em ${year} foi sustentada pela capitalização dos sócios, enquanto a geração operacional ainda não demonstrava autossuficiência financeira. O patrimônio líquido permanece positivo.`;


      const blockedTerms = [
        'deterioração histórica',
        'empresa madura em declínio',
        'colapso operacional consolidado',
        'perda estrutural recorrente',
        'deterioração longitudinal'
      ];

      for (const term of blockedTerms) {
        if (defaultNarrative.toLowerCase().includes(term)) {
          throw new Error('EARLY_STAGE_SEMANTIC_CONTRADICTION: ' + term);
        }
      }

      return narrative;
    }

    // Default to the engine's original generic narrative for non-early stage companies
    return defaultNarrative;
  }
}
