export class DLPACapitalConsumptionEngine {
  static evaluate(accumulatedLosses: number, capitalSocial: number) {
    if (capitalSocial <= 0) {
      return {
        value: 0,
        classification: 'Não Aplicável',
        narrative: 'Capital Social não identificado.',
        rationale: 'Consumo não pode ser medido sem a base de capital inicial.',
        sourceMetrics: { accumulatedLosses, capitalSocial },
        confidenceLevel: 'LOW'
      };
    }

    // Usually accumulatedLosses is negative or zero, but we take the absolute value. 
    // If accumulatedLosses represents retained earnings and is positive, consumption is 0.
    const loss = accumulatedLosses < 0 ? Math.abs(accumulatedLosses) : 0;
    const value = loss / capitalSocial;
    
    let classification = 'Baixo';
    if (value > 0.75) classification = 'Erosão Patrimonial';
    else if (value >= 0.40) classification = 'Consumo de Capital';
    else if (value >= 0.25) classification = 'Atenção';

    const narrative = value >= 0.40 
      ? `Parcela relevante do capital originalmente aportado pelos sócios foi consumida por prejuízos acumulados.`
      : `O consumo do capital aportado encontra-se em patamares controlados ou baixos.`;
      
    const rationale = `abs(Prejuízos Acumulados) ÷ Capital Social. Perda identificada de R$ ${loss}.`;

    return {
      value,
      classification,
      narrative,
      rationale,
      sourceMetrics: { accumulatedLosses, capitalSocial },
      confidenceLevel: 'HIGH'
    };
  }
}
