import { SemanticIdentifier } from '../kernel/semantic-kernel';

export interface CausalChainNode {
  readonly entityId: SemanticIdentifier;
  readonly entityName: string;
  readonly impactType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface CausalChain {
  readonly chainId: SemanticIdentifier;
  readonly rootEntityId: SemanticIdentifier;
  readonly nodes: CausalChainNode[];
  readonly description: string;
}
