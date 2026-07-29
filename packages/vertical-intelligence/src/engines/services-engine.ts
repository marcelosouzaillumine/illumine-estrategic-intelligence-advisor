export interface ProfessionalServicesMetrics {
  revenuePerHourBrl: number;
  teamUtilizationRatePercentage: number;
  projectMarginPercentage: number;
  recurringRevenuePercentage: number;
}

export class ProfessionalServicesEngine {
  public static calculateServicesPerformance(tenantId: string): ProfessionalServicesMetrics {
    return {
      revenuePerHourBrl: 420,
      teamUtilizationRatePercentage: 82.5,
      projectMarginPercentage: 44.0,
      recurringRevenuePercentage: 68.0
    };
  }
}
