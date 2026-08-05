import { PipelineMetricsReadModel } from './PipelineMetricsReadModel';
import { OpportunityReadModel } from './OpportunityReadModel';
import { TimelineReadModel } from './TimelineReadModel';
import { IntelligenceReadModel } from './IntelligenceReadModel';
import { ForecastReadModel } from './ForecastReadModel';
import { ActivityReadModel } from './ActivityReadModel';

export interface CommercialPipelineReadModel {
  header: {
    officeId: string;
    lastSync: string;
  };
  metrics: PipelineMetricsReadModel;
  forecast: ForecastReadModel;
  board: {
    cards: OpportunityReadModel[];
  };
  selectedOpportunity: OpportunityReadModel | null;
  timeline: TimelineReadModel[];
  intelligence: IntelligenceReadModel[];
  activities: ActivityReadModel[];
}
