import { FundingDependencyMetrics } from './cashflow-types';

export class FundingDependencyEngine {
  public static calculate(
    cashFlowDoc: any
  ): FundingDependencyMetrics {
    if (!cashFlowDoc) {
      return {
        fundingInflows: 0,
        partnerInjections: 0,
        totalExternalFunding: 0,
        dependencyClassification: 'FALTA_DADO',
        fundingDependencyRatio: null,
        debtAmortizationCoverage: null,
        narrative: 'Dados de DFC não fornecidos para análise de dependência de fomento.'
      };
    }

    const fundingInflows = Number(cashFlowDoc.fundingInflows ?? cashFlowDoc.captacoesEmprestimos ?? 0);
    const partnerInjections = Number(cashFlowDoc.partnerCapitalInjections ?? cashFlowDoc.aportesSocios ?? 0);
    const operatingCashFlow = Number(cashFlowDoc.operatingCashFlow ?? cashFlowDoc.caixaOperacional ?? 0);
    const debtAmortization = Number(cashFlowDoc.debtAmortization ?? cashFlowDoc.amortizacoesDividas ?? 0);

    const totalExternalFunding = fundingInflows + partnerInjections;

    // Dependency Ratio: external funding / total inflows
    let fundingDependencyRatio: number | null = null;
    const totalInflows = totalExternalFunding + Math.max(0, operatingCashFlow);
    if (totalInflows > 0) {
      fundingDependencyRatio = totalExternalFunding / totalInflows;
    }

    // Debt Amortization Coverage Ratio
    let debtAmortizationCoverage: number | null = null;
    if (debtAmortization > 0) {
      debtAmortizationCoverage = operatingCashFlow / debtAmortization;
    }

    // Classify dependency
    let dependencyClassification: 'NENHUMA' | 'BAIXA' | 'MODERADA' | 'ELEVADA' | 'CRÍTICA' | 'FALTA_DADO' = 'NENHUMA';

    if (totalExternalFunding > 0) {
      if (operatingCashFlow <= 0) {
        dependencyClassification = 'CRÍTICA'; // Sustained purely by external capital injections while operating cash is burning
      } else if (fundingDependencyRatio !== null && fundingDependencyRatio > 0.6) {
        dependencyClassification = 'ELEVADA';
      } else if (fundingDependencyRatio !== null && fundingDependencyRatio > 0.3) {
        dependencyClassification = 'MODERADA';
      } else {
        dependencyClassification = 'BAIXA';
      }
    } else {
      if (operatingCashFlow < 0) {
        // Burning cash, but no funding yet (running down cash reserves)
        dependencyClassification = 'MODERADA';
      } else {
        dependencyClassification = 'NENHUMA';
      }
    }

    // Amortization pressure override
    if (debtAmortization > 0 && operatingCashFlow > 0 && debtAmortizationCoverage !== null && debtAmortizationCoverage < 1.0) {
      // Operating cash flow cannot cover debt amortization
      if (dependencyClassification === 'NENHUMA' || dependencyClassification === 'BAIXA') {
        dependencyClassification = 'MODERADA';
      } else if (dependencyClassification === 'MODERADA') {
        dependencyClassification = 'ELEVADA';
      }
    }

    // Narrative
    let narrative = '';
    if (dependencyClassification === 'CRÍTICA') {
      narrative = 'Dependência crítica de capital externo. A operação consome caixa líquido e sobrevive inteiramente de novos empréstimos bancários ou injeções financeiras de sócios.';
    } else if (dependencyClassification === 'ELEVADA') {
      narrative = 'Dependência elevada de funding de terceiros. Mais de 60% da recomposição de liquidez decorre de novos passivos, onerando potencialmente a estrutura de capital futura.';
    } else if (dependencyClassification === 'MODERADA') {
      narrative = 'Dependência moderada de recursos externos. Embora a empresa possua geração própria, ela necessita pontualmente de fomento ou alongamento de dívidas para equalizar o fluxo.';
    } else if (dependencyClassification === 'BAIXA') {
      narrative = 'Baixa dependência de fomento externo. A operação se financia majoritariamente sozinha, utilizando captações apenas para alavancagem planejada ou oportunidades.';
    } else {
      narrative = 'Independência financeira operacional completa. Nenhuma captação ou aporte foi realizado no ciclo analisado, sustentando-se inteiramente pela geração orgânica.';
    }

    if (debtAmortization > 0) {
      if (debtAmortizationCoverage !== null && debtAmortizationCoverage >= 1.0) {
        narrative += ` A geração de caixa operacional cobre confortavelmente a amortização das dívidas existentes (${debtAmortizationCoverage.toFixed(1)}x).`;
      } else {
        narrative += ` Alerta: o caixa operacional gerado não é suficiente para honrar a amortização contratada de dívidas, pressionando as reservas líquidas do caixa acumulado.`;
      }
    }

    return {
      fundingInflows,
      partnerInjections,
      totalExternalFunding,
      dependencyClassification,
      fundingDependencyRatio,
      debtAmortizationCoverage,
      narrative
    };
  }
}
