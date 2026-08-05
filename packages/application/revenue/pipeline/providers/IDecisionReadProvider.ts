import { TimelineReadModel } from '../read-models/TimelineReadModel';
export interface IDecisionReadProvider { getDecisionTimeline(leadId: string): Promise<TimelineReadModel[]>; }