export class CapitalPreservationStatusEngine {
  static evaluate(endingEquity: number, capitalSocial: number) {
    if (capitalSocial <= 0) {
      return {
        value: 0,
        classification: 'Não Aplicável',
        narrative: 'Capital Social não identificado ou inválido.',
        rationale: 'O capital remanescente não pode ser medido sem a base de capital original.',
        sourceMetrics: { endingEquity, capitalSocial },
        confidenceLevel: 'LOW'
      };
    }

    const value = endingEquity / capitalSocial;
    let classification = 'Capital Erodido';
    if (value >= 0.90) classification = 'Capital Preservado';
    else if (value >= 0.75) classification = 'Capital Parcialmente Preservado';
    else if (value >= 0.50) classification = 'Capital Fragilizado';
    else if (value >= 0.25) classification = 'Capital Severamente Fragilizado';

    const narrative = `Dos recursos originalmente aportados pelos sócios, aproximadamente ${(value * 100).toFixed(1).replace('.', ',')}% permanecem preservados no patrimônio líquido após absorção dos prejuízos acumulados.`;
    const rationale = `PL Final (R$ ${endingEquity}) ÷ Capital Social (R$ ${capitalSocial}).`;

    return {
      value,
      classification,
      narrative,
      rationale,
      sourceMetrics: { endingEquity, capitalSocial },
      confidenceLevel: 'HIGH'
    };
  }
}
