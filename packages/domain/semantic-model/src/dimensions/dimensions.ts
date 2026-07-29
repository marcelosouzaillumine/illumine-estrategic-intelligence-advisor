import { SemanticEntity } from '../kernel/semantic-kernel';

export type CorporateDimensionType =
  | 'FINANCE'
  | 'OPERATIONS'
  | 'GOVERNANCE'
  | 'RISK'
  | 'PEOPLE'
  | 'CUSTOMER'
  | 'ESG'
  | 'PROJECTS';

export interface CorporateDimension extends SemanticEntity {
  readonly dimensionType: CorporateDimensionType;
  readonly keyMetrics: string[];
}
