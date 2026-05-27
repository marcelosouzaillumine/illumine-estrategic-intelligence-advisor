import { StructuralCapitalSignal } from './types';

export class StructuralCapitalScoreAdapter {
  /**
   * Calcula o Delta (ajuste) a ser aplicado no composite score.
   * Não aplica diretamente, apenas retorna o valor para o Orchestrator.
   * Intervalo possível: -20 a +5.
   */
  static calculateDelta(
    activeSignals: StructuralCapitalSignal[],
    realLiquidityStrength: number,
    supplierToInventory: number | null,
    immediateCoverageCapacityMonths: number
  ): number {
    let delta = 0;

    // --- PENALIZAÇÕES ---
    if (activeSignals.includes('HIGH_INVENTORY_LIQUIDITY_PRESSURE')) {
      // Ajuste varia de -5 a -10 dependendo de quão ruim for a liquidez imediata
      const penalty = immediateCoverageCapacityMonths < 0.5 ? -10 : -5;
      delta += penalty;
    }

    if (activeSignals.includes('HIGH_SUPPLIER_DEPENDENCY')) {
      delta += -5;
    }

    if (activeSignals.includes('CASH_COVERAGE_DEFICIT')) {
      delta += -8;
    }

    if (activeSignals.includes('HIGH_SHAREHOLDER_OPERATIONAL_INTERDEPENDENCE')) {
      delta += -5;
    }

    // --- BONIFICAÇÕES ---
    // Apenas aplica bonificação se não houver nenhum sinal ativo estrutural grave
    if (activeSignals.length === 0) {
      if (realLiquidityStrength > 0.5) {
        delta += 3;
      }
      if (supplierToInventory !== null && supplierToInventory < 0.8 && immediateCoverageCapacityMonths > 1.0) {
        delta += 2; // Saudável + Caixa robusto
      }
    }

    // Cap Máximo
    delta = Math.max(delta, -20);
    // Cap Mínimo (Bonificação máxima +5)
    delta = Math.min(delta, 5);

    return delta;
  }
}
