import { describe, it, expect } from 'vitest';
import { ExecutiveInteractionDecisionEngine } from '../ExecutiveInteractionDecisionEngine';
import { SessionEvent, SessionContext } from '../ExecutiveSessionIntelligence';
import { ExecutiveRelationshipState } from '../ExecutiveRelationshipState';

describe('Executive Relationship Intelligence (ERI) - Behavioral Calibration', () => {
  const baseState: ExecutiveRelationshipState = {
    userIdentity: 'test_user',
    operationalRole: 'CLIENT',
    executivePersona: 'CEO',
    companyContext: 'tenant_test',
    lastAccess: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    journeyStage: 'ACTIVE',
    activeRecommendations: 0,
    unresolvedItems: 0,
    relevantChanges: 0,
    communicationPreference: 'direct',
    interactionMode: 'PROACTIVE'
  };

  const baseContext = (event: SessionEvent): SessionContext => ({
    event,
    timestamp: new Date().toISOString(),
    contextDescription: 'Acesso simulado',
    impactDescription: 'Pode alterar a percepção de risco.',
    recipientIdentified: true,
    potentialAction: 'Rever indicadores.'
  });

  // Cenário 1: FIRST_ACCESS_OF_DAY
  it('Cenário 1: FIRST_ACCESS_OF_DAY com valor executivo dispara Briefing', () => {
    const ctx = {
      ...baseContext(SessionEvent.FIRST_ACCESS_OF_DAY),
      changes: 3,
      recommendations: 2,
      criticalAlerts: 1
    };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    // Deve pontuar alto o suficiente (>=60 e com novidade) para Briefing
    expect(decision.mode).toBe('EXECUTIVE_BRIEFING');
    expect(decision.score!.totalScore).toBeGreaterThanOrEqual(60);
  });

  // Cenário 6: False Positive Protection
  it('Cenário 6: FIRST_ACCESS_OF_DAY sem valor executivo cai em SILENT_MODE (False Positive Protection)', () => {
    const ctx = {
      ...baseContext(SessionEvent.FIRST_ACCESS_OF_DAY),
      changes: 0,
      recommendations: 0,
      criticalAlerts: 0
    };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    expect(decision.mode).toBe('SILENT_MODE');
  });

  // Cenário 2: SESSION_RESUME
  it('Cenário 2: SESSION_RESUME nunca dispara briefing repetitivo', () => {
    const ctx = {
      ...baseContext(SessionEvent.SESSION_RESUME),
      changes: 0,
      recommendations: 0,
      criticalAlerts: 0
    };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    expect(decision.mode).toBe('SILENT_MODE');
  });

  // Cenário 3: LONG_ABSENCE
  it('Cenário 3: LONG_ABSENCE gera Briefing Evolutivo com score alto', () => {
    const ctx = { ...baseContext(SessionEvent.LONG_ABSENCE) };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    expect(decision.mode).toBe('EXECUTIVE_BRIEFING');
    expect(decision.score!.totalScore).toBeGreaterThanOrEqual(70);
  });

  // Cenário 4 e 7: CRITICAL_EVENT (Executive Value Override)
  it('Cenário 4 e 7: CRITICAL_EVENT (Executive Value Override) bypassa score baixo', () => {
    const ctx = {
      ...baseContext(SessionEvent.CRITICAL_EVENT),
      isCriticalOverride: true, // Força a quebra
      contextDescription: undefined // Mesmo faltando um pilar obrigatório do Gate, Override prevalece
    };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    expect(decision.mode).toBe('CRITICAL_ALERT');
  });

  // Cenário 5: PAGE_CONTEXT_UPDATE
  it('Cenário 5: PAGE_CONTEXT_UPDATE atua de forma silenciosa (se sem eventos críticos)', () => {
    const ctx = {
      ...baseContext(SessionEvent.PAGE_CONTEXT_UPDATE),
      changes: 0,
      recommendations: 0
    };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    expect(decision.mode).toBe('SILENT_MODE');
  });

  // AR-GFC-ERI-006: Executive Value Minimum
  it('AR-GFC-ERI-006: Barra eventos sem identificação de impacto', () => {
    const ctx = {
      ...baseContext(SessionEvent.LONG_ABSENCE),
      impactDescription: undefined // Faltando
    };
    const decision = ExecutiveInteractionDecisionEngine.decide(ctx, baseState);
    // Deveria ser BRIEFING pelo LONG_ABSENCE, mas cai no GATE e vira SILENT_MODE
    expect(decision.mode).toBe('SILENT_MODE');
    expect(decision.reasoning).toContain('AR-GFC-ERI-006');
  });
});
