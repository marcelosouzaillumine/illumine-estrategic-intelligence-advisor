export interface SaaSQuotaContract {
  readonly organizationId: string;
  readonly maxCompanies: number;
  readonly currentCompanies: number;
  readonly maxUsers: number;
  readonly currentUserCount: number;
  readonly maxAdvisors: number;
  readonly currentAdvisorCount: number;
  readonly maxStorageGB: number;
  readonly currentStorageGB: number;
  readonly maxMonthlyAICalls: number;
  readonly currentMonthlyAICalls: number;
}
