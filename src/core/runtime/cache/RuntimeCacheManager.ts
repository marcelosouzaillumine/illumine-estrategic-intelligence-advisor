import { CacheEntry } from './CacheGovernanceTypes';
import { TenantExecutionScope } from '../tenancy/TenancyTypes';

/**
 * Cache Institucional estritamente em memória RAM (Map).
 * Isolado por Tenant e Workspace para zero leakage.
 */
export class RuntimeCacheManager {
  private static store = new Map<string, CacheEntry<any>>();

  static set<T>(key: string, data: T, scope: TenantExecutionScope, ttlMinutes: number = 30): void {
    const prefixedKey = `${scope.tenantId}::${scope.workspaceId}::${key}`;
    const entry: CacheEntry<T> = {
      tenantId: scope.tenantId,
      workspaceId: scope.workspaceId,
      timestamp: Date.now(),
      payload: data,
      ttlMs: ttlMinutes * 60 * 1000
    };
    
    this.store.set(prefixedKey, entry);
  }

  static get<T>(key: string, scope: TenantExecutionScope): T | null {
    const prefixedKey = `${scope.tenantId}::${scope.workspaceId}::${key}`;
    const entry = this.store.get(prefixedKey);

    if (!entry) return null;

    // Cross-tenant Leakage check (Fail-safe redundante)
    if (entry.tenantId !== scope.tenantId || entry.workspaceId !== scope.workspaceId) {
      console.error(`[CRITICAL] Tentativa de Cross-Tenant Access Bloqueada no Cache! Chave: ${key}`);
      return null;
    }

    // Expiration check
    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.store.delete(prefixedKey);
      return null;
    }

    return entry.payload as T;
  }

  static deleteWorkspaceCache(workspaceId: string) {
    for (const [key, entry] of this.store.entries()) {
      if (entry.workspaceId === workspaceId) {
        this.store.delete(key);
      }
    }
  }

  static clearAll() {
    this.store.clear();
  }
}
