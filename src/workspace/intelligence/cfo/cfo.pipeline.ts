import { IntelligencePipeline, IntelligencePipelineContext } from '../orchestration/intelligence.pipeline';
import { FinancialEngineAdapter } from './engines/financial-engine.adapter';
import { CashEngineAdapter } from './engines/cash-engine.adapter';
import { PatrimonialEngineAdapter } from './engines/patrimonial-engine.adapter';
import { CfoSnapshotGenerator } from '../snapshots/snapshot.generator';
import { SnapshotRepository } from '../repositories/snapshot.repository';
import { InsightQualityValidator } from '../validation/insight-quality.validator';
import { CfoHealthScoreEngine } from './cfo-health-score.engine';

export class CfoIntelligencePipeline extends IntelligencePipeline {
  readonly pipelineName = 'CfoIntelligencePipeline';

  private financialEngine = new FinancialEngineAdapter();
  private cashEngine = new CashEngineAdapter();
  private patrimonialEngine = new PatrimonialEngineAdapter();
  private snapshotRepository = new SnapshotRepository();

  protected getEnginesUsed(): string[] {
    return ['FinancialEngine', 'CashEngine', 'PatrimonialEngine'];
  }

  protected async runProcess(context: IntelligencePipelineContext): Promise<void> {
    console.log(`[CFO Pipeline] Starting intelligence generation for ${context.tenantId}`);

    // 1. Coletar dados financeiros de origem
    // (In a real scenario, fetch raw DRE/Balanço data here from the ERP sync tables)
    // const rawData = await this.dataIngestionService.getRawData(context.tenantId, context.periodId);

    // 2. Executar adapters
    const [financeMetrics, cashMetrics, patrimonialMetrics] = await Promise.all([
      this.financialEngine.calculatePerformanceMetrics(context.tenantId, context.periodId),
      this.cashEngine.calculateCashMetrics(context.tenantId, context.periodId),
      this.patrimonialEngine.calculatePatrimonialMetrics(context.tenantId, context.periodId)
    ]);

    // Consolidar e validar todos os insights gerados
    const combinedInsights = [
      ...financeMetrics.insights,
      ...cashMetrics.insights,
      ...patrimonialMetrics.insights
    ];
    
    const validatedInsights = combinedInsights.map(i => InsightQualityValidator.validate(i));
    const approvedInsights = validatedInsights
      .filter(v => v.status !== 'rejected')
      .map(v => v.originalInsight);

    const rejectedCount = validatedInsights.filter(v => v.status === 'rejected').length;
    if (rejectedCount > 0) {
      console.warn(`[CFO Pipeline] ${rejectedCount} insights were rejected by governance rules.`);
    }

    // 3. Enviar resultados para o Snapshot Generator
    const snapshotPayload = CfoSnapshotGenerator.generatePayload(
      context.tenantId, 
      context.periodId, 
      {
        revenue: financeMetrics.revenue,
        revenueTrend: financeMetrics.revenueTrend,
        revenueGrowth: financeMetrics.revenueGrowth,
        ebitda: financeMetrics.ebitda,
        ebitdaMargin: financeMetrics.ebitdaMargin,
        ebitdaTrend: financeMetrics.ebitdaTrend,
        cashFlow: cashMetrics.cashFlow,
        cashFlowTrend: cashMetrics.cashFlowTrend,
        liquidityRisk: cashMetrics.liquidityRisk,
        runwayDays: cashMetrics.runwayDays,
        budgetVarianceValue: financeMetrics.budgetVarianceValue,
        budgetVariancePercentage: financeMetrics.budgetVariancePercentage,
        forecastVsTargetPercentage: financeMetrics.forecastVsTargetPercentage,
        insights: approvedInsights
      }
    );

    // Calculate Executive Health Score
    snapshotPayload.healthScore = CfoHealthScoreEngine.calculateScore(snapshotPayload);

    // Update specific generatedBy based on context
    snapshotPayload.metadata.generatedBy = context.triggeredBy;

    // 4. Salvar o snapshot no Firestore
    await this.snapshotRepository.saveSnapshot(context.tenantId, context.periodId, snapshotPayload);
    
    console.log(`[CFO Pipeline] Intelligence snapshot generated and saved successfully.`);
  }
}
