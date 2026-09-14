// src/core/runtime/causal-intelligence/StructuralDeteriorationMapper.ts

export interface StructuralDeteriorationResult {
  marginCompression: boolean;
  priceCostMismatch: boolean;
  operatingExpenseLeverage: boolean;
  taxBurdenPressure: boolean;
  cashDrainByDistributions: boolean;
  rationale: string[];
}

export class StructuralDeteriorationMapper {
  private static normStr(s: string): string {
    return (s || '').toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/^[0-9.]+\s*[-]\s*/, '')
      .replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '')
      .trim();
  }

  private static getVal(allHistData: any[], year: number, docType: string, keywords: string[]): number {
    const entries = allHistData.filter((d: any) => {
      const dYear = Number(d.year);
      const dType = StructuralDeteriorationMapper.normStr(d.type || d.docType || '');
      return dYear === year && dType === StructuralDeteriorationMapper.normStr(docType);
    });

    const match = entries.find((d: any) => {
      const name = StructuralDeteriorationMapper.normStr(d.conta || d.category || d.name || '');
      return keywords.some(k => name.includes(StructuralDeteriorationMapper.normStr(k)));
    });

    return match?.val || match?.valor || match?.value || 0;
  }

  public static evaluate(
    allHistData: any[],
    filterYear: number
  ): StructuralDeteriorationResult {
    const rationale: string[] = [];
    
    // Check if we have history for y-1 and y-2
    const yearsAvailable = [...new Set(allHistData.map((d: any) => Number(d.year)))];
    const hasY1 = yearsAvailable.includes(filterYear - 1);
    const hasY2 = yearsAvailable.includes(filterYear - 2);

    if (!hasY1) {
      return {
        marginCompression: false,
        priceCostMismatch: false,
        operatingExpenseLeverage: false,
        taxBurdenPressure: false,
        cashDrainByDistributions: false,
        rationale: ['Histórico insuficiente para mapear deterioração estrutural.']
      };
    }

    // Current Year (y)
    const revY = this.getVal(allHistData, filterYear, 'DRE', ['receita liquida', 'faturamento liquido', 'vendas liquidas', 'receita operacional liquida']);
    const cogsY = Math.abs(this.getVal(allHistData, filterYear, 'DRE', ['custo', 'cpv', 'cmv', 'custos das vendas', 'custo dos produtos']));
    const opexY = Math.abs(this.getVal(allHistData, filterYear, 'DRE', ['despesas operacionais', 'despesas administrativas', 'despesas comerciais', 'despesas com vendas', 'sg&a']));
    const taxY = Math.abs(this.getVal(allHistData, filterYear, 'DRE', ['imposto sobre a renda', 'irpj', 'csll', 'provisao para irpj']));
    const divY = Math.abs(this.getVal(allHistData, filterYear, 'DRE', ['dividendos', 'distribuicao de lucros', 'lucros distribuidos', 'dividendos propostos']));
    const netIncomeY = this.getVal(allHistData, filterYear, 'DRE', ['lucro liquido', 'resultado liquido', 'lucro do exercicio']);

    // Year y-1
    const revY1 = this.getVal(allHistData, filterYear - 1, 'DRE', ['receita liquida', 'faturamento liquido', 'vendas liquidas', 'receita operacional liquida']);
    const cogsY1 = Math.abs(this.getVal(allHistData, filterYear - 1, 'DRE', ['custo', 'cpv', 'cmv', 'custos das vendas', 'custo dos produtos']));
    const opexY1 = Math.abs(this.getVal(allHistData, filterYear - 1, 'DRE', ['despesas operacionais', 'despesas administrativas', 'despesas comerciais', 'despesas com vendas', 'sg&a']));
    const taxY1 = Math.abs(this.getVal(allHistData, filterYear - 1, 'DRE', ['imposto sobre a renda', 'irpj', 'csll', 'provisao para irpj']));
    const divY1 = Math.abs(this.getVal(allHistData, filterYear - 1, 'DRE', ['dividendos', 'distribuicao de lucros', 'lucros distribuidos', 'dividendos propostos']));

    // 1. Margin Compression & Price-Cost Mismatch
    let marginCompression = false;
    let priceCostMismatch = false;

    if (revY > 0 && revY1 > 0) {
      const grossMarginY = (revY - cogsY) / revY;
      const grossMarginY1 = (revY1 - cogsY1) / revY1;

      if (grossMarginY < grossMarginY1 - 0.02) {
        marginCompression = true;
        rationale.push('Deterioração estrutural da margem bruta (redução superior a 2.0 p.p. em relação ao ciclo anterior).');
      }

      // Price cost mismatch: costs growing faster than revenue
      const revGrowth = (revY - revY1) / revY1;
      const cogsGrowth = cogsY1 > 0 ? (cogsY - cogsY1) / cogsY1 : 0;
      if (cogsGrowth > revGrowth + 0.05 && marginCompression) {
        priceCostMismatch = true;
        rationale.push('Desalinhamento entre preço e custo: crescimento dos custos operacionais supera expansão de receitas.');
      }
    }

    // 2. Operating Expense Leverage
    let operatingExpenseLeverage = false;
    if (revY > 0 && revY1 > 0 && opexY > 0 && opexY1 > 0) {
      const opexToSalesY = opexY / revY;
      const opexToSalesY1 = opexY1 / revY1;
      if (opexToSalesY > opexToSalesY1 + 0.02) {
        operatingExpenseLeverage = true;
        rationale.push('Alavancagem de despesas operacionais: despesas administrativas/comerciais crescendo acima da capacidade de escala.');
      }
    }

    // 3. Tax Burden Pressure
    let taxBurdenPressure = false;
    if (netIncomeY > 0 && taxY > 0 && taxY1 > 0) {
      const effectiveTaxY = taxY / (netIncomeY + taxY);
      const effectiveTaxY1 = taxY1 > 0 ? taxY1 / (this.getVal(allHistData, filterYear - 1, 'DRE', ['lucro liquido', 'resultado liquido']) + taxY1) : 0;
      if (effectiveTaxY > effectiveTaxY1 + 0.05) {
        taxBurdenPressure = true;
        rationale.push('Elevação substancial da alíquota fiscal efetiva ou carga tributária operacional.');
      }
    }

    // 4. Cash Drain by Distributions
    let cashDrainByDistributions = false;
    if (divY > 0 && netIncomeY > 0) {
      const payoutY = divY / netIncomeY;
      if (payoutY > 0.8 && netIncomeY > 0) {
        cashDrainByDistributions = true;
        rationale.push('Consumo severo de caixa corporativo decorrente de distribuições excessivas de dividendos/JSCP.');
      }
    }

    return {
      marginCompression,
      priceCostMismatch,
      operatingExpenseLeverage,
      taxBurdenPressure,
      cashDrainByDistributions,
      rationale
    };
  }
}
