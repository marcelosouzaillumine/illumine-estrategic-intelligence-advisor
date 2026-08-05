import { RelationshipType } from '../../orchestration/relationship-types';

export type EnterpriseNodeType = 
  | 'OFFICE'
  | 'CAPABILITY'
  | 'METRIC'
  | 'DECISION'
  | 'BUSINESS_CONTEXT'
  | 'ENTITY';

export type EnterpriseRelationshipType = RelationshipType;

export interface GraphNodeMetadata {
  description?: string;
  sourceSystem?: string;
  tags?: string[];
  [key: string]: any;
}

export interface IntelligenceEdgeMetadata {
  description?: string;
  evidenceCount?: number;
  [key: string]: any;
}
