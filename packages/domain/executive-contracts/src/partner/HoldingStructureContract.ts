export interface HoldingStructureContract {
  readonly holdingId: string;
  readonly holdingName: string;
  readonly childCompanyIds: readonly string[];
  readonly totalConsolidatedRevenue: number;
}
