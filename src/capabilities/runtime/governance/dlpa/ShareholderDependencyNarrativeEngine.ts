export class ShareholderDependencyNarrativeEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(capitalSocial: number, endingEquity: number) {
    if (endingEquity <= 0) {
      return {
        value: Infinity,
        classification: 'Crítica',
        narrative: 'O patrimônio líquido está negativo (insolvência), indicando que todo o capital aportado foi consumido e a operação depende inteiramente de novos aportes dos sócios.',
        rationale: `Capital Social (R$ ${capitalSocial}) ÷ PL Final (R$ ${endingEquity}).`,
        sourceMetrics: { capitalSocial, endingEquity },
        confidenceLevel: 'HIGH'
      };
    }

    const value = capitalSocial / endingEquity;
    let classification = 'Baixa';
    if (value > 2.0) classification = 'Crítica';
    else if (value >= 1.5) classification = 'Alta';
    else if (value >= 1.2) classification = 'Moderada';

    const narrative = `Para cada R$ 1,00 de patrimônio líquido atualmente existente, foram necessários R$ ${value.toFixed(2).replace('.', ',')} de capital aportado pelos sócios.`;
    const rationale = `Capital Social (R$ ${capitalSocial}) ÷ PL Final (R$ ${endingEquity}).`;

    return {
      value,
      classification,
      narrative,
      rationale,
      sourceMetrics: { capitalSocial, endingEquity },
      confidenceLevel: 'HIGH'
    };
  }
}
