export class DLPAEquityFormationQualityEngine {
  static evaluate(dependencyValue: number, hasLosses: boolean) {
    let classification = 'Orgânico';
    
    if (dependencyValue > 1.5 && hasLosses) {
      classification = 'Dependente de Capitalização';
    } else if (dependencyValue > 1.0 && !hasLosses) {
      classification = 'Misto';
    } else if (hasLosses) {
      classification = 'Fragilizado por Prejuízos';
    }

    let narrative = 'O patrimônio líquido foi sustentado predominantemente por capitalização societária, não por geração acumulada de resultados.';
    if (classification === 'Orgânico') {
      narrative = 'A formação do patrimônio é orgânica, majoritariamente sustentada por retenção de resultados próprios.';
    } else if (classification === 'Misto') {
      narrative = 'O patrimônio possui formação mista, com contribuição equilibrada de capital dos sócios e geração de caixa.';
    } else if (classification === 'Fragilizado por Prejuízos') {
      narrative = 'A qualidade do patrimônio é reduzida pela absorção histórica de prejuízos recorrentes.';
    }

    return {
      value: classification,
      classification,
      narrative,
      rationale: `Análise baseada no índice de dependência (${dependencyValue.toFixed(2)}) e presença de prejuízos (${hasLosses ? 'Sim' : 'Não'}).`,
      sourceMetrics: { dependencyValue, hasLosses },
      confidenceLevel: 'HIGH'
    };
  }
}
