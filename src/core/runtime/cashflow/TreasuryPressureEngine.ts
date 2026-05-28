import { TreasuryPressureMetrics } from './cashflow-types';

export class TreasuryPressureEngine {
  public static calculate(
    cashFlowDoc: any
  ): TreasuryPressureMetrics {
    if (!cashFlowDoc) {
      return {
        currentCashBalance: 0,
        monthlyCashBurnRate: 0,
        runwayMonths: null,
        runwayClassification: 'FALTA_DADO',
        daysToRupture: null,
        shortTermObligations: 0,
        pressureRatio: 0,
        pressureClassification: 'FALTA_DADO',
        narrative: 'Dados de DFC não fornecidos para análise de tesouraria.'
      };
    }

    const currentCashBalance = Number(cashFlowDoc.currentCashBalance ?? cashFlowDoc.saldoCaixa ?? 0);
    const monthlyCashBurnRate = Number(cashFlowDoc.monthlyCashBurnRate ?? cashFlowDoc.queimaMensal ?? 0);
    const shortTermObligations = Number(cashFlowDoc.shortTermObligations ?? cashFlowDoc.obrigacoesCurtoPrazo ?? 0);
    const overdueReceivables = Number(cashFlowDoc.overdueReceivables ?? cashFlowDoc.recebiveisVencidos ?? 0);
    const isSeasonal = !!(cashFlowDoc.seasonalityContext ?? cashFlowDoc.sazonalidade ?? false);

    // Calculate Runway in Months
    let runwayMonths: number | null = null;
    let runwayClassification: 'RUNWAY_SAUDAVEL' | 'RUNWAY_LIMITADO' | 'RUNWAY_CRITICO' | 'EXCESSO_CAIXA' | 'FALTA_DADO' = 'RUNWAY_SAUDAVEL';
    let daysToRupture: number | null = null;

    if (monthlyCashBurnRate > 0) {
      runwayMonths = currentCashBalance / monthlyCashBurnRate;
      daysToRupture = Math.round(runwayMonths * 30);

      if (runwayMonths < 3) {
        runwayClassification = 'RUNWAY_CRITICO';
      } else if (runwayMonths < 6) {
        runwayClassification = 'RUNWAY_LIMITADO';
      } else if (runwayMonths > 24) {
        runwayClassification = 'EXCESSO_CAIXA';
      } else {
        runwayClassification = 'RUNWAY_SAUDAVEL';
      }
    } else {
      // Not burning cash (operational surplus or net positive flow)
      runwayClassification = 'RUNWAY_SAUDAVEL';
    }

    // Short Term Obligations Pressure Ratio
    const pressureRatio = shortTermObligations > 0 ? (currentCashBalance / shortTermObligations) : 999;
    const overduePressure = overdueReceivables > (currentCashBalance * 0.5);

    let pressureClassification: 'BAIXA' | 'SENSÍVEL' | 'ELEVADA' | 'SEVERA' | 'FALTA_DADO' = 'BAIXA';

    if (pressureRatio < 0.5 && overduePressure) {
      pressureClassification = 'SEVERA';
    } else if (pressureRatio < 0.8 || overduePressure) {
      pressureClassification = 'ELEVADA';
    } else if (pressureRatio < 1.2) {
      pressureClassification = 'SENSÍVEL';
    } else {
      pressureClassification = 'BAIXA';
    }

    // Seasonality modulation: if seasonal context, soften the classification
    if (isSeasonal && pressureClassification !== 'BAIXA') {
      if (pressureClassification === 'SEVERA') {
        pressureClassification = 'ELEVADA';
      } else if (pressureClassification === 'ELEVADA') {
        pressureClassification = 'SENSÍVEL';
      }
    }

    // Narrative
    let narrative = '';
    if (runwayClassification === 'RUNWAY_CRITICO') {
      narrative = `Sobrevivência financeira sob risco iminente. O runway projetado é de apenas ${runwayMonths?.toFixed(1) ?? '0'} meses (${daysToRupture ?? 0} dias).`;
    } else if (runwayClassification === 'RUNWAY_LIMITADO') {
      narrative = `O runway de curto prazo (${runwayMonths?.toFixed(1) ?? '0'} meses) exige controle rígido de dispêndios e captação preventiva.`;
    } else if (runwayClassification === 'EXCESSO_CAIXA') {
      narrative = 'Ampla reserva financeira disponível. O caixa acumulado excede a queima operacional projetada por mais de 24 meses, sugerindo potencial ineficiência na alocação de liquidez.';
    } else {
      narrative = 'Autonomia de caixa confortável. O saldo atual cobre as operações recorrentes sem necessidade imediata de capital externo.';
    }

    if (pressureClassification === 'SEVERA') {
      narrative += ' A tesouraria está severamente asfixiada pelas obrigações de curtíssimo prazo e pelo volume de recebíveis inadimplentes ou vencidos.';
    } else if (pressureClassification === 'ELEVADA') {
      narrative += ' Existe pressão elevada sobre o caixa disponível devido a um descasamento relevante de curto prazo.';
    } else if (pressureClassification === 'SENSÍVEL') {
      narrative += ' O saldo de caixa está ajustado em relação às obrigações imediatas, exigindo monitoramento.';
    } else {
      narrative += ' O saldo bancário líquido está bem dimensionado para liquidar todas as obrigações operacionais de curto prazo.';
    }

    return {
      currentCashBalance,
      monthlyCashBurnRate,
      runwayMonths,
      runwayClassification,
      daysToRupture,
      shortTermObligations,
      pressureRatio,
      pressureClassification,
      narrative
    };
  }
}
