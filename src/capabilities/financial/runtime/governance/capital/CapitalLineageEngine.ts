import { CapitalMetric } from '../../../../../runtime/governance/capital/CapitalMetricRegistry';

export interface LineageViolation {
  rule: 'CGE_NET_INCOME_LINEAGE_BREAK' | 'CAPITAL_SOCIAL_LINEAGE_BREAK' | 'CAPITAL_METRIC_LINEAGE_BREAK';
  severity: 'CRITICAL' | 'HIGH';
  message: string;
  blocked: boolean;
}

export class CapitalLineageEngine {
  public static validateCapitalLineage(params: {
    dreNetIncome: number | null;
    cgeNetIncome: number | null;
    bpCapitalSocial: number | null;
    cgeCapitalSocial: number | null;
    metrics: CapitalMetric[];
  }): LineageViolation[] {
    const violations: LineageViolation[] = [];

    // Rule 1: CGE_NET_INCOME_LINEAGE_BREAK
    if (params.dreNetIncome !== null && params.cgeNetIncome !== null && params.dreNetIncome !== params.cgeNetIncome) {
      violations.push({
        rule: 'CGE_NET_INCOME_LINEAGE_BREAK',
        severity: 'CRITICAL',
        message: `Divergência crítica de linhagem de Lucro Líquido: DRE (${params.dreNetIncome}) difere da CGE (${params.cgeNetIncome}).`,
        blocked: true
      });
    }

    // Rule 2: CAPITAL_SOCIAL_LINEAGE_BREAK
    if (params.bpCapitalSocial !== null && params.cgeCapitalSocial !== null && params.bpCapitalSocial !== params.cgeCapitalSocial) {
      violations.push({
        rule: 'CAPITAL_SOCIAL_LINEAGE_BREAK',
        severity: 'CRITICAL',
        message: `Divergência crítica de linhagem de Capital Social: BP (${params.bpCapitalSocial}) difere da CGE (${params.cgeCapitalSocial}).`,
        blocked: true
      });
    }

    // Rule 3: CAPITAL_METRIC_LINEAGE_BREAK
    params.metrics.forEach(metric => {
      if (
        metric.renderedValue !== null &&
        metric.renderedValue !== undefined &&
        metric.renderedValue !== 'NOT_OBSERVABLE' &&
        metric.consumedValue !== null &&
        metric.consumedValue !== undefined &&
        Number(metric.renderedValue) !== Number(metric.consumedValue)
      ) {
        violations.push({
          rule: 'CAPITAL_METRIC_LINEAGE_BREAK',
          severity: 'HIGH',
          message: `Divergência de linhagem para a métrica ${metric.metricId}: Consumido (${metric.consumedValue}) difere de Renderizado (${metric.renderedValue}).`,
          blocked: false
        });
      }
    });

    return violations;
  }
}
