import { InstitutionalDecisionLedger } from './InstitutionalDecisionLedger';

export interface BehaviorPattern {
  patternId: string;
  name: string;
  description: string;
  severity: 'WARNING' | 'CRITICAL';
}

export class InstitutionalBehaviorPatternEngine {
  /**
   * Detects recurring institutional patterns by analyzing historical signals.
   */
  public static detect(ledger: InstitutionalDecisionLedger): BehaviorPattern[] {
    const patterns: BehaviorPattern[] = [];
    const events = ledger.getEvents();

    let growthWithoutCapitalizationCount = 0;
    let cashBurnCount = 0;

    for (const e of events) {
      if (e.eventType === 'UNFUNDED_GROWTH') {
        growthWithoutCapitalizationCount++;
      }
      if (e.eventType === 'CHRONIC_CASH_BURN') {
        cashBurnCount++;
      }
    }

    if (growthWithoutCapitalizationCount >= 2) {
      patterns.push({
        patternId: 'GROWTH_WITHOUT_CAP',
        name: 'Crescimento Sem Capitalização',
        description: 'A operação vem tentando escalar receitas de forma recorrente sem lastro proporcional de capital próprio ou geração de caixa livre, aumentando o risco de asfixia de capital de giro.',
        severity: 'CRITICAL'
      });
    }

    if (cashBurnCount >= 2) {
      patterns.push({
        patternId: 'CHRONIC_CASH_BURN',
        name: 'Queima Crônica de Caixa',
        description: 'Drenagem de caixa persistente por múltiplos ciclos, demonstrando ineficiência estrutural na conversão operacional.',
        severity: 'CRITICAL'
      });
    }

    return patterns;
  }
}
