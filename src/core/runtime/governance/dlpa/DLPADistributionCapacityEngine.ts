export class DLPADistributionCapacityEngine {
  static evaluate(netIncome: number, accumulatedLosses: number) {
    let classification = 'Livre';
    let narrative = 'Capacidade distributiva preservada, com base em geração de resultados positivos consistentes.';
    
    // Evaluate distribution capacity based on income and accumulated losses.
    if (netIncome <= 0) {
      if (accumulatedLosses < 0) {
        classification = 'Bloqueada';
        narrative = 'O exercício encerrou com prejuízo líquido, inexistindo lucro distribuível ou passível de retenção estratégica.';
      } else {
        classification = 'Restrita';
        narrative = 'Apesar de inexistir lucro no exercício, não há grandes prejuízos acumulados bloqueando estruturalmente o balanço.';
      }
    } else {
      if (accumulatedLosses < 0) {
        classification = 'Condicionada';
        narrative = 'Geração de lucro no exercício, mas a distribuição está condicionada à absorção prévia de prejuízos acumulados.';
      }
    }

    return {
      value: classification,
      classification,
      narrative,
      rationale: `Avaliação conjunta: Lucro Líquido = R$ ${netIncome}, Prejuízos Acumulados = R$ ${accumulatedLosses}.`,
      sourceMetrics: { netIncome, accumulatedLosses },
      confidenceLevel: 'HIGH'
    };
  }
}
