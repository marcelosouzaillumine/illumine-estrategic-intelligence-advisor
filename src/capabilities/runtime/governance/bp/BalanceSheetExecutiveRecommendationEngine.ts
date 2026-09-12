import { sanitize } from '../../../../workspace/runtime/executive-consolidation/ExecutiveSemanticBoundaryGuard';

export class BalanceSheetExecutiveRecommendationEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Generates Primary Recommendations based only on the dominant restriction identified in the BP.
   */
  public static generatePrimary(
    dominantRestriction: string | null,
    rootCause: string
  ): { text: string; rationale: string[] } {
    if (!dominantRestriction) {
      return {
        text: sanitize('Preservar a disciplina de solvência e otimizar a alocação de capital dada a liquidez adequada e o baixo endividamento.'),
        rationale: [sanitize(rootCause), sanitize('O capital encontra-se formalmente preservado.')]
      };
    }

    switch (dominantRestriction) {
      case 'LIQUIDITY_CRITICAL':
        return {
          text: sanitize('Priorizar ações para liberação de capital de giro, redução de estoques e alongamento do perfil de exigibilidades operacionais.'),
          rationale: [sanitize(rootCause)]
        };
      case 'SOLVENCY_CRITICAL':
        return {
          text: sanitize('Necessidade imediata de injeção de capital ou reestruturação de passivos onerosos para restaurar a solvência.'),
          rationale: [sanitize(rootCause)]
        };
      case 'LEVERAGE_CRITICAL':
        return {
          text: sanitize('Interromper novas captações onerosas e priorizar desalavancagem via geração de caixa operacional ou desmobilização de ativos.'),
          rationale: [sanitize(rootCause)]
        };
      case 'CAPITAL_CONSUMPTION_CRITICAL':
        return {
          text: sanitize('Interrupção obrigatória da queima de caixa e reforço na retenção de lucros operacionais; suspender distribuição de proventos.'),
          rationale: [sanitize(rootCause)]
        };
      default:
        return {
          text: sanitize('Manter monitoramento rigoroso dos componentes estruturais do balanço patrimonial.'),
          rationale: [sanitize(rootCause)]
        };
    }
  }

  /**
   * Generates Secondary Advisories as contextual notes from other statements.
   */
  public static generateSecondary(
    externalAlerts: { source: 'DRE' | 'DFC' | 'DLPA'; message: string; severity: 'INFO' | 'WARNING' }[]
  ): Array<{ source: 'DRE' | 'DFC' | 'DLPA'; text: string; severity: 'INFO' | 'WARNING' }> {
    return externalAlerts.map(alert => ({
      source: alert.source,
      text: sanitize(`Parecer contextual originado no demonstrativo ${alert.source}: ${alert.message}`),
      severity: alert.severity
    }));
  }
}
