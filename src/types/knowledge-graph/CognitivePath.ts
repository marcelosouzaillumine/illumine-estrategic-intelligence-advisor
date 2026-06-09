import { InstitutionalNode } from "./InstitutionalNode";
import { InstitutionalRelationship } from "./InstitutionalRelationship";

export interface CognitivePath {
  pathId: string;
  sourceNodeId: string;
  targetNodeId: string;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  pathLength: number;
  confidenceLevel: 'DETERMINISTIC'; // Fixed as per requirements
}
