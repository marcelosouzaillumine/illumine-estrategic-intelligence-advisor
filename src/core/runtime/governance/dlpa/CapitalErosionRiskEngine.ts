export class CapitalErosionRiskEngine {
  static evaluate(accumulatedLosses: number, capitalSocial: number) {
    if (capitalSocial <= 0) {
      return {
        value: 0,
        classification: 'Não Aplicável',
        narrative: 'Capital Social não identificado ou inválido.',
        rationale: 'O risco de erosão não pode ser medido sem a base de capital original.',
        capitalConsumedAmount: 0,
        sourceMetrics: { accumulatedLosses, capitalSocial },
        confidenceLevel: 'LOW'
      };
    }

    const loss = accumulatedLosses < 0 ? Math.abs(accumulatedLosses) : 0;
    const value = loss / capitalSocial;

    let classification = 'Baixo';
    if (value >= 0.50) classification = 'Crítico';
    else if (value >= 0.25) classification = 'Elevado';
    else if (value >= 0.10) classification = 'Moderado';

    const narrative = value >= 0.50
      ? 'Mais de metade do capital originalmente aportado foi consumido pela absorção de prejuízos acumulados.'
      : 'O consumo do capital aportado encontra-se sob controle fiduciário.';

    const rationale = `abs(Prejuízos Acumulados) (R$ ${loss}) ÷ Capital Social (R$ ${capitalSocial}).`;

    return {
      value,
      classification,
      narrative,
      rationale,
      capitalConsumedAmount: loss,
      sourceMetrics: { accumulatedLosses, capitalSocial },
      confidenceLevel: 'HIGH'
    };
  }
}
