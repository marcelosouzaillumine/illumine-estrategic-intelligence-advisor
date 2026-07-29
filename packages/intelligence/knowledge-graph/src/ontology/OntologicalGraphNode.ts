import { SemanticEntity } from '@illumine/semantic-model';

export interface OntologicalGraphNode extends SemanticEntity {
  readonly domainCategory: 'FINANCE' | 'GOVERNANCE' | 'OPERATIONS' | 'RISK' | 'STRATEGY';
  readonly properties: Record<string, unknown>;
}
