import { InstitutionalObject } from '../intelligence/InstitutionalObject';

export type InstitutionalDomainType = 
  | 'GOVERNANCE'
  | 'FINANCIAL'
  | 'OPERATIONAL'
  | 'PEOPLE'
  | 'MARKET'
  | 'STRATEGY'
  | 'ESGIM'
  | 'MISSION'
  | 'CONSTITUTIONAL';

export interface TwinDomain extends InstitutionalObject {
  domainType: InstitutionalDomainType;
  
  // Persisted state indicators from underlying official engines
  // NOT locally calculated. Must be exact reflections of what's persisted.
  officialStateRefs?: {
    latestStatus?: string;
    latestConfidence?: 'VERIFIED' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';
    recordedMetrics?: Record<string, string | number>;
  };
  
  // Linkages to other persisted objects
  graphNodeId?: string;
  timelineId?: string;
}
