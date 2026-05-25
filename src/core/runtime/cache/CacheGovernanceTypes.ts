export interface CacheEntry<T> {
  tenantId: string;
  workspaceId: string;
  timestamp: number;
  payload: T;
  ttlMs: number;
}

export type CacheScope = 'TENANT' | 'WORKSPACE' | 'EXECUTION';
