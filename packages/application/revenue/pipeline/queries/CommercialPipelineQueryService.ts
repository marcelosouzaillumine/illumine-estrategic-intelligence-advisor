import { CommercialPipelineView } from '../query-models/CommercialPipelineView';
import { OpportunityWorkspaceView } from '../query-models/OpportunityWorkspaceView';

export interface GetCommercialPipelineQuery {
  officeId?: string;
  stage?: string;
  partnerId?: string;
}

export interface CommercialPipelineQueryService {
  getPipeline(query: GetCommercialPipelineQuery): Promise<CommercialPipelineView>;
  getOpportunityWorkspace(opportunityId: string): Promise<OpportunityWorkspaceView>;
}
