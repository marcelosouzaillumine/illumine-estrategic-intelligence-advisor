import { SegmentCode, SegmentThresholds } from './types';
import { SegmentIntelligenceRegistry } from './SegmentIntelligenceRegistry';

export class SegmentThresholdEngine {
  /**
   * Obtém as configurações de threshold base para um dado segmento
   */
  static getThresholdsForSegment(segmentCode: SegmentCode): SegmentThresholds {
    const registryEntry = SegmentIntelligenceRegistry[segmentCode];
    if (registryEntry) {
      return registryEntry.defaultThresholdProfiles;
    }
    // Fallback prudencial
    return SegmentIntelligenceRegistry['GENERIC_OPERATION'].defaultThresholdProfiles;
  }

  /**
   * Avalia a saúde da liquidez corrente baseada no setor
   */
  static evaluateCurrentLiquidity(segmentCode: SegmentCode, liquidityRatio: number): 'CRITICAL' | 'WARNING' | 'HEALTHY' {
    const thresholds = this.getThresholdsForSegment(segmentCode);
    if (liquidityRatio < thresholds.minCurrentLiquidity) {
      return 'CRITICAL';
    }
    if (liquidityRatio < thresholds.healthyCurrentLiquidity) {
      return 'WARNING';
    }
    return 'HEALTHY';
  }

  /**
   * Avalia o risco de imobilização em estoques
   */
  static evaluateInventoryDependency(segmentCode: SegmentCode, inventoryToAssetsRatio: number): 'LOW' | 'MODERATE' | 'HIGH' {
    const thresholds = this.getThresholdsForSegment(segmentCode);
    // tolerance factor
    if (inventoryToAssetsRatio > thresholds.maxInventoryToAssets * 1.5) {
      return 'HIGH';
    }
    if (inventoryToAssetsRatio > thresholds.maxInventoryToAssets) {
      return 'MODERATE';
    }
    return 'LOW';
  }

  /**
   * Avalia o nível de endividamento de ciclo imediato
   */
  static evaluateShortTermDebtPressure(segmentCode: SegmentCode, shortTermDebtToAssets: number): 'SAFE' | 'WARNING' | 'CRITICAL' {
    const thresholds = this.getThresholdsForSegment(segmentCode);
    if (shortTermDebtToAssets > thresholds.maxShortTermDebtToAssets * 1.5) {
      return 'CRITICAL';
    }
    if (shortTermDebtToAssets > thresholds.maxShortTermDebtToAssets) {
      return 'WARNING';
    }
    return 'SAFE';
  }

  /**
   * Avalia a suficiência de caixa operacional
   */
  static evaluateCashReserveDays(segmentCode: SegmentCode, cashReserveDays: number): 'CRITICAL' | 'WARNING' | 'HEALTHY' {
    const thresholds = this.getThresholdsForSegment(segmentCode);
    if (cashReserveDays < (thresholds.minOperatingCashReserveDays / 2)) {
      return 'CRITICAL';
    }
    if (cashReserveDays < thresholds.minOperatingCashReserveDays) {
      return 'WARNING';
    }
    return 'HEALTHY';
  }
}
