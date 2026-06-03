export class DLPAShareholderCapitalDependencyEngine {
  static evaluate(capitalSocial: number, endingEquity: number) {
    if (endingEquity <= 0) {
      return {
        value: 0,
        classification: 'Crítica (PL Negativo)',
        narrative: 'Patrimônio Líquido encontra-se a descoberto, dependência absoluta de injeção de capital.',
        rationale: 'Capital Social ÷ PL Final com PL menor ou igual a zero.',
        sourceMetrics: { capitalSocial, endingEquity },
        confidenceLevel: 'HIGH'
      };
    }

    if (capitalSocial <= 0) {
      return {
        value: 0,
        classification: 'Não Aplicável',
        narrative: 'Sem registro de capital social aportado.',
        rationale: 'Capital Social ÷ PL Final',
        sourceMetrics: { capitalSocial, endingEquity },
        confidenceLevel: 'LOW'
      };
    }

    const value = capitalSocial / endingEquity;
    
    let classification = 'Baixa';
    if (value > 2.0) classification = 'Alta'; // User specified 2.03x is "Alta"
    else if (value > 1.0) classification = 'Moderada';
    else if (value > 4.0) classification = 'Crítica'; // We adjust high bounds
    if (value > 3.0) classification = 'Crítica'; 

    const narrative = `Para cada R$ 1,00 de patrimônio líquido existente, houve necessidade histórica de R$ ${value.toFixed(2).replace('.', ',')} de capital aportado pelos sócios.`;
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
