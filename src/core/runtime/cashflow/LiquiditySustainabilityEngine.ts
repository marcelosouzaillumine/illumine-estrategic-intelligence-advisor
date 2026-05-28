import { LiquiditySustainabilityMetrics } from './cashflow-types';

export class LiquiditySustainabilityEngine {
  public static calculate(
    cashFlowDoc: any,
    runwayMonths: number | null,
    operatingCashFlow: number
  ): LiquiditySustainabilityMetrics {
    if (!cashFlowDoc) {
      return {
        lcr: null,
        sustainabilityScore: 0,
        sustainabilityClassification: 'FALTA_DADO',
        operationalCoverageMonths: null,
        narrative: 'Dados de DFC não fornecidos para análise de sustentabilidade.'
      };
    }

    const currentCashBalance = Number(cashFlowDoc.currentCashBalance ?? cashFlowDoc.saldoCaixa ?? 0);
    const shortTermObligations = Number(cashFlowDoc.shortTermObligations ?? cashFlowDoc.obrigacoesCurtoPrazo ?? 0);
    const opex = Number(cashFlowDoc.recurringFixedCashOutflows ?? cashFlowDoc.saidasFixas ?? 0);

    // LCR = Liquidez Imediata / Obrigações de CP (Liquidity Coverage Ratio proxy)
    const lcr = shortTermObligations > 0 ? (currentCashBalance / shortTermObligations) : null;

    // Operational coverage in months (how many months of fixed opex the cash balance can cover directly)
    const operationalCoverageMonths = opex > 0 ? (currentCashBalance / opex) : null;

    // Sustainability score logic: start with base 100, apply deductibles
    let score = 100;

    // 1. Runway deduction
    if (runwayMonths !== null) {
      if (runwayMonths < 3) {
        score -= 40;
      } else if (runwayMonths < 6) {
        score -= 20;
      } else if (runwayMonths < 12) {
        score -= 5;
      }
    } else {
      // If burning cash is 0 or negative, but operatingCashFlow is negative
      if (operatingCashFlow < 0) {
        score -= 10;
      }
    }

    // 2. LCR deduction
    if (lcr !== null) {
      if (lcr < 0.5) {
        score -= 30;
      } else if (lcr < 1.0) {
        score -= 15;
      } else if (lcr < 1.5) {
        score -= 5;
      }
    }

    // 3. Operating cash flow deduction
    if (operatingCashFlow < 0) {
      score -= 15;
    }

    // Bind score between 0 and 100
    const sustainabilityScore = Math.max(0, Math.min(100, score));

    let sustainabilityClassification: 'SUSTENTÁVEL' | 'SENSÍVEL' | 'FRÁGIL' | 'VULNERÁVEL' | 'FALTA_DADO' = 'SUSTENTÁVEL';
    if (sustainabilityScore >= 80) {
      sustainabilityClassification = 'SUSTENTÁVEL';
    } else if (sustainabilityScore >= 60) {
      sustainabilityClassification = 'SENSÍVEL';
    } else if (sustainabilityScore >= 40) {
      sustainabilityClassification = 'FRÁGIL';
    } else {
      sustainabilityClassification = 'VULNERÁVEL';
    }

    // Narrative
    let narrative = '';
    if (sustainabilityClassification === 'SUSTENTÁVEL') {
      narrative = 'A estrutura de caixa apresenta sustentabilidade sólida. As reservas atuais e a geração operacional suportam as pressões de curto prazo com margem de segurança confortável.';
    } else if (sustainabilityClassification === 'SENSÍVEL') {
      narrative = 'Sustentabilidade de liquidez sob atenção. Existe equilíbrio delicado entre as obrigações imediatas e o saldo disponível, deixando a operação vulnerável a choques de receita.';
    } else if (sustainabilityClassification === 'FRÁGIL') {
      narrative = 'Liquidez operacional fragilizada. O caixa não possui margem para absorver atrasos de clientes ou surpresas operacionais sem demandar capital externo emergencial.';
    } else {
      narrative = 'Estrutura financeira em estado de extrema vulnerabilidade. O consumo acelerado de caixa e a baixa cobertura de passivos CP indicam risco iminente de incapacidade de pagamentos.';
    }

    if (operationalCoverageMonths !== null) {
      narrative += ` O caixa atual cobre ${operationalCoverageMonths.toFixed(1)} meses de custos fixos operacionais da estrutura (OPEX).`;
    }

    return {
      lcr,
      sustainabilityScore,
      sustainabilityClassification,
      operationalCoverageMonths,
      narrative
    };
  }
}
