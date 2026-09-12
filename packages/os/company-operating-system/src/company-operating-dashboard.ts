export interface CompanyOperatingMetrics {
  mrrBrl: number;
  arrBrl: number;
  activeEnterpriseClientsCount: number;
  netRevenueRetentionPercentage: number;
  grossMarginPercentage: number;
  winRatePercentage: number;
}

export class ExecutiveCompanyDashboard {
  public static getDashboardMetrics(): CompanyOperatingMetrics {
    return {
      mrrBrl: 466000,
      arrBrl: 5600000,
      activeEnterpriseClientsCount: 28,
      netRevenueRetentionPercentage: 124,
      grossMarginPercentage: 86.5,
      winRatePercentage: 42.0
    };
  }
}
