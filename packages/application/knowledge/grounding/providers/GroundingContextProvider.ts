export interface GroundingContextProvider {
  providerName: string;
  
  // Extracts context pertinent to the given objective/query from the underlying capability
  provideContext(query: string, tenantId: string, constraints?: any): Promise<any>;
}
