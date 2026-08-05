import { CapitalStructureDependency, CapitalStructureResult } from '../types/financial-domain.types';
import { NormalizedBalanceSheet } from '../models/NormalizedBalanceSheet';

export class CapitalStructureEngine {
  static analyze(data: NormalizedBalanceSheet): CapitalStructureResult {
    const totalAssets = data.assets.total;
    const equity = data.equity.total;
    const liabilities = data.liabilities.total;
    const nonCurrentAssets = data.assets.nonCurrentAssets;

    const dependencyRatio = totalAssets > 0 ? (liabilities / totalAssets) : 0;
    const autonomyRatio = totalAssets > 0 ? (equity / totalAssets) : 0;
    const patrimonialLeverage = equity > 0 ? (totalAssets / equity) : 0;
    const permanentAssetCoverage = nonCurrentAssets !== 0 ? (equity / nonCurrentAssets) : 0;

    let dependencyClassification: CapitalStructureDependency = 'VERY_LOW';
    // Improved Leverage heuristics (avoid 'Forte alavancagem financeira' solely on dependency > 0.8 without context)
    // A more contextual approach is used here, though further reasoning is handled by the Assurance Engine.
    if (dependencyRatio > 0.8) {
      dependencyClassification = 'CRITICAL';
    } else if (dependencyRatio > 0.6) {
      dependencyClassification = 'HIGH';
    } else if (dependencyRatio > 0.3) {
      dependencyClassification = 'MODERATE';
    } else if (dependencyRatio > 0.1) {
      dependencyClassification = 'LOW';
    } else {
      dependencyClassification = 'VERY_LOW';
    }

    return {
      dependencyClassification,
      dependencyRatio,
      autonomyRatio,
      patrimonialLeverage,
      permanentAssetCoverage
    };
  }
}
