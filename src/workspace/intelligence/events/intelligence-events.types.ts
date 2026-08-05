import { EnterpriseInsight } from '../models/enterprise-insight.types';

export type IntelligenceEventType = 
  | 'InsightDetected'
  | 'RelationshipCreated'
  | 'ImpactCalculated'
  | 'RecommendationGenerated'
  | 'DecisionRecorded';

export interface IntelligenceEvent {
  id: string;
  type: IntelligenceEventType;
  timestamp: string;
  insightId: string;
  metadata?: Record<string, any>;
}

export interface InsightDetectedEvent extends IntelligenceEvent {
  type: 'InsightDetected';
  insight: EnterpriseInsight;
}

export interface RelationshipCreatedEvent extends IntelligenceEvent {
  type: 'RelationshipCreated';
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  confidence: number;
}

export interface ImpactCalculatedEvent extends IntelligenceEvent {
  type: 'ImpactCalculated';
  businessImpact: any; // Reference to BusinessImpact
}

export interface RecommendationGeneratedEvent extends IntelligenceEvent {
  type: 'RecommendationGenerated';
  recommendations: any[]; // Reference to DecisionRecommendation[]
}

export interface DecisionRecordedEvent extends IntelligenceEvent {
  type: 'DecisionRecorded';
  decisionId: string;
  actionTaken: string;
  responsibleOffice: string;
}
