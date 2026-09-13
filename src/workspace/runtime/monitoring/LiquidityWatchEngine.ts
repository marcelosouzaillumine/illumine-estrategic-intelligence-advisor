import { LiquidityHealthSignal } from './MonitoringTypes';

export class LiquidityWatchEngine {
  /**
   * Avalia runway passivamente baseado nas saídas do orquestrador financeiro.
   */
  static evaluate(financialOutput: any, groupId: string): LiquidityHealthSignal {
    // Mock. Na vida real: caixa disponível / queima de caixa mensal
    return {
      groupId,
      healthScore: 65,
      runwayMonths: 4.5,
      isDeteriorating: true,
      timestamp: new Date().toISOString()
    };
  }
}
