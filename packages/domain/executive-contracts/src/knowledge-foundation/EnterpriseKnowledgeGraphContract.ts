export interface EnterpriseKnowledgeGraphContract {
  readonly nodeGraphId: string;
  readonly companyId: string;
  readonly totalEntitiesCount: number;
  readonly totalCausalEdgesCount: number;
  readonly graphHardeningScore: number;
  readonly lastHardenedTimestamp: string;
}
