import { ExecutiveIdentityContext } from '../../executive-identity-context/src/ExecutiveIdentityContext';
import { TenantIsolationGuard } from './TenantIsolationGuard';

/**
 * Memória Histórica de Longo Prazo.
 * Armazena eventos e contextos que persistem entre múltiplas sessões.
 * Nenhuma memória relacional existe sem Identity Context resolvido.
 */
export interface ExecutiveRelationshipMemory {
  historyId: string;
  tenantId: string; // Amarrado fortemente ao Tenant
  organizationId: string; // E ao Organization Scope
  userId: string;
  conversationId: string; // Conversation Isolation Bound
  previousAccesses: string[]; // ISO dates
  sentBriefings: string[]; // Resumos de interações passadas
  monitoredDecisions: string[];
  institutionalEvolution: string[];
  pastRecommendations: string[];
}

export class ExecutiveMemoryStore {
  // Simulação de banco de dados para a Memória Relacional (em prod será um Repo/ORM)
  private static memoryStorage: Map<string, ExecutiveRelationshipMemory> = new Map();

  /**
   * Tenta recuperar a memória. A autorização é inegociável.
   */
  static load(identity: ExecutiveIdentityContext, requestedTenantId: string, requestedOrganizationId?: string): ExecutiveRelationshipMemory | null {
    // 1. AR-GFC-ERI-008: Tenant Memory Isolation (Se violar, lança Error agressivo)
    TenantIsolationGuard.authorize(identity, requestedTenantId, requestedOrganizationId);

    // 2. Montagem da chave baseada nos escopos (Tenant > Org > User > Role > Persona)
    const orgPart = requestedOrganizationId || identity.organizationId;
    const cacheKey = `${requestedTenantId}::${orgPart}::${identity.userId}::${identity.operationalRole}::${identity.executivePersona}`;
    
    return this.memoryStorage.get(cacheKey) || null;
  }

  /**
   * Persiste uma memória. A autorização também é verificada para evitar Memory Poisoning.
   */
  static save(identity: ExecutiveIdentityContext, memory: ExecutiveRelationshipMemory): void {
    // AR-GFC-ERI-008: Valida se o Tenant/Org do payload bate com a Identidade ativa
    TenantIsolationGuard.authorize(identity, memory.tenantId, memory.organizationId);

    const cacheKey = `${memory.tenantId}::${memory.organizationId}::${identity.userId}::${identity.operationalRole}::${identity.executivePersona}`;
    this.memoryStorage.set(cacheKey, memory);
  }
}

