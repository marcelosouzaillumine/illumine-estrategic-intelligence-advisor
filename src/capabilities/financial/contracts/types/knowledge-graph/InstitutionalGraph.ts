import { InstitutionalNode } from "../../../../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../../../../types/knowledge-graph/InstitutionalRelationship";

export interface InstitutionalGraph {
  graphId: string;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  generatedAt: string;
}
