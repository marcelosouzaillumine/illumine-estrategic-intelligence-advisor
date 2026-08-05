export interface OpportunityReadModel {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  badges: string[];
  lastUpdate: string;
  nextAction: string;
  executiveSponsor: string;
  origin: string;
  businessObjectives: string[];
  painPoints: string[];
}
