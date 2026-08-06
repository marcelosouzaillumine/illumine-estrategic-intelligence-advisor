// src/core/runtime/treasury-intelligence/TreasuryGovernanceEngine.ts

export interface GovernanceEvaluationInput {
  runwayMonths: number;
  isSurvivabilityDegraded: boolean;
  isPLEroded: boolean;
  fco: number;
  availableCash: number;
  isArtificial: boolean;
  allocationsToGrowth: number;
  allocationsToDistribution: number;
  allocationsToExpansion: number;
}

export class TreasuryGovernanceEngine {
  /**
   * Evaluates general treasury compliance and governance maturity.
   * Enforces rules against forbidden behaviors:
   * - Prioritizing growth over survivability under stress
   * - Shareholder distribution under structural fragility
   * - Financing expansion through destructive liquidity deterioration
   * - Allocating treasury without runway awareness
   */
  public static evaluate(input: GovernanceEvaluationInput): {
    isValid: boolean;
    violations: string[];
    verdict: string;
    governanceMaturity: 'EXCELLENT' | 'STABLE' | 'DEVIATING' | 'DANGEROUS';
  } {
    const {
      runwayMonths,
      isSurvivabilityDegraded,
      isPLEroded,
      fco,
      availableCash,
      isArtificial,
      allocationsToGrowth,
      allocationsToDistribution,
      allocationsToExpansion
    } = input;

    const violations: string[] = [];

    // Rule 1: Prioritize growth over survivability
    if ((runwayMonths < 12 || isSurvivabilityDegraded) && allocationsToGrowth > availableCash * 0.3) {
      violations.push(
        'GROWTH_OVER_SURVIVABILITY_VIOLATION: Alocação excessiva em crescimento comercial em contexto de vulnerabilidade de sobrevivência.'
      );
    }

    // Rule 2: Shareholder distribution under structural fragility
    if (allocationsToDistribution > 0 && (isPLEroded || fco <= 0 || isArtificial)) {
      violations.push(
        'DISTRIBUTION_UNDER_STRUCTURAL_FRAGILITY_VIOLATION: Distribuição de dividendos/payout realizada sob erosão patrimonial ou dependência de capital externo.'
      );
    }

    // Rule 3: Finance expansion through destructive liquidity deterioration
    if (allocationsToExpansion > 0 && runwayMonths < 6) {
      violations.push(
        'EXPANSION_UNDER_CRITICAL_RUNWAY_VIOLATION: Capex de expansão financiado sob horizonte de caixa crítico (runway < 6 meses).'
      );
    }

    // Rule 4: Optimize profitability while degrading resilience
    if (runwayMonths < 12 && availableCash < 15000 && allocationsToExpansion > 0) {
      violations.push(
        'RESILIENCE_DEGRADATION_VIOLATION: Investimento em expansão degradando as últimas reservas de caixa de continuidade.'
      );
    }

    const isValid = violations.length === 0;
    let governanceMaturity: 'EXCELLENT' | 'STABLE' | 'DEVIATING' | 'DANGEROUS' = 'EXCELLENT';
    let verdict = '';

    if (violations.length >= 2) {
      governanceMaturity = 'DANGEROUS';
      verdict = 'Parecer Fiduciário Adverso: Desvios múltiplos e graves das diretrizes de sustentabilidade de tesouraria.';
    } else if (violations.length === 1) {
      governanceMaturity = 'DEVIATING';
      verdict = 'Parecer Fiduciário com Restrições: Identificada violação nas regras de alocação prudente.';
    } else if (runwayMonths >= 24 && fco > 0 && !isPLEroded) {
      governanceMaturity = 'EXCELLENT';
      verdict = 'Parecer Fiduciário Pleno: Tesouraria sob excelente controle e governança alinhada.';
    } else {
      governanceMaturity = 'STABLE';
      verdict = 'Parecer Fiduciário Regular: Alocações em conformidade com as restrições básicas de sobrevivência.';
    }

    return {
      isValid,
      violations,
      verdict,
      governanceMaturity
    };
  }
}
