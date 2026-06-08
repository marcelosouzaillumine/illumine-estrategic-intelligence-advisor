export class BalanceSheetLongitudinalNarrativeGenerator {
  /**
   * Automatically explains patrimonial evolution without overwriting the current year analysis.
   */
  public static generate(
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE',
    improvedMetrics: string[],
    deterioratedMetrics: string[]
  ): string {
    if (historicalAvailability === 'INSUFFICIENT') {
      return 'Base histórica insuficiente para análise longitudinal evolutiva.';
    }
    if (historicalAvailability === 'UNRELIABLE') {
      return 'Dados históricos não confiáveis. Análise longitudinal suspensa.';
    }

    if (improvedMetrics.length === 0 && deterioratedMetrics.length === 0) {
      return 'A estrutura patrimonial manteve-se estável em relação ao exercício anterior, sem oscilações materiais.';
    }

    let narrative = 'Em relação ao exercício anterior, a organização apresentou ';
    
    if (improvedMetrics.length > deterioratedMetrics.length) {
      narrative += `evolução favorável, refletindo melhora estrutural principalmente em: ${improvedMetrics.join(', ')}.`;
      if (deterioratedMetrics.length > 0) {
        narrative += ` Observou-se, contudo, retração secundária em: ${deterioratedMetrics.join(', ')}.`;
      }
    } else if (deterioratedMetrics.length > improvedMetrics.length) {
      narrative += `deterioração patrimonial, pressionada negativamente por: ${deterioratedMetrics.join(', ')}.`;
      if (improvedMetrics.length > 0) {
        narrative += ` Como contraponto positivo, houve avanço em: ${improvedMetrics.join(', ')}.`;
      }
    } else {
      narrative += `evolução mista, equilibrando avanços em ${improvedMetrics.join(', ')} com retrações em ${deterioratedMetrics.join(', ')}.`;
    }

    return narrative;
  }
}
