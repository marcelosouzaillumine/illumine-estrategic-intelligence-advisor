import { AgentDomainContext, ExecutiveOpinion } from '@illumine/executive-contracts';
import { CapabilitySelectionPolicy } from './CapabilitySelectionPolicy';
import { OpinionAggregator } from './OpinionAggregator';
import { ConflictResolver } from './ConflictResolver';

export class AgentCoordinator {
  public static coordinateOrchestration(
    context: AgentDomainContext,
    opinions: ExecutiveOpinion[]
  ): {
    selectedCapabilities: string[];
    aggregation: ReturnType<typeof OpinionAggregator.aggregateOpinions>;
    conflictReport: ReturnType<typeof ConflictResolver.resolveDivergences>;
  } {
    const selectedCapabilities = CapabilitySelectionPolicy.selectCapabilities(context);
    const aggregation = OpinionAggregator.aggregateOpinions(opinions);
    const conflictReport = ConflictResolver.resolveDivergences(opinions);

    return {
      selectedCapabilities,
      aggregation,
      conflictReport
    };
  }
}
