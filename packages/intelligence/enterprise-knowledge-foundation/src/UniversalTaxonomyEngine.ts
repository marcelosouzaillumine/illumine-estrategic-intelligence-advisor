import { UniversalTaxonomyContract } from '@illumine/executive-contracts';

export class UniversalTaxonomyEngine {
  public static mapTaxonomy(categoryCode: string, name: string, domain: string): UniversalTaxonomyContract {
    return {
      taxonomyId: `tax-${categoryCode}`,
      categoryCode,
      canonicalName: name,
      mappedDomain: domain
    };
  }
}
