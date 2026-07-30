import { TerritoryContract } from '@illumine/executive-contracts';

export class TerritoryManagementEngine {
  public static registerExclusiveTerritory(state: string, city: string, sector: string, partnerId: string): TerritoryContract {
    return {
      territoryId: `terr-${state}-${city}-${sector}`,
      countryCode: 'BRA',
      stateOrProvince: state,
      city,
      industrySector: sector,
      exclusivePartnerOrgId: partnerId,
      activeQuotaCapacity: 50
    };
  }
}
