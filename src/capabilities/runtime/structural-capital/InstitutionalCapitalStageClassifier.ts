import { StructuralCapitalSignal, StructuralCapitalStage } from './types';

export class InstitutionalCapitalStageClassifier {
  /**
   * Classifica a operação estruturalmente através de limiares rígidos (determinísticos).
   * Sem inferência heurística obscura.
   */
  static classify(activeSignals: StructuralCapitalSignal[]): StructuralCapitalStage {
    
    // Filtramos os sinais considerados HIGH/CRITICAL versus LOW/MODERATE
    const highCriticalSignals = [
      'CASH_COVERAGE_DEFICIT',
      'LOW_REAL_LIQUIDITY',
      'HIGH_SUPPLIER_DEPENDENCY',
      'CAPITAL_COMPRESSION_ACTIVE',
      'INVENTORY_CAPITAL_IMMOBILIZATION'
    ];

    const presentHighCriticalSignals = activeSignals.filter(s => highCriticalSignals.includes(s));

    if (presentHighCriticalSignals.length >= 2) {
      return 'CAPITAL_IMBALANCED_OPERATION';
    }

    if (activeSignals.includes('HIGH_SUPPLIER_DEPENDENCY') || activeSignals.includes('SUPPLIER_OPERATIONAL_FRAGILITY')) {
      return 'SUPPLIER_DEPENDENT_OPERATION';
    }

    if (activeSignals.includes('LOW_REAL_LIQUIDITY') || activeSignals.includes('CASH_COVERAGE_DEFICIT')) {
      return 'LIQUIDITY_TENSIONED_OPERATION';
    }

    if (activeSignals.length > 0) {
      // Tem sinais ativos, mas nenhum dos mais graves
      return 'OPERATIONAL_STABILITY_WITH_CAPITAL_PRESSURE';
    }

    // Nenhum sinal
    return 'STRUCTURALLY_FUNCTIONAL_OPERATION';
  }
}
