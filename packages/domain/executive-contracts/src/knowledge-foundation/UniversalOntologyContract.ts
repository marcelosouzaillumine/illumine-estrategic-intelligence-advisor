export type EnterpriseOntologyDomain = 'FINANCIAL' | 'COMMERCIAL' | 'OPERATIONAL' | 'PEOPLE' | 'RISK' | 'INNOVATION';

export interface UniversalOntologyContract {
  readonly ontologyId: string;
  readonly domain: EnterpriseOntologyDomain;
  readonly entityType: string;
  readonly semanticDefinition: string;
  readonly keyProperties: readonly string[];
  readonly relationships: readonly string[];
}
