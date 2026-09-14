export interface OperationalMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

export class OperationalDomainViewModel {
  public static calculateHealthIndex(metrics: OperationalMetric[]): number {
    if (!metrics || metrics.length === 0) return 100;
    const optimalCount = metrics.filter(m => m.status === 'OPTIMAL').length;
    return (optimalCount / metrics.length) * 100;
  }

  public static summarizeAlerts(metrics: OperationalMetric[]) {
    const critical = metrics.filter(m => m.status === 'CRITICAL').length;
    const warning = metrics.filter(m => m.status === 'WARNING').length;
    const optimal = metrics.filter(m => m.status === 'OPTIMAL').length;

    return { critical, warning, optimal };
  }

  public static toContract(state: any = {}, computed: any = {}, actions: any = {}) {
    return { state, computed, actions };
  }
}
