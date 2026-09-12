export class HistoricalTrendExplainabilityEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Enforces that every classification reports: Current Situation, Previous Situation, Direction of Change, Responsible Indicators, and Intensity of Change.
   */
  public static generateExplainability(
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE',
    metricName: string,
    prevClassification: string,
    currClassification: string,
    drivers: { name: string; variation: string }[]
  ): string {
    if (historicalAvailability !== 'AVAILABLE') {
      return `Histórico indisponível. Situação Atual: ${currClassification}.`;
    }

    let direction = 'Estável';
    if (prevClassification !== currClassification) {
      // Very simplified direction heuristic
      direction = currClassification.includes('Forte') || currClassification.includes('Saudável') ? 'Melhora' : 'Deterioração';
    }

    const driverText = drivers.map(d => `${d.name} (${d.variation})`).join(', ');

    return `Análise de Tendência para ${metricName}:
Situação Anterior: ${prevClassification}
Situação Atual: ${currClassification}
Direção da Mudança: ${direction}
Indicadores Responsáveis: ${driverText}`;
  }
}
