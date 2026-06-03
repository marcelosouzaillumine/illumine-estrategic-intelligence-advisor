/**
 * OperationalHealthExplainabilityEngine
 * 
 * Traduz o Health Score numérico em narrativa executiva com drivers explicativos.
 * Não altera a matemática do score — apenas explica o resultado.
 */
export interface HealthScoreExplainabilityOutput {
  score: number;
  classification: string;
  classificationColor: 'emerald' | 'amber' | 'orange' | 'rose' | 'red';
  drivers: string[];
  executiveSummary: string;
}

export class OperationalHealthExplainabilityEngine {
  public static explain(
    score: number,
    context: {
      ebitda?: number;
      breakEvenCoverage?: number;  // 0–100
      grossMargin?: number;        // 0–1
      netProfit?: number;
      adminExpenses?: number;
      netRevenue?: number;
    }
  ): HealthScoreExplainabilityOutput {
    const { ebitda = 0, breakEvenCoverage = 0, grossMargin = 0, netProfit = 0, adminExpenses = 0, netRevenue = 0 } = context;

    const classification = this.classify(score);
    const classificationColor = this.getColor(score);
    const drivers = this.buildDrivers(score, { ebitda, breakEvenCoverage, grossMargin, netProfit, adminExpenses, netRevenue });
    const executiveSummary = this.buildSummary(score, classification, drivers);

    return { score, classification, classificationColor, drivers, executiveSummary };
  }

  private static classify(score: number): string {
    if (score >= 85) return 'SAUDÁVEL';
    if (score >= 70) return 'ATENÇÃO';
    if (score >= 50) return 'RESTRITIVO';
    if (score >= 30) return 'CRÍTICO';
    return 'COLAPSO ECONÔMICO';
  }

  private static getColor(score: number): 'emerald' | 'amber' | 'orange' | 'rose' | 'red' {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'amber';
    if (score >= 50) return 'orange';
    if (score >= 30) return 'rose';
    return 'red';
  }

  private static buildDrivers(
    score: number,
    ctx: { ebitda: number; breakEvenCoverage: number; grossMargin: number; netProfit: number; adminExpenses: number; netRevenue: number }
  ): string[] {
    const drivers: string[] = [];

    if (ctx.ebitda < 0) {
      drivers.push('EBITDA negativo (-25 pts)');
    }
    if (ctx.breakEvenCoverage < 80) {
      drivers.push('Cobertura insuficiente (-20 pts)');
    }
    if (ctx.netProfit < 0) {
      drivers.push('Escala abaixo do Break-even (-10 pts)');
    }
    if (ctx.grossMargin < 0.3) {
      drivers.push('Margem operacional negativa (-5 pts)');
    }
    if (ctx.netRevenue > 0 && Math.abs(ctx.adminExpenses) > ctx.netRevenue * 0.6) {
      drivers.push('Excesso de estrutura fixa não absorvida');
    }
    if (score < 40) {
      drivers.push('Pressão crítica sobre a rentabilidade futura');
    }

    // Se score alto, drivers positivos
    if (score >= 70) {
      drivers.push('Geração de margem de contribuição positiva');
    }
    if (score >= 85) {
      drivers.push('Cobertura operacional acima do ponto de equilíbrio');
      drivers.push('Estrutura de custos sustentável');
    }

    return drivers.slice(0, 5); // máximo 5 drivers
  }

  private static buildSummary(score: number, classification: string, drivers: string[]): string {
    if (score >= 70) {
      return `A operação apresenta saúde econômica classificada como ${classification}, com fundamentos consistentes de geração de resultado.`;
    }
    return `A operação apresenta saúde econômica classificada como ${classification}. Os principais determinantes são: ${drivers.slice(0, 2).join('; ')}.`;
  }
}
