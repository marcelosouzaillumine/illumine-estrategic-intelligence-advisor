export interface TerritoryContract {
  readonly territoryId: string;
  readonly countryCode: string;
  readonly stateOrProvince: string;
  readonly city: string;
  readonly industrySector: string;
  readonly exclusivePartnerOrgId: string;
  readonly activeQuotaCapacity: number;
}
