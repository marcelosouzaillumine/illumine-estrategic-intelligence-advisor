import { CashReinvestment, CashConfidenceLevel } from './CashIntelligenceTypes';

export class CashReinvestmentEngine {
  public static evaluate(
    fco: number,
    fci: number,
    confidenceLevel: CashConfidenceLevel
  ): CashReinvestment {
    // If operational cash flow is negative, there is no generated cash to reinvest.
    if (fco <= 0) {
      return {
        reinvestmentRate: null,
        classification: 'NAO_APLICAVEL',
        displayValue: 'Não Aplicável',
        rationale: 'A operação consumiu caixa durante o exercício e não gerou excedente financeiro para reinvestimento.',
        confidenceLevel,
        sourceMetrics: { fco, fci }
      };
    }

    // FCI represents investments (typically negative cash flow out)
    const absoluteInvestment = Math.abs(fci < 0 ? fci : 0);
    const reinvestmentRate = absoluteInvestment / fco;
    const displayValue = `${Math.round(reinvestmentRate * 100)}%`;

    let classification: CashReinvestment['classification'] = 'BAIXO_REINVESTIMENTO';
    let rationale = '';

    if (reinvestmentRate > 1.0) {
      classification = 'INSUSTENTAVEL';
      rationale = 'O ritmo de reinvestimento excede a geração de caixa da operação, o que pode pressionar a liquidez ou demandar aportes.';
    } else if (reinvestmentRate >= 0.2) {
      classification = 'REINVESTIMENTO_SAUDAVEL';
      rationale = 'A organização retém e aplica uma porção saudável de sua geração de caixa para expansão e manutenção do ativo operacional.';
    } else {
      classification = 'BAIXO_REINVESTIMENTO';
      rationale = 'O índice de reinvestimento é baixo em relação ao caixa gerado, sugerindo foco na preservação de liquidez ou distribuição.';
    }

    return {
      reinvestmentRate,
      classification,
      displayValue,
      rationale,
      confidenceLevel,
      sourceMetrics: { fco, fci }
    };
  }
}
