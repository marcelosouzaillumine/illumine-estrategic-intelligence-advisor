/**
 * Illumine OS™ Financial Governance Boundary
 * Financial Observatory (CFDI v2.1)
 * 
 * Telemetry and operational observability for financial data quality,
 * certification rates, and FIN-001..FIN-010 violation metrics.
 */

import { CertifiedFinancialDataset, FinancialViolation } from '../../../../../../packages/executive-contracts/src/financial/index';

export interface FinancialObservatoryMetrics {
  totalCertifiedDatasets: number;
  averageQualityScore: number;
  averageHealthIndex: number;
  violationsDistribution: Record<string, number>;
  activeDatasetsCount: number;
}

export class FinancialObservatory {
  private static metrics: FinancialObservatoryMetrics = {
    totalCertifiedDatasets: 0,
    averageQualityScore: 100,
    averageHealthIndex: 100,
    violationsDistribution: {},
    activeDatasetsCount: 0
  };

  public static trackDataset(dataset: CertifiedFinancialDataset): void {
    this.metrics.totalCertifiedDatasets += 1;
    this.metrics.activeDatasetsCount += 1;
    
    // Accumulate average quality
    this.metrics.averageQualityScore = Math.round(
      (this.metrics.averageQualityScore + dataset.certification.qualityScore.score) / 2
    );

    // Accumulate average health
    this.metrics.averageHealthIndex = Math.round(
      (this.metrics.averageHealthIndex + dataset.healthIndex.index) / 2
    );

    // Distribution tracking
    dataset.certification.violations.forEach((v: FinancialViolation) => {
      this.metrics.violationsDistribution[v.code] = (this.metrics.violationsDistribution[v.code] || 0) + 1;
    });
  }

  public static getMetrics(): FinancialObservatoryMetrics {
    return { ...this.metrics };
  }
}
