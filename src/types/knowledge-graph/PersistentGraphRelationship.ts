import { InstitutionalRelationship } from './InstitutionalRelationship';

export interface PersistentGraphRelationship extends InstitutionalRelationship {
  tenantId: string;
  correlationId: string;
  lineageId: string;
  sourceEngine: string;
  createdAt: string;
  updatedAt: string;
}
