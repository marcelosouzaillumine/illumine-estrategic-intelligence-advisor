import {
  StructuralCapitalStage,
  InventoryLiquidityProfile,
  SupplierDependencyProfile,
  ShareholderExposureProfile,
  OperationalLiquidityProfile
} from './types';

export class StructuralNarrativeComposer {
  /**
   * Gera a narrativa institucional determinística, compondo fragmentos ativados
   * exclusivamente pelos sinais estruturais reais.
   * Não contém linguagem genérica de template nem previsões especulativas.
   */
  static compose(
    structuralStage: StructuralCapitalStage,
    inventoryProfile: InventoryLiquidityProfile,
    supplierProfile: SupplierDependencyProfile,
    shareholderProfile: ShareholderExposureProfile,
    liquidityProfile: OperationalLiquidityProfile
  ): string {

    // Base Frame
    let narrative = `A estrutura patrimonial evidencia ${this.translateStage(structuralStage)}`;

    const fragments: string[] = [];

    // Fragmento de Inventário
    if (inventoryProfile.activeSignals.length > 0) {
      fragments.push(`concentração relevante de capital em estoques (${(inventoryProfile.inventoryToCurrentAssetsRatio * 100).toFixed(1)}% do ativo circulante)`);
    }

    // Fragmento de Fornecedores
    if (supplierProfile.activeSignals.length > 0) {
      const level = supplierProfile.supplierOperationalFundingLevel;
      fragments.push(`dependência operacional de fornecedores (exposição ${level})`);
    }

    // Fragmento Societário
    if (shareholderProfile.activeSignals.length > 0) {
      fragments.push(`exposição patrimonial na relação sociedade-operação`);
    }

    // Fragmento de Liquidez
    if (liquidityProfile.activeSignals.length > 0) {
      fragments.push(`pressão de cobertura imediata (liquidez real ${liquidityProfile.realLiquidityStrength.toFixed(2)}x)`);
    }

    if (fragments.length > 0) {
      narrative += `, caracterizada por ${this.joinFragments(fragments)}.`;
    } else {
      narrative += ` sem indícios de pressões críticas iminentes sobre a liquidez real ou dependência excessiva em suas operações correntes.`;
    }

    return narrative;
  }

  private static translateStage(stage: StructuralCapitalStage): string {
    switch (stage) {
      case 'STRUCTURALLY_FUNCTIONAL_OPERATION':
        return 'uma operação estruturalmente funcional';
      case 'OPERATIONAL_STABILITY_WITH_CAPITAL_PRESSURE':
        return 'estabilidade operacional subjacente com pressão de capital';
      case 'LIQUIDITY_TENSIONED_OPERATION':
        return 'uma operação tensionada por liquidez';
      case 'SUPPLIER_DEPENDENT_OPERATION':
        return 'uma operação altamente dependente da cadeia de fornecedores';
      case 'CAPITAL_IMBALANCED_OPERATION':
        return 'um desequilíbrio relevante na alocação e sustentação de capital';
      default:
        return 'uma configuração estrutural complexa';
    }
  }

  private static joinFragments(fragments: string[]): string {
    if (fragments.length === 1) return fragments[0];
    if (fragments.length === 2) return `${fragments[0]} e ${fragments[1]}`;
    const last = fragments.pop();
    return `${fragments.join(', ')} e ${last}`;
  }
}
