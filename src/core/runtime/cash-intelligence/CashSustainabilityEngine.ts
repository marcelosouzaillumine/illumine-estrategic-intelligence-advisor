import { CashSustainability, CashConfidenceLevel } from './CashIntelligenceTypes';

export class CashSustainabilityEngine {
  public static evaluate(
    fco: number,
    runwayMonths: number,
    equityFunding: number,
    thirdPartyFunding: number,
    liquidezOperacionalReal: number,
    confidenceLevel: CashConfidenceLevel
  ): CashSustainability {
    let classification: CashSustainability['classification'] = 'AUTOSSUSTENTADA';
    let rationale = 'A operação gera fluxo de caixa suficiente para financiar seu próprio ciclo operacional.';

    const externalFunding = equityFunding + thirdPartyFunding;

    if (fco > 0) {
      if (liquidezOperacionalReal >= 1.0 && runwayMonths >= 6) {
        classification = 'AUTOSSUSTENTADA';
        rationale = 'A operação é plenamente capaz de sustentar seu crescimento com recursos próprios.';
      } else {
        classification = 'EM_TRANSICAO';
        rationale = 'A organização gera caixa, mas níveis de liquidez ou runway ainda indicam transição para independência plena.';
      }
    } else { // fco <= 0
      if (externalFunding > Math.abs(fco) && runwayMonths >= 3) {
        classification = 'DEPENDENTE_DE_CAPITAL';
        rationale = 'A continuidade operacional depende de fontes externas de financiamento para sustentar o ciclo operacional.';
      } else {
        classification = 'INSUSTENTAVEL';
        rationale = 'O consumo de caixa aliado a curtos horizontes de sobrevivência indica padrão estruturalmente insustentável sem intervenção imediata.';
      }
    }

    return {
      classification,
      rationale,
      confidenceLevel,
      sourceMetrics: {
        fco,
        runwayMonths,
        equityFunding,
        thirdPartyFunding,
        liquidezOperacionalReal
      }
    };
  }
}
