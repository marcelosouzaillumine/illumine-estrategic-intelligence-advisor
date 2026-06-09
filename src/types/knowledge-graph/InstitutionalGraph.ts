import { InstitutionalNode } from "./InstitutionalNode";
import { InstitutionalRelationship } from "./InstitutionalRelationship";

export interface InstitutionalGraph {
  graphId: string;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  generatedAt: string;
}
