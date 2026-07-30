export interface UniversalTaxonomyContract {
  readonly taxonomyId: string;
  readonly categoryCode: string;
  readonly canonicalName: string;
  readonly parentCategoryCode?: string;
  readonly mappedDomain: string;
}
