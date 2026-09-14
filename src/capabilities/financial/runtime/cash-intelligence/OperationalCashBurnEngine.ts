import { OperationalCashBurn, CashConfidenceLevel } from './CashIntelligenceTypes';

export class OperationalCashBurnEngine {
  public static evaluate(
    fco: number,
    monthsCount: number,
    confidenceLevel: CashConfidenceLevel
  ): OperationalCashBurn {
    const isBurning = fco < 0;
    const monthlyBurnRate = isBurning ? Math.abs(fco) / (monthsCount || 12) : 0;
    const annualBurnRate = monthlyBurnRate * 12;

    let cashConsumptionIntensity: OperationalCashBurn['cashConsumptionIntensity'] = 'NAO_APLICAVEL';
    let rationale = 'A operação gerou caixa líquido positivo no período, não apresentando consumo operacional crônico.';

    if (isBurning) {
      if (annualBurnRate > 1000000) {
        cashConsumptionIntensity = 'CRITICA';
      } else if (annualBurnRate > 250000) {
        cashConsumptionIntensity = 'ALTA';
      } else if (annualBurnRate > 50000) {
        cashConsumptionIntensity = 'MODERADA';
      } else {
        cashConsumptionIntensity = 'BAIXA';
      }

      const formattedAnual = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(annualBurnRate);
      rationale = `Mantido o padrão atual, a operação consumirá aproximadamente ${formattedAnual} por ano para sustentar sua atividade.`;
    }

    return {
      monthlyBurnRate,
      annualBurnRate,
      cashConsumptionIntensity,
      rationale,
      confidenceLevel,
      sourceMetrics: {
        fco,
        monthsCount
      }
    };
  }
}
