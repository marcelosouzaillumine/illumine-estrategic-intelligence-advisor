import { CommercialPipelineQueryService } from '../services/CommercialPipelineQueryService';
import { CommercialPipelineAggregator } from '../aggregators/CommercialPipelineAggregator';

import { MockLeadReadProvider } from '../providers/mocks/MockLeadReadProvider';
import { MockForecastReadProvider } from '../providers/mocks/MockForecastReadProvider';
import { MockProposalReadProvider } from '../providers/mocks/MockProposalReadProvider';
import { MockDecisionReadProvider } from '../providers/mocks/MockDecisionReadProvider';
import { MockPartnerReadProvider } from '../providers/mocks/MockPartnerReadProvider';
import { MockIntelligenceReadProvider } from '../providers/mocks/MockIntelligenceReadProvider';

export function resolveCommercialPipelineQuery(): CommercialPipelineQueryService {
  // In a real application, this would use a DI container (e.g., TSyringe or Inversify)
  // or a context-based registry.
  
  const aggregator = new CommercialPipelineAggregator(
    new MockLeadReadProvider(),
    new MockForecastReadProvider(),
    new MockProposalReadProvider(),
    new MockDecisionReadProvider(),
    new MockPartnerReadProvider(),
    new MockIntelligenceReadProvider()
  );

  return new CommercialPipelineQueryService(aggregator);
}
