import { SignalHorizon } from '../../contracts/IntelligenceSignal';

export class SignalHorizonEngine {
  /**
   * Determine the semantic horizon based on the economic nature of the exposure.
   */
  static evaluate(category: string, metricId: string): SignalHorizon {
    const categoryLower = category.toLowerCase();
    
    // Liquidez -> Curto prazo
    if (categoryLower.includes('liquidity') || categoryLower.includes('liquidez') || metricId.includes('liquidity')) {
      return 'short_term';
    }

    // Estoques / Capital de giro -> Médio prazo
    if (categoryLower.includes('working_capital') || categoryLower.includes('giro') || categoryLower.includes('estoque') || metricId.includes('inventory')) {
      return 'medium_term';
    }

    // Estrutura de capital / Solvência -> Longo prazo
    if (categoryLower.includes('capital_structure') || categoryLower.includes('solvency') || categoryLower.includes('estrutura') || metricId.includes('debt')) {
      return 'long_term';
    }

    return 'unknown';
  }
}
