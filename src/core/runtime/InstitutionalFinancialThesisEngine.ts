import { ConsolidatedCashFlowReport } from './cashflow/cashflow-types';
import { ConsolidatedCapitalGovernanceReport } from './capital-governance/capital-governance-types';

export class InstitutionalFinancialThesisEngine {
  public static generate(
    bpSummary: any,
    ebitda: number,
    lucroLiquido: number,
    cashFlowReport: ConsolidatedCashFlowReport,
    capitalGovernanceReport: ConsolidatedCapitalGovernanceReport,
    metrics: any
  ): {
    thesis: string;
    tensions: string[];
    pressures: string[];
    structuralRisks: string[];
  } {
    const tensions: string[] = [];
    const pressures: string[] = [];
    const structuralRisks: string[] = [];

    // Evaluate DRE health (Absorção e Margem)
    const isEbitdaPositive = ebitda > 0;
    const isNetIncomePositive = lucroLiquido > 0;
    const margemEbitda = metrics?.margemEbitda ?? 0;

    let dreSummaryText = '';
    if (isEbitdaPositive) {
      if (margemEbitda > 0.15) {
        dreSummaryText = 'viabilidade comercial robusta e boa eficiência de margem';
      } else {
        dreSummaryText = 'viabilidade comercial parcial, mas com margens estreitas e baixa absorção estrutural';
        pressures.push('Estrutura de custos fixos pressionando margem líquida');
      }
    } else {
      dreSummaryText = 'destruição operacional de valor, indicando ausência de absorção da estrutura fixa atual';
      pressures.push('Prejuízo operacional recorrente');
      structuralRisks.push('Modelo de negócios operando abaixo do ponto de equilíbrio (breakeven)');
    }

    // Evaluate BP Health (Capital Structure & Working Capital)
    let bpSummaryText = '';
    const at = bpSummary?.ativoTotal || 0;
    const pl = bpSummary?.patrimonioLiquido || 0;
    const pc = bpSummary?.passivoCirculante || 0;
    const autonomy = at > 0 ? pl / at : 0;
    const currentLiquidity = pc > 0 ? (bpSummary?.ativoCirculante || 0) / pc : 1;

    if (autonomy < 0.2) {
      bpSummaryText = 'alta dependência de capital de terceiros';
      structuralRisks.push('Descapitalização estrutural do balanço');
    } else if (autonomy > 0.5) {
      bpSummaryText = 'autonomia patrimonial confortável';
    } else {
      bpSummaryText = 'alavancagem moderada de capital';
    }

    if (currentLiquidity < 1.0) {
      pressures.push('Falta de cobertura de passivos circulantes com ativos circulantes');
    }

    // Evaluate DFC Health
    let dfcSummaryText = '';
    if (cashFlowReport.isAvailable) {
      const fco = cashFlowReport.operational.operatingCashFlow;
      const runway = cashFlowReport.treasury.runwayMonths;
      const dependency = cashFlowReport.funding.dependencyClassification;

      if (fco > 0) {
        if (runway !== null && runway < 6) {
          dfcSummaryText = 'geração de caixa operacional positiva, porém com runway financeiro limitado';
          pressures.push('Runway de caixa curto, exigindo conservação de liquidez');
        } else {
          dfcSummaryText = 'geração operacional saudável sustentando a liquidez';
        }
      } else {
        dfcSummaryText = 'consumo operacional de caixa e pressão progressiva de liquidez';
        pressures.push('Drenagem de liquidez pela operação');
        if (dependency === 'CRÍTICA' || dependency === 'ELEVADA') {
          structuralRisks.push('Operação mantida artificialmente por fomento externo');
        }
      }
    } else {
      dfcSummaryText = 'indisponibilidade de análise de fluxo de caixa';
    }

    // Evaluate DLPA/DMPL Health
    let dlpaSummaryText = '';
    if (capitalGovernanceReport.isAvailable) {
      const retention = capitalGovernanceReport.retention.retentionEfficiency;
      const distribution = capitalGovernanceReport.distribution.distributionDiscipline;
      const preservation = capitalGovernanceReport.preservation.preservationStatus;

      if (preservation === 'EROSÃO_SEVERA' || preservation === 'EROSÃO_PARCIAL') {
        dlpaSummaryText = 'e erosão patrimonial devido a retiradas desbalanceadas ou prejuízos';
        structuralRisks.push('Erosão contínua do Patrimônio Líquido');
      } else if (retention === 'INSUFICIENTE' || retention === 'CRÍTICA') {
        dlpaSummaryText = 'e retenção insuficiente de capital para fortalecimento de reservas';
        pressures.push('Distribuição ou drenagem esgotando lucros acumulados');
      } else {
        dlpaSummaryText = 'e postura prudente de retenção para fortalecimento institucional';
      }
    } else {
      dlpaSummaryText = 'sem dados de governança societária para consolidar';
    }

    // Detect Cross-Statement Tensions
    if (isEbitdaPositive && cashFlowReport.isAvailable && cashFlowReport.operational.operatingCashFlow < 0) {
      tensions.push('Lucro sem caixa: EBITDA positivo não se traduz em geração operacional de caixa devido ao giro.');
    }
    if (isNetIncomePositive && capitalGovernanceReport.isAvailable && capitalGovernanceReport.preservation.equityChange < 0) {
      tensions.push('Crescimento sem retenção: Lucro positivo acompanhado de descapitalização líquida de reservas.');
    }
    if (bpSummary && bpSummary.estoques && cashFlowReport.isAvailable && cashFlowReport.conversion.inventoryDrainImpact !== null && cashFlowReport.conversion.inventoryDrainImpact > 0.25) {
      tensions.push('Estoques retendo liquidez: Alta concentração de capital de giro imobilizada em inventário.');
    }
    if (capitalGovernanceReport.isAvailable && capitalGovernanceReport.distribution.distributionDiscipline === 'DRENAGEM') {
      tensions.push('Drenagem societária: Saída de dividendos incompatível com lucro do período, reduzindo PL.');
    }

    // Standardizing Thesis Narrative based on Convergence of Indicators
    let thesis = '';
    if (!isEbitdaPositive) {
      thesis = `A operação apresenta sinais de destruição operacional de valor, sem absorção estrutural da atual despesa fixa, combinada com ${dfcSummaryText} ${dlpaSummaryText}.`;
    } else {
      thesis = `A operação apresenta sinais de ${dreSummaryText}, acompanhada de ${dfcSummaryText} ${dlpaSummaryText}, e apresentando ${bpSummaryText}.`;
    }

    // Clean up duplicates
    const uniqueTensions = Array.from(new Set(tensions));
    const uniquePressures = Array.from(new Set(pressures));
    const uniqueStructuralRisks = Array.from(new Set(structuralRisks));

    return {
      thesis,
      tensions: uniqueTensions,
      pressures: uniquePressures,
      structuralRisks: uniqueStructuralRisks
    };
  }
}
