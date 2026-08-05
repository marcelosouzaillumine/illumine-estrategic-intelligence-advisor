export type InsightSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FinancialInsight {
  finding: string;
  origin: string; // e.g. "CashConversionEngine" or "ProfitabilityRelationshipEngine"
  severity: InsightSeverity;
  confidence: number; // 0-100
  period: string; // e.g. "2025"
}

export class FinancialInsightRegistry {
  private insights: FinancialInsight[] = [];

  public register(insight: FinancialInsight): void {
    this.insights.push(insight);
  }

  public getInsights(): FinancialInsight[] {
    return [...this.insights];
  }

  public getBySeverity(severity: InsightSeverity): FinancialInsight[] {
    return this.insights.filter(i => i.severity === severity);
  }

  public getCriticalFindings(): FinancialInsight[] {
    return this.insights.filter(i => i.severity === 'HIGH' || i.severity === 'CRITICAL');
  }

  public clear(): void {
    this.insights = [];
  }
}
