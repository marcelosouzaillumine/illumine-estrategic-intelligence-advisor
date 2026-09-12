import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';
import { ContinuityStatus } from './InstitutionalContinuityResolver';

export class ExecutiveMemoryNarrativeEngine {
  /**
   * Translates evolutionary continuity into a fluid executive narrative.
   */
  public static generateNarrative(
    continuityStatus: ContinuityStatus,
    isTrueTurnaround: boolean,
    turnaroundReason: string,
    ignoredRecommendationsCount: number
  ): string {
    let narrative = '';

    switch (continuityStatus) {
      case 'DETERIORAÇÃO_PROGRESSIVA':
        narrative = 'O histórico aponta uma degradação progressiva e sistêmica das margens de segurança, indicando que os desvios não são apenas sazonais.';
        break;
      case 'MELHORIA_SUSTENTADA':
        narrative = 'A organização conseguiu sustentar uma melhoria estrutural contínua, consolidando um novo patamar de governança fiduciária.';
        break;
      case 'RISCO_RECORRENTE':
        narrative = 'Foi detectada uma alta reincidência de vulnerabilidades, sinalizando que as medidas corretivas aplicadas em ciclos anteriores não foram suficientes para solucionar a raiz estrutural do problema.';
        break;
      case 'ESTABILIZAÇÃO_OPERACIONAL':
        narrative = 'O contexto indica estabilização e contenção de danos, ainda sem força motriz para classificar uma evolução clara de patamar patrimonial.';
        break;
      case 'DIAGNÓSTICO_INICIAL':
      default:
        narrative = 'Avaliação estática sem inferência longitudinal de tendência devido à limitação de histórico disponível.';
        break;
    }

    if (ignoredRecommendationsCount > 0) {
      narrative += ` A inércia na execução de recomendações (${ignoredRecommendationsCount} ignoradas sucessivamente) aumenta substancialmente o risco de execução da estratégia atual.`;
    }

    if (isTrueTurnaround) {
      narrative += ` ${turnaroundReason}`;
    }

    return narrative;
  }
}
