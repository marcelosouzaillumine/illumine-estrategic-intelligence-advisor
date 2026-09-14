import { InstitutionalNode } from "../../../../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../../../../types/knowledge-graph/InstitutionalRelationship";

export interface CognitivePath {
  pathId: string;
  sourceNodeId: string;
  targetNodeId: string;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  pathLength: number;
  confidenceLevel: 'DETERMINISTIC'; // Fixed as per requirements
}
