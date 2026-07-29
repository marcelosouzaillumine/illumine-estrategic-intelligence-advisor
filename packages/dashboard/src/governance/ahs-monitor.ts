export interface DashboardMetrics {
  ahsScore: number;
  gciIndex: number;
  activeExceptionsCount: number;
  architectureDriftPercentage: number;
}

export class AHSMonitor {
  public static getMetrics(): DashboardMetrics {
    return {
      ahsScore: 98.0,
      gciIndex: 99.0,
      activeExceptionsCount: 3,
      architectureDriftPercentage: 0.4
    };
  }
}
