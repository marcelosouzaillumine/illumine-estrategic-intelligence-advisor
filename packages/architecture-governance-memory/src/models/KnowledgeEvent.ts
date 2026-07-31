export interface KnowledgeEvent {
  readonly id: string;
  readonly type: 'NODE_ADDED' | 'NODE_UPDATED' | 'NODE_DEPRECATED' | 'EDGE_CREATED' | 'EDGE_REMOVED';
  readonly nodeId?: string;
  readonly edgeId?: string;
  readonly payload: unknown;
  readonly recordedAt: string;
}
