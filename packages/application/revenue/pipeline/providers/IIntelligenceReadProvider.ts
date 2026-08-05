import { IntelligenceReadModel } from '../read-models/IntelligenceReadModel';
export interface IIntelligenceReadProvider { getInsights(leadId: string): Promise<IntelligenceReadModel[]>; }