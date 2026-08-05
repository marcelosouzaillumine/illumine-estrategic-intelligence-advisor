import { CommercialPipelineAggregator } from '../aggregators/CommercialPipelineAggregator';
import { CommercialPipelineReadModel } from '../read-models/CommercialPipelineReadModel';

export class CommercialPipelineQueryService {
  constructor(private aggregator: CommercialPipelineAggregator) {}

  async getPipeline(officeId: string): Promise<CommercialPipelineReadModel> {
    return this.aggregator.buildPipelineView(officeId);
  }

  async getOpportunityWorkspace(opportunityId: string): Promise<CommercialPipelineReadModel> {
    return this.aggregator.buildOpportunityWorkspace(opportunityId);
  }
}
