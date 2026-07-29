import { SemanticEntity } from '../kernel/semantic-kernel';

export interface BusinessCapability extends SemanticEntity {
  readonly capabilityCode: string;
  readonly category: 'CORE' | 'SUPPORT' | 'GOVERNANCE';
}

export interface StrategicDomain extends SemanticEntity {
  readonly domainCode: string;
  readonly businessCapabilities: BusinessCapability[];
}

export interface OperationalArea extends SemanticEntity {
  readonly areaCode: string;
  readonly parentDomainCode: string;
}
