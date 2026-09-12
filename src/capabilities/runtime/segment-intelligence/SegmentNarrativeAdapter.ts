import { SegmentCode, SegmentNarrativeTraits } from './types';
import { SegmentIntelligenceRegistry } from './SegmentIntelligenceRegistry';
import { CanonicalInstitutionalTaxonomyRegistry } from '../../core/runtime/coherence/CanonicalInstitutionalTaxonomyRegistry';

export class SegmentNarrativeAdapter {
  /**
   * Obtém a linguagem fiduciária adaptada ao segmento.
   */
  static getNarrativeTraits(segmentCode: SegmentCode): SegmentNarrativeTraits {
    const registryEntry = SegmentIntelligenceRegistry[segmentCode];
    if (registryEntry) {
      return registryEntry.executiveNarrativeTraits;
    }
    // Fallback prudencial
    return SegmentIntelligenceRegistry['GENERIC_OPERATION'].executiveNarrativeTraits;
  }

  /**
   * Harmoniza um texto contendo tokens padronizados para a linguagem do segmento.
   * Exemplo: "{inventoryPressure}" vira "aprisionamento de capital em estoques"
   */
  static harmonizeText(text: string, segmentCode: SegmentCode): string {
    const traits = this.getNarrativeTraits(segmentCode);
    let harmonized = text;
    
    // Substituições básicas de tokens
    harmonized = harmonized.replace(/\{inventoryPressure\}/g, CanonicalInstitutionalTaxonomyRegistry['TRAIT_INVENTORY_HEAVY'] || traits.inventoryPressure);
    harmonized = harmonized.replace(/\{workingCapitalPressure\}/g, CanonicalInstitutionalTaxonomyRegistry['TRAIT_WORKING_CAPITAL_PRESSURE'] || traits.workingCapitalPressure);
    harmonized = harmonized.replace(/\{operationalLeverage\}/g, CanonicalInstitutionalTaxonomyRegistry['TRAIT_OPERATIONAL_LEVERAGE'] || traits.operationalLeverage);
    harmonized = harmonized.replace(/\{supplierDependency\}/g, CanonicalInstitutionalTaxonomyRegistry['TRAIT_SUPPLIER_DEPENDENCY'] || traits.supplierDependency);
    harmonized = harmonized.replace(/\{fixedCostBurden\}/g, CanonicalInstitutionalTaxonomyRegistry['TRAIT_FIXED_COST_BURDEN'] || traits.fixedCostBurden);
    harmonized = harmonized.replace(/\{revenueSensitivities\}/g, CanonicalInstitutionalTaxonomyRegistry['TRAIT_CONTRIBUTION_MARGIN_PRESSURE'] || traits.revenueSensitivities);
    
    return harmonized;
  }
}
