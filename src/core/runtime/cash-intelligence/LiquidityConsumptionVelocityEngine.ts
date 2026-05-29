import { InstitutionalCashSignal } from './types';

export class LiquidityConsumptionVelocityEngine {
  public static evaluate(fco: number, availableCash: number): InstitutionalCashSignal {
    let classification = 'HEALTHY' as any;
    let narrative = 'A operação não consome seu estoque de liquidez (burn rate neutro/positivo).';
    let months = 999;

    if (fco < 0) {
      const burnRate = Math.abs(fco) / 12; // average monthly burn
      months = burnRate > 0 ? availableCash / burnRate : 0;

      if (months < 6) {
        classification = 'CRITICAL';
        narrative = `Velocidade de consumo severa. Runway estimado em ${months.toFixed(1)} meses considerando FCO médio negativo.`;
      } else if (months < 12) {
        classification = 'DETERIORATING';
        narrative = `Pressão temporal de liquidez. Runway estimado em ${months.toFixed(1)} meses.`;
      } else {
        classification = 'ATTENTION';
        narrative = 'Operação em queima, mas estoque de caixa provê suporte estrutural acima de 12 meses.';
      }
    }

    return {
      id: 'liquidityConsumptionVelocity',
      label: 'Velocidade de Consumo de Liquidez',
      classification,
      confidence: 'HIGH',
      value: months,
      displayValue: months === 999 ? 'N/A' : `${months.toFixed(1)}m`,
      narrative,
      lineage: ['DFC.FCO', 'BP.Disponibilidades'],
      disclosures: []
    };
  }
}
