import { ShareholderDependencyStatus } from './CashFlowGovernanceOutput';

export class DFCRecommendationConsistencyAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    fco: number,
    dependencyStatus: ShareholderDependencyStatus,
    recommendation: string
  ): { isConsistent: boolean; divergenceReason: string | null } {
    
    const recLower = recommendation.toLowerCase();

    // Dangerous combination: Negative operating cash and high dependence, but recommendation is expansion
    if (
      (dependencyStatus === 'DEPENDENCIA_CRITICA' || dependencyStatus === 'DEPENDENCIA_RELEVANTE') &&
      fco < 0 &&
      (recLower.includes('expandir agressivamente') || 
       recLower.includes('expansão acelerada') || 
       recLower.includes('aumentar dividendos') ||
       recLower.includes('operações m&a') ||
       recLower.includes('aumentar endividamento estrutural'))
    ) {
      return {
        isConsistent: false,
        divergenceReason: `DFC_RECOMMENDATION_DIVERGENCE: Tentativa de recomendar expansão ou fuga de capital em uma operação com FCO negativo e dependência severa de aportes.`
      };
    }

    // False safety: Autossuficiente but FCO is negative without explanation
    if (dependencyStatus === 'AUTOSSUFICIENTE' && fco < 0 && recLower.includes('operação saudável')) {
      return {
        isConsistent: false,
        divergenceReason: `DFC_RECOMMENDATION_DIVERGENCE: Classificação de "Autossuficiente" conflitante com FCO negativo e recomendação de "operação saudável".`
      };
    }

    return { isConsistent: true, divergenceReason: null };
  }
}
