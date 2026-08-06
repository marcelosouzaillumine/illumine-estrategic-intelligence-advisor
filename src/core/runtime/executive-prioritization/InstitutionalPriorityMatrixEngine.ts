// src/core/runtime/executive-prioritization/InstitutionalPriorityMatrixEngine.ts

export interface PriorityMatrixRow {
  area: 'Liquidez' | 'Rentabilidade' | 'Capital' | 'Governança' | 'Crescimento' | 'Operações';
  impacto: 'Muito Alto' | 'Alto' | 'Moderado' | 'Baixo';
  urgencia: 'Imediata' | 'ciclo imediato' | 'médio ciclo' | 'longo horizonte';
  esforco: 'Muito Alto' | 'Alto' | 'Moderado' | 'Baixo';
}

export class InstitutionalPriorityMatrixEngine {
  public static generate(report: any): PriorityMatrixRow[] {
    const netProfit = report.metrics?.netProfit ?? report.metrics?.netIncome ?? 0;
    const fco = report.metrics?.fco ?? report.cashSustainabilityReport?.sourceMetrics?.fco ?? 0;
    const runwayMonths = report.cashSustainabilityReport?.runwayMonths 
      ?? report.metrics?.fiduciary?.cashRunwayInstitucional?.months
      ?? report.continuityRisk?.projectedRunwayMonths 
      ?? 0;

    const lucrosPrejuizos = report.capitalGovernanceReport?.retainedEarnings 
      ?? report.capitalGovernanceReport?.lucrosPrejuizos 
      ?? report.executiveLayer?.consumedCapital?.value 
      ?? 0;

    const cqs = report.technicalAppendix?.cqs ?? report.scores?.governance ?? 0;

    const rows: PriorityMatrixRow[] = [];

    // 1. Liquidez
    const isLiquidityCrisis = fco < 0 || (runwayMonths > 0 && runwayMonths < 6);
    rows.push({
      area: 'Liquidez',
      impacto: isLiquidityCrisis ? 'Muito Alto' : 'Moderado',
      urgencia: isLiquidityCrisis ? (runwayMonths < 3 ? 'Imediata' : 'ciclo imediato') : 'longo horizonte',
      esforco: 'Moderado',
    });

    // 2. Rentabilidade
    const isProfitabilityCrisis = netProfit < 0;
    rows.push({
      area: 'Rentabilidade',
      impacto: isProfitabilityCrisis ? 'Muito Alto' : 'Moderado',
      urgencia: isProfitabilityCrisis ? 'ciclo imediato' : 'médio ciclo',
      esforco: 'Alto',
    });

    // 3. Capital
    const isCapitalEroded = lucrosPrejuizos < 0;
    rows.push({
      area: 'Capital',
      impacto: isCapitalEroded ? 'Alto' : 'Moderado',
      urgencia: isCapitalEroded ? 'ciclo imediato' : 'longo horizonte',
      esforco: 'Moderado',
    });

    // 4. Governança
    const isGovWeak = cqs < 60;
    rows.push({
      area: 'Governança',
      impacto: isGovWeak ? 'Alto' : 'Baixo',
      urgencia: isGovWeak ? 'ciclo imediato' : 'longo horizonte',
      esforco: 'Baixo',
    });

    // 5. Crescimento
    // Growth usually has higher effort and medium/long urgency unless sales are collapsing
    rows.push({
      area: 'Crescimento',
      impacto: isProfitabilityCrisis ? 'Moderado' : 'Alto',
      urgencia: isLiquidityCrisis ? 'longo horizonte' : 'médio ciclo',
      esforco: 'Muito Alto',
    });

    // 6. Operações
    // Operations usually has moderate impact/effort
    rows.push({
      area: 'Operações',
      impacto: 'Moderado',
      urgencia: isLiquidityCrisis ? 'ciclo imediato' : 'médio ciclo',
      esforco: 'Moderado',
    });

    return rows;
  }
}
