import { HistoricalCycleData } from '../institutional-memory/types';
import { StructuralPropagationVector, CycleMetrics, InstitutionalPropagationSeverity } from './types';

export class StructuralPropagationEngine {
  public static detect(cycles: HistoricalCycleData[], metrics: CycleMetrics[]): StructuralPropagationVector[] {
    if (cycles.length < 3) return [];

    const vectors: StructuralPropagationVector[] = [];
    const latest = metrics[metrics.length - 1];

    // Detect conditions in latest cycle
    const isStockExcessive = latest.ativoCirculante > 0 && (latest.estoques / latest.ativoCirculante) > 0.40;
    const isLiquidityPressed = latest.liqCorrente < 1.2;
    const isSupplierDependent = latest.passivoTotal > 0 && (latest.fornecedores / latest.passivoTotal) > 0.25;
    const isEquityAutonomousLow = latest.ativoTotal > 0 && (latest.patrimonioLiquido / latest.ativoTotal) < 0.35;

    // Check persistence of these conditions
    let stockExcessiveCycles = 0;
    let liquidityPressedCycles = 0;
    let supplierDependentCycles = 0;
    let equityLowCycles = 0;

    for (const m of metrics) {
      if (m.ativoCirculante > 0 && (m.estoques / m.ativoCirculante) > 0.40) stockExcessiveCycles++;
      if (m.liqCorrente < 1.2) liquidityPressedCycles++;
      if (m.passivoTotal > 0 && (m.fornecedores / m.passivoTotal) > 0.25) supplierDependentCycles++;
      if (m.ativoTotal > 0 && (m.patrimonioLiquido / m.ativoTotal) < 0.35) equityLowCycles++;
    }

    // Build vector 1: Estoques excessivos -> Liquidez operacional
    if (isStockExcessive && isLiquidityPressed) {
      const severity: InstitutionalPropagationSeverity = stockExcessiveCycles >= 3 ? 'HIGH' : 'MODERATE';
      vectors.push({
        vectorId: 'VEC-STOCK-LIQ',
        sourceLayer: 'OPERATIONAL',
        targetLayer: 'FINANCIAL',
        description: 'Acúmulo de estoques excessivos apresentou associação recorrente com a redução da liquidez operacional.',
        persistenceCycles: Math.min(stockExcessiveCycles, liquidityPressedCycles),
        severity
      });
    }

    // Build vector 2: Liquidez operacional -> Dependência de fornecedores
    if (isLiquidityPressed && isSupplierDependent) {
      const severity: InstitutionalPropagationSeverity = supplierDependentCycles >= 3 ? 'HIGH' : 'MODERATE';
      vectors.push({
        vectorId: 'VEC-LIQ-SUP',
        sourceLayer: 'FINANCIAL',
        targetLayer: 'OPERATIONAL',
        description: 'Pressão na liquidez operacional apresentou associação temporal com o aumento da dependência de fornecedores.',
        persistenceCycles: Math.min(liquidityPressedCycles, supplierDependentCycles),
        severity
      });
    }

    // Build vector 3: Dependência de fornecedores -> Autonomia patrimonial
    if (isSupplierDependent && isEquityAutonomousLow) {
      const severity: InstitutionalPropagationSeverity = equityLowCycles >= 3 ? 'CRITICAL' : 'HIGH';
      vectors.push({
        vectorId: 'VEC-SUP-EQ',
        sourceLayer: 'OPERATIONAL',
        targetLayer: 'EQUITY',
        description: 'A dependência recorrente de fornecedores foi acompanhada por redução na autonomia patrimonial.',
        persistenceCycles: Math.min(supplierDependentCycles, equityLowCycles),
        severity
      });
    }

    // Complete chain if all are active
    if (isStockExcessive && isLiquidityPressed && isSupplierDependent && isEquityAutonomousLow) {
      vectors.push({
        vectorId: 'VEC-COMPLETE-PROPAGATION',
        sourceLayer: 'OPERATIONAL',
        targetLayer: 'EQUITY',
        description: 'Observou-se associação estrutural consecutiva: estoques excessivos acompanhados por redução de liquidez operacional, elevando a dependência de fornecedores com impacto na autonomia patrimonial.',
        persistenceCycles: Math.min(stockExcessiveCycles, liquidityPressedCycles, supplierDependentCycles, equityLowCycles),
        severity: 'CRITICAL'
      });
    }

    return vectors;
  }
}
