import { FinancialIntegrityResult, IntegrityBlocker } from './FinancialIntegrityResult';
import { BalanceSheetValidator } from './rules/BalanceSheetValidator';
import { LiquidityIntegrityRules } from './rules/LiquidityIntegrityRules';
import { TrendIntegrityAnalyzer } from './rules/TrendIntegrityAnalyzer';

/**
 * Motor responsável por proteger a camada de inteligência (Layer 0).
 * Executa testes de integridade estrutural, econômica, temporal e decisória
 * ANTES que qualquer insight ou recomendação seja gerado.
 */
export class FinancialIntegrityEngine {
  
  /**
   * Avalia a integridade fiduciária e técnica dos dados de entrada
   * @param financialData Payload financeiro consolidado
   * @param historicalData Histórico financeiro para avaliação temporal
   * @param proposedDecision (Opcional) Se uma decisão executiva estiver em pauta
   */
  public static validate(financialData: any, historicalData?: any[], proposedDecision?: string): FinancialIntegrityResult {
    const blockers: IntegrityBlocker[] = [];
    let score = 100;

    // Sub-validadores Modulares
    const bsResult = BalanceSheetValidator.validate(financialData);
    if (bsResult.blockers.length > 0) blockers.push(...bsResult.blockers);

    const liqBlocker = LiquidityIntegrityRules.validate(financialData);
    if (liqBlocker) blockers.push(liqBlocker);

    if (historicalData && historicalData.length > 0) {
      const trendBlocker = TrendIntegrityAnalyzer.validate(historicalData);
      if (trendBlocker) blockers.push(trendBlocker);
    }

    // 1. Integridade Econômica (Economic Integrity)
    // Exemplo: Validação de consistência entre EBITDA e Receita
    if (financialData.ebitda && financialData.revenue) {
      if (financialData.ebitda > financialData.revenue) {
        blockers.push({
          severity: 'CRITICAL',
          category: 'ECONOMIC',
          rule: 'EBITDA_EXCEEDS_REVENUE',
          message: 'EBITDA informado supera receita bruta, indicando possível inconsistência cadastral, classificação contábil inadequada ou necessidade de validação da origem dos dados.'
        });
        score -= 40;
      }
    }

    // 2. Integridade Estrutural (Structural Integrity)
    // Exemplo: Equação patrimonial Ativo = Passivo + PL
    // if (Math.abs(financialData.assets - (financialData.liabilities + financialData.equity)) > 1) { ... }

    // 3. Integridade Decisória (Decisional Integrity)
    // Impede direcionamentos letais para a empresa
    if (proposedDecision) {
      if (proposedDecision === 'DISTRIBUTE_DIVIDENDS' && financialData.equity < 0) {
        blockers.push({
          severity: 'CRITICAL',
          category: 'DECISIONAL',
          rule: 'NEGATIVE_EQUITY_DIVIDENDS',
          message: 'Decisão de distribuir dividendos é fiduciariamente incompatível com condição patrimonial atual (PL Negativo).'
        });
        score -= 50;
      }
    }

    // Status Engine Calculation
    const hasCritical = blockers.some(b => b.severity === 'CRITICAL');
    const status = hasCritical ? 'BLOCKED' : (blockers.length > 0 ? 'WARNING' : 'PASSED');
    
    // Allowed actions pipeline (Security feature)
    const allowedActions = [];
    if (status === 'PASSED') {
      allowedActions.push('GENERATE_NARRATIVE', 'EVALUATE_DECISION', 'VIEW_METRICS');
    } else if (status === 'WARNING') {
      allowedActions.push('VIEW_METRICS', 'GENERATE_CAUTIOUS_NARRATIVE');
    } else {
      allowedActions.push('VIEW_METRICS'); // Bloqueia a IA de gerar narrativas
    }

    return {
      score: Math.max(0, score),
      status,
      blockers,
      allowedActions
    };
  }
}
