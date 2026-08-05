import { ExecutiveContext } from '../../context/executive-context.types';
import { CommercialExecutiveSummaryData } from '../../data/types/commercial-intelligence.types';
import { CommercialHealthScoreEngine } from './engines/commercial-health-score.engine';
import { PipelineHealthEngine } from './engines/pipeline-health.engine';
import { GrowthOpportunityEngine } from './engines/growth-opportunity.engine';
import { CustomerHealthEngine } from './engines/customer-health.engine';

export class CommercialSnapshotGenerator {
  private healthEngine = new CommercialHealthScoreEngine();
  private pipelineEngine = new PipelineHealthEngine();
  private growthEngine = new GrowthOpportunityEngine();
  private customerEngine = new CustomerHealthEngine();

  async generate(context: ExecutiveContext): Promise<Omit<CommercialExecutiveSummaryData, 'metadata'>> {
    const health = await this.healthEngine.evaluate(context);
    const pipeline = await this.pipelineEngine.evaluate(context);
    const growth = await this.growthEngine.evaluate(context);
    const customer = await this.customerEngine.evaluate(context);

    // Combine insights from all engines
    const allInsights = [
      ...health.criticalInsights,
      ...pipeline.insights,
      ...growth.insights,
      ...customer.insights
    ];

    // Filter to critical/warnings for the summary
    const criticalInsights = allInsights.filter(
      (i) => i.severity === 'critical' || i.severity === 'warning'
    );

    const risks = criticalInsights.map(i => i.title);

    return {
      healthScore: health.overallScore,
      topOpportunities: growth.initiatives,
      commercialRisks: risks,
      recommendedActions: criticalInsights.map(i => ({
        title: `Mitigação: ${i.title}`,
        description: i.recommendation,
        priority: i.severity === 'critical' ? 'high' : 'medium'
      })),
      criticalInsights
    };
  }
}
