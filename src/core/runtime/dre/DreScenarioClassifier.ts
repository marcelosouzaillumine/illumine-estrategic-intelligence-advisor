import { DreExecutiveFacts } from './DreExecutiveFactsBuilder';

export enum DreEconomicScenario {
  ECONOMIC_STRESS = 'ECONOMIC_STRESS',
  STRUCTURE_ABSORPTION_RISK = 'STRUCTURE_ABSORPTION_RISK',
  MARGIN_COMPRESSION = 'MARGIN_COMPRESSION',
  PROFITABLE_SCALE = 'PROFITABLE_SCALE',
  ACCELERATED_VALUE_CREATION = 'ACCELERATED_VALUE_CREATION',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export class DreScenarioClassifier {
  public static classify(facts: DreExecutiveFacts): DreEconomicScenario {
    if (facts.netRevenue <= 0) {
      return DreEconomicScenario.UNCATEGORIZED;
    }

    // 1. ECONOMIC_STRESS
    // Se EBITDA < 0 ou Lucro Líquido < 0
    if (facts.ebitda < 0 || facts.netIncome < 0) {
      return DreEconomicScenario.ECONOMIC_STRESS;
    }

    // 2. STRUCTURE_ABSORPTION_RISK
    // Se cobertura do ponto de equilíbrio < 100%
    if (facts.breakEvenCoverage < 1.0) {
      return DreEconomicScenario.STRUCTURE_ABSORPTION_RISK;
    }

    // 3. ACCELERATED_VALUE_CREATION
    // Se EBITDA margin > 20%, lucro positivo, cobertura > 150% e margem de contribuição > 40%
    if (
      facts.ebitda > 0 &&
      facts.netIncome > 0 &&
      facts.ebitdaMargin > 0.20 &&
      facts.breakEvenCoverage > 1.50 &&
      facts.contributionMarginRate > 0.40
    ) {
      return DreEconomicScenario.ACCELERATED_VALUE_CREATION;
    }

    // 4. PROFITABLE_SCALE
    // Se EBITDA > 0, lucro > 0 e cobertura > 120%
    if (
      facts.ebitda > 0 &&
      facts.netIncome > 0 &&
      facts.breakEvenCoverage > 1.20
    ) {
      // Mas se tem histórico validado e as margens caem enquanto receita sobe, é MARGIN_COMPRESSION
      if (facts.hasMeaningfulHistory && facts.revenueGrowth > 0 && (facts.ebitdaGrowth < 0 || facts.netIncomeGrowth < 0)) {
         return DreEconomicScenario.MARGIN_COMPRESSION;
      }
      return DreEconomicScenario.PROFITABLE_SCALE;
    }

    // 5. MARGIN_COMPRESSION
    // Se receita cresce mas EBITDA/margem caem (mesmo que cobertura não seja > 120%)
    if (facts.hasMeaningfulHistory && facts.revenueGrowth > 0 && (facts.ebitdaGrowth < 0 || facts.netIncomeGrowth < 0)) {
      return DreEconomicScenario.MARGIN_COMPRESSION;
    }

    // Fallback caso seja rentável, mas cobertura entre 100% e 120% e margens apertadas
    if (facts.ebitda > 0 && facts.breakEvenCoverage >= 1.0) {
      return DreEconomicScenario.PROFITABLE_SCALE; // Elevando qualquer rentabilidade mínima com PE coberto para escala rentável, para não cair no UNCATEGORIZED injustamente
    }

    return DreEconomicScenario.UNCATEGORIZED;
  }
}
