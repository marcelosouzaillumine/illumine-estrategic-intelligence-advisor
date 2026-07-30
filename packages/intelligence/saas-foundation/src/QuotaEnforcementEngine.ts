import { SaaSQuotaContract } from '@illumine/executive-contracts';

export class QuotaEnforcementEngine {
  public static initDefaultQuota(organizationId: string): SaaSQuotaContract {
    return {
      organizationId,
      maxCompanies: 50,
      currentCompanies: 1,
      maxUsers: 100,
      currentUserCount: 3,
      maxAdvisors: 25,
      currentAdvisorCount: 2,
      maxStorageGB: 500,
      currentStorageGB: 12,
      maxMonthlyAICalls: 50000,
      currentMonthlyAICalls: 1200
    };
  }

  public static canAddCompany(quota: SaaSQuotaContract): boolean {
    return quota.currentCompanies < quota.maxCompanies;
  }
}
