import { InstitutionalObjectType } from './InstitutionalObject';

export interface InstitutionalIntelligenceReference {
  objectId: string;
  objectType: InstitutionalObjectType;
  title: string;
  domain: string;
  tenantId: string;
}
