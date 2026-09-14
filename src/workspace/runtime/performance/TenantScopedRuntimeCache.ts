import { SovereignCacheKey } from './types';
import { TenantIsolationError, TenantViolations } from '../../../core/runtime/tenancy/hardening/TenantExecutionContext';

export class TenantScopedRuntimeCache {
  // Nested Maps: Tenant ID -> Cache Key -> Immutable Snapshot
  private cacheStore: Map<string, Map<string, any>> = new Map();

  private buildKeyString(key: SovereignCacheKey): string {
    return [
      key.tenantId,
      key.groupId,
      key.targetEntityId,
      key.entityPathHash,
      key.consolidationScopeHash,
      key.reportingBoundary,
      key.runtimeMode,
      key.fiscalPeriod,
      key.sourceDataHash,
      key.lineageHash,
      key.confidenceFingerprint,
      key.schemaVersion
    ].join('|');
  }

  public set<T>(key: SovereignCacheKey, data: T): void {
    if (!key.tenantId || !key.groupId || !key.targetEntityId || !key.lineageHash || !key.sourceDataHash) {
      throw new TenantIsolationError(
        TenantViolations.INVALID_CACHE_SCOPE,
        `Tentativa de persistir cache com chave não-soberana. Faltam elementos obrigatórios de Governança.`
      );
    }

    if (!this.cacheStore.has(key.tenantId)) {
      this.cacheStore.set(key.tenantId, new Map());
    }

    const tenantCache = this.cacheStore.get(key.tenantId)!;
    const keyString = this.buildKeyString(key);
    
    // Armazenar SNAPSHOT imutável do objeto
    const immutableSnapshot = Object.freeze(JSON.parse(JSON.stringify(data)));
    tenantCache.set(keyString, immutableSnapshot);
  }

  public get<T>(key: SovereignCacheKey): T | null {
    if (!key.tenantId) {
      throw new TenantIsolationError(
        TenantViolations.MISSING_TENANT_CONTEXT,
        `Tentativa de leitura de cache sem contexto de Tenant.`
      );
    }

    const tenantCache = this.cacheStore.get(key.tenantId);
    if (!tenantCache) return null;

    const keyString = this.buildKeyString(key);
    const cachedData = tenantCache.get(keyString);

    if (cachedData) {
      // Retornar SNAPSHOT imutável, evitando mutação posterior por UI ou Adapter
      return Object.freeze(JSON.parse(JSON.stringify(cachedData))) as T;
    }

    return null;
  }

  public clearTenant(tenantId: string): void {
    this.cacheStore.delete(tenantId);
  }
}

export const tenantScopedRuntimeCache = new TenantScopedRuntimeCache();
