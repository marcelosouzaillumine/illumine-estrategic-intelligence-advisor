import { InstitutionalNode } from '../../../../../types/knowledge-graph/InstitutionalNode';

export interface PersistentGraphNode extends InstitutionalNode {
  tenantId: string;
  correlationId: string;
  lineageId: string;
  sourceEngine: string;
  createdAt: string;
  updatedAt: string;
}
