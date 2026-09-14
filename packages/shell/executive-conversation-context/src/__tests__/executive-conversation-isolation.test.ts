import { describe, it, expect } from 'vitest';
import { ExecutiveConversationIsolationGuard } from '../ExecutiveConversationIsolationGuard';
import { ExecutiveConversationContext } from '../ExecutiveConversationContext';
import { ExecutiveConversationIsolationViolationError } from '../ExecutiveConversationIsolationViolationError';
import { ExecutiveIdentityContext } from '../../../executive-identity-context/src/ExecutiveIdentityContext';
import { parseNarrative } from '../../../../ui/executive-narrative-renderer/src/parser/markdownParser';
import { sanitizeNarrative } from '../../../../ui/executive-narrative-renderer/src/parser/sanitize';

describe('Wave G5.0.2.2: Executive Conversation Identity Continuity™', () => {

  const baseIdentity: ExecutiveIdentityContext = {
    userId: 'user-a',
    tenantId: 'tenant-a',
    organizationId: 'org-a',
    operationalRole: 'CLIENT',
    executivePersona: 'CEO',
    permissions: [],
    sessionId: 'session-123',
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000),
    identitySource: 'SYSTEM'
  };

  const baseConversation: ExecutiveConversationContext = {
    conversationId: 'conv-1',
    tenantId: 'tenant-a',
    organizationId: 'org-a',
    userId: 'user-a',
    operationalRole: 'CLIENT',
    sessionId: 'session-123',
    identityValidatedAt: new Date(),
    createdAt: new Date(),
    lastInteractionAt: new Date()
  };

  it('Cenário 1 — Cross Tenant History Leakage', () => {
    // Tentativa de carregar Conversation B (tenant-b) com Identity A (tenant-a)
    const conversationB = { ...baseConversation, tenantId: 'tenant-b', conversationId: 'conv-2' };
    
    expect(() => {
      ExecutiveConversationIsolationGuard.authorize(baseIdentity, conversationB);
    }).toThrowError(ExecutiveConversationIsolationViolationError);
  });

  it('Cenário 2 — Session Switching (Empresa A -> Empresa B)', () => {
    // Simula a mudança de Identity para a Empresa B (tenant-b)
    const identityB = { ...baseIdentity, tenantId: 'tenant-b', organizationId: 'org-b' };
    
    // Antiga conversa (baseConversation) pertencia a tenant-a
    expect(() => {
      ExecutiveConversationIsolationGuard.authorize(identityB, baseConversation);
    }).toThrowError(ExecutiveConversationIsolationViolationError);
  });

  it('Cenário 3 — Admin / Client Separation', () => {
    // Admin não pode recuperar Client private conversations (divergência de userId/organization se for tenant amplo)
    // Se o Admin se logar, sua identity tem userId admin. Se a conversa foi criada por user-a, bloqueia.
    const adminIdentity = { ...baseIdentity, operationalRole: 'ADMIN', userId: 'admin-1' } as const;
    
    expect(() => {
      ExecutiveConversationIsolationGuard.authorize(adminIdentity, baseConversation);
    }).toThrowError(ExecutiveConversationIsolationViolationError);
  });

  it('Cenário 4 — Memory Conversation Binding', () => {
    // O ConversationGuard protege a própria conversa. Se a conversa é inválida,
    // a memória atrelada à conversa também será inacessível.
    // Aqui validamos que a authorize falha se o tenant, org ou userId falhar.
    const wrongUserConversation = { ...baseConversation, userId: 'user-b' };
    
    expect(() => {
      ExecutiveConversationIsolationGuard.authorize(baseIdentity, wrongUserConversation);
    }).toThrowError(ExecutiveConversationIsolationViolationError);
  });

  it('Cenário 5 — Markdown Rendering (Parser Validation)', () => {
    const input = '**Contexto:** Ambiente executivo';
    const tokens = parseNarrative(input);
    
    expect(tokens.length).toBe(2);
    expect(tokens[0].type).toBe('emphasis');
    expect(tokens[0].content).toBe('Contexto:');
    expect(tokens[1].type).toBe('text');
    expect(tokens[1].content).toBe('Ambiente executivo');
  });

  it('Cenário 6 — Malformed Narrative Input', () => {
    const input = '<script>alert("Hacked!")</script>Ocorreu um erro no balanço.';
    const sanitized = sanitizeNarrative(input);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('Ocorreu um erro no balanço.');
  });

  it('Cenário 7 — Unsupported Markdown Feature (External Links)', () => {
    const input = 'Verifique o relatório em [DRE Completo](https://malicious.com)';
    const sanitized = sanitizeNarrative(input);
    
    expect(sanitized).toBe('Verifique o relatório em DRE Completo');
    expect(sanitized).not.toContain('https://');
  });

  it('Cenário 8 — Agent Output Boundary Test (Tenant Isolation Integration)', () => {
    // Simular que o Financial Agent gerou um briefing e gravou na conversa A.
    // Se o User B tentar carregar essa conversa, ele deve ser bloqueado no Guard 
    // antes de chegar no ExecutiveNarrativeRenderer.
    const identityB = { ...baseIdentity, userId: 'user-b' };
    
    expect(() => {
      ExecutiveConversationIsolationGuard.authorize(identityB, baseConversation);
    }).toThrowError('Este contexto executivo não está disponível para esta identidade.');
  });

});
