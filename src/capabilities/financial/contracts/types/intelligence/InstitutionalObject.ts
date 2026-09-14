export type InstitutionalObjectType = 
  | 'RISK'
  | 'DECISION'
  | 'KPI'
  | 'EVIDENCE'
  | 'SCENARIO'
  | 'POLICY'
  | 'INSTITUTIONAL_FACT'
  | 'EVENT'
  | 'PROJECT'
  | 'DIRECTIVE'
  | 'ORGANIZATION'
  | 'DOMAIN'
  | 'INVESTIGATION_CONTEXT'
  | 'MEMORY';

import { InstitutionalProvenance } from '../../../../../types/intelligence/InstitutionalProvenance';

export interface InstitutionalObject {
  objectId: string;
  objectType: InstitutionalObjectType;
  tenantId: string;
  lineageId?: string;
  correlationId?: string;
  title: string;
  description: string;
  sourceDomain: string;
  createdAt?: string;
  updatedAt?: string;
  provenance?: InstitutionalProvenance;
}
