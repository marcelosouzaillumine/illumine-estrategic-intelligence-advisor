export type GovernanceEventType = 
  | 'DISCOVERY_COMPLETED'
  | 'EVALUATION_CREATED'
  | 'CERTIFICATION_ISSUED'
  | 'CERTIFICATION_REPLAYED'
  | 'POLICY_UPDATED';

export interface GovernanceEvent {
  readonly id: string;
  readonly type: GovernanceEventType;
  readonly timestamp: Date;
  readonly artifactId: string;
  readonly actor: string;
  readonly metadata: Record<string, unknown>;
}
