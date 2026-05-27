import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CommercialPilotSessionManager } from '../src/core/commercial/CommercialPilotSessionManager';
import { PilotFeedbackEngine } from '../src/core/commercial/PilotFeedbackEngine';
import { PilotExperienceMetrics } from '../src/core/commercial/PilotExperienceMetrics';
import { ExecutiveAttentionTracking } from '../src/core/commercial/ExecutiveAttentionTracking';

describe('Phase 11: Commercial Pilot Activation & Telemetry Tests', () => {
  beforeEach(() => {
    CommercialPilotSessionManager.clearForTest();
    PilotFeedbackEngine.clearForTest();
    PilotExperienceMetrics.clearForTest();
    ExecutiveAttentionTracking.clearForTest();
  });

  // 1. Session Manager Lifecycles & Isolation
  it('1. CommercialPilotSessionManager deve registrar sessões e gerar audit trail isolado por tenant', () => {
    const s1 = CommercialPilotSessionManager.startSession('TENANT-A', 'ONBOARDING_SESSION', 'usr_1');
    const s2 = CommercialPilotSessionManager.startSession('TENANT-B', 'BOARD_SESSION', 'usr_2');

    assert.equal(s1.status, 'ACTIVE');
    assert.equal(s2.status, 'ACTIVE');

    // Tenant isolation
    const tenantASessions = CommercialPilotSessionManager.getAllSessions('TENANT-A');
    const tenantBSessions = CommercialPilotSessionManager.getAllSessions('TENANT-B');
    assert.equal(tenantASessions.length, 1);
    assert.equal(tenantBSessions.length, 1);
    assert.equal(tenantASessions[0].sessionId, s1.sessionId);
    assert.equal(tenantBSessions[0].sessionId, s2.sessionId);

    // End session
    CommercialPilotSessionManager.endSession(s1.sessionId, 'TENANT-A');
    assert.equal(s1.status, 'COMPLETED');
    assert.ok(s1.endedAt);

    // Audit trail verification
    const trailA = CommercialPilotSessionManager.getAuditTrail('TENANT-A');
    const trailB = CommercialPilotSessionManager.getAuditTrail('TENANT-B');
    assert.equal(trailA.length, 2); // Start and End
    assert.equal(trailB.length, 1); // Start only
    assert.equal(trailA[0].action, 'SESSION_START');
    assert.equal(trailA[1].action, 'SESSION_END');
  });

  it('2. CommercialPilotSessionManager deve rejeitar sessões se parâmetros fiduciários obrigatórios faltarem', () => {
    assert.throws(() => {
      CommercialPilotSessionManager.startSession('', 'ONBOARDING_SESSION', 'usr_1');
    }, /tenantId obrigatório/);

    assert.throws(() => {
      CommercialPilotSessionManager.startSession('TENANT-A', 'ONBOARDING_SESSION', '');
    }, /actorId obrigatório/);
  });

  // 2. Feedback Scale Validation
  it('3. PilotFeedbackEngine deve validar chaves obrigatórias e escalas de 1 a 5', () => {
    // Missing tenant
    assert.throws(() => {
      PilotFeedbackEngine.registerFeedback({
        tenantId: '',
        sessionId: 'SESS-01',
        actorId: 'usr_1',
        confidencePerception: 5,
        narrativeClarity: 5,
        valuePerception: 5,
        excessiveNoise: 1,
        irrelevantWarnings: 1,
        confusionPoints: 'Nenhum'
      });
    }, /tenantId obrigatório/);

    // Score out of bounds (> 5)
    assert.throws(() => {
      PilotFeedbackEngine.registerFeedback({
        tenantId: 'TENANT-A',
        sessionId: 'SESS-01',
        actorId: 'usr_1',
        confidencePerception: 6, // Invalid
        narrativeClarity: 5,
        valuePerception: 5,
        excessiveNoise: 1,
        irrelevantWarnings: 1,
        confusionPoints: 'Nenhum'
      });
    }, /confidencePerception deve ser uma nota de 1 a 5/);

    // Score out of bounds (< 1)
    assert.throws(() => {
      PilotFeedbackEngine.registerFeedback({
        tenantId: 'TENANT-A',
        sessionId: 'SESS-01',
        actorId: 'usr_1',
        confidencePerception: 0, // Invalid
        narrativeClarity: 5,
        valuePerception: 5,
        excessiveNoise: 1,
        irrelevantWarnings: 1,
        confusionPoints: 'Nenhum'
      });
    }, /confidencePerception deve ser uma nota de 1 a 5/);

    // Valid feedback
    const feedback = PilotFeedbackEngine.registerFeedback({
      tenantId: 'TENANT-A',
      sessionId: 'SESS-01',
      actorId: 'usr_1',
      confidencePerception: 4,
      narrativeClarity: 5,
      valuePerception: 5,
      excessiveNoise: 2,
      irrelevantWarnings: 1,
      confusionPoints: 'Nenhum'
    });

    assert.ok(feedback.feedbackId);
    assert.equal(feedback.confidencePerception, 4);

    const feedbacks = PilotFeedbackEngine.getFeedbackByTenant('TENANT-A');
    assert.equal(feedbacks.length, 1);
  });

  // 3. Operational-only metrics calculation
  it('4. PilotExperienceMetrics deve calcular passivamente apenas as métricas operacionais comerciais do piloto', () => {
    const tenantId = 'TENANT-METRICS';
    
    // Log exports
    PilotExperienceMetrics.logExport(tenantId);
    PilotExperienceMetrics.logExport(tenantId);

    // Log insight times (e.g. 40s and 60s)
    PilotExperienceMetrics.logTimeToInsight(tenantId, 40);
    PilotExperienceMetrics.logTimeToInsight(tenantId, 60);

    // Log onboarding times (e.g. 90s and 110s)
    PilotExperienceMetrics.logOnboardingTime(tenantId, 90);
    PilotExperienceMetrics.logOnboardingTime(tenantId, 110);

    // Log a session for usage rate count
    CommercialPilotSessionManager.startSession(tenantId, 'ONBOARDING_SESSION', 'usr_1');

    const metrics = PilotExperienceMetrics.calculate(tenantId);
    assert.equal(metrics.averageTimeToInsightSeconds, 50.0);
    assert.equal(metrics.averageOnboardingTimeSeconds, 100.0);
    assert.equal(metrics.exportFrequencyCount, 2);
    assert.equal(metrics.usageRateCount, 1);

    // Ensure we do not calculate scores or risk
    assert.equal((metrics as any).score, undefined);
    assert.equal((metrics as any).risk, undefined);
  });

  // 4. Privacy-safe attention tracking
  it('5. ExecutiveAttentionTracking deve rastrear cliques e tempo gasto sem coletar PII ou biometria', () => {
    const tenantId = 'TENANT-TRACK';
    const log = {
      tenantId,
      sessionId: 'SESS-100',
      sectionId: 'FINANCIAL_HEALTH',
      timeSpentSeconds: 120,
      clickCount: 15,
      flowAbandoned: false
    };

    ExecutiveAttentionTracking.logAttention(log);
    const logs = ExecutiveAttentionTracking.getLogsForTenant(tenantId);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].sectionId, 'FINANCIAL_HEALTH');
    assert.equal(logs[0].timeSpentSeconds, 120);
    assert.equal(logs[0].clickCount, 15);
  });
});
