import { describe, it, expect } from 'vitest';
import { TenantIsolationGuard } from '../TenantIsolationGuard';
import { ExecutiveMemoryStore, ExecutiveRelationshipMemory } from '../ExecutiveRelationshipMemory';
import { ExecutiveIdentityContext } from '../../../executive-identity-context/src/ExecutiveIdentityContext';
import { TenantIsolationViolationError } from '../../../executive-identity-context/src/TenantIsolationViolationError';
import { ExecutiveBriefingGenerator } from '../ExecutiveBriefingGenerator';
import { SessionEvent, SessionContext } from '../ExecutiveSessionIntelligence';

describe('Executive Identity & Tenant Isolation Hardening™', () => {
  const baseIdentity: ExecutiveIdentityContext = {
    userId: 'user-a',
    tenantId: 'tenant-alpha',
    organizationId: 'org-1',
    operationalRole: 'CLIENT',
    executivePersona: 'CEO',
    permissions: [],
    sessionId: 'session-123',
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000), // Válido por 1h
    identitySource: 'SYSTEM'
  };

  const baseMemory: ExecutiveRelationshipMemory = {
    historyId: 'hist-1',
    tenantId: 'tenant-alpha',
    organizationId: 'org-1',
    userId: 'user-a',
    previousAccesses: [],
    sentBriefings: [],
    monitoredDecisions: [],
    institutionalEvolution: [],
    pastRecommendations: []
  };

  const baseContext: SessionContext = {
    event: SessionEvent.PAGE_CONTEXT_UPDATE,
    timestamp: new Date().toISOString(),
    contextDescription: 'Ambiente',
    impactDescription: 'Impacto',
    recipientIdentified: true,
    potentialAction: 'Ação'
  };

  it('Cenário 1: Tenant Isolation (User A / Tenant Alpha não acessa Tenant Beta)', () => {
    // 1. Salva a memória para o Tenant Alpha
    ExecutiveMemoryStore.save(baseIdentity, baseMemory);

    // 2. Tenta recuperar usando um request forjado para Tenant Beta (mesma identidade)
    expect(() => {
      ExecutiveMemoryStore.load(baseIdentity, 'tenant-beta', 'org-1');
    }).toThrowError(TenantIsolationViolationError);
  });

  it('Cenário 2 e 3: Experiência Admin vs Client e Cross Persona Leakage', () => {
    const adminIdentity: ExecutiveIdentityContext = {
      ...baseIdentity,
      operationalRole: 'ADMIN',
      userId: 'admin-1'
    };

    const advisorIdentity: ExecutiveIdentityContext = {
      ...baseIdentity,
      operationalRole: 'ADVISOR',
      userId: 'advisor-1'
    };

    // Client lendo dados do cliente
    expect(() => {
      ExecutiveBriefingGenerator.generateBriefing(baseIdentity, { ...baseContext, contextDescription: 'benchmark privado' });
    }).toThrowError('AR-GFC-ERI-009'); // Bloqueado: Client não lê benchmark cross-tenant

    // Admin lendo estratégia de cliente
    expect(() => {
      ExecutiveBriefingGenerator.generateBriefing(adminIdentity, { ...baseContext, contextDescription: 'risco financeiro e estratégia' });
    }).toThrowError('AR-GFC-ERI-009'); // Bloqueado: Admin não lê estratégico

    // Advisor lendo plataforma
    expect(() => {
      ExecutiveBriefingGenerator.generateBriefing(advisorIdentity, { ...baseContext, contextDescription: 'saúde da plataforma' });
    }).toThrowError('AR-GFC-ERI-009'); // Bloqueado: Advisor não lê plataforma
  });

  it('Cenário 5: Session Hijacking Prevention (tenantId da request não bate com identidade)', () => {
    // Identity diz "tenant-alpha"
    // Invasor tenta pedir TenantIsolationGuard.authorize para "tenant-beta"
    expect(() => {
      TenantIsolationGuard.authorize(baseIdentity, 'tenant-beta');
    }).toThrowError(TenantIsolationViolationError);
  });

  it('Cenário 6: Memory Poisoning Prevention (Tentativa de salvar dados de outro tenant)', () => {
    const poisonedMemory: ExecutiveRelationshipMemory = {
      ...baseMemory,
      tenantId: 'tenant-beta', // Tentando injetar memória do beta
    };

    // Salvando usando a identidade do Tenant Alpha
    expect(() => {
      ExecutiveMemoryStore.save(baseIdentity, poisonedMemory);
    }).toThrowError(TenantIsolationViolationError);
  });
});
