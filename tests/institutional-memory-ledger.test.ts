import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalDecisionLedger } from '../src/core/runtime/institutional-memory/InstitutionalDecisionLedger';
import { RecommendationPersistenceTracker } from '../src/core/runtime/institutional-memory/RecommendationPersistenceTracker';
import { InstitutionalTrajectoryGuard } from '../src/core/runtime/institutional-memory/InstitutionalTrajectoryGuard';
import { FiduciaryEvolutionEngine } from '../src/core/runtime/institutional-memory/FiduciaryEvolutionEngine';
import { InstitutionalContinuityResolver } from '../src/core/runtime/institutional-memory/InstitutionalContinuityResolver';

describe('Institutional Decision Intelligence Layer', () => {

  it('deve garantir que o Ledger é append-only', () => {
    const ledger = new InstitutionalDecisionLedger();
    ledger.appendEvent({
      cycleId: 'c1',
      domain: 'recommendation',
      eventType: 'Redução de Estoque',
      severity: 'HIGH',
      evidence: [],
      source: 'runtime'
    });

    const events = ledger.getEvents();
    assert.equal(events.length, 1);
    
    // Ensure it's frozen
    assert.throws(() => {
      (events as any).push({});
    });
  });

  it('deve marcar recomendação como CRITICAL_IGNORANCE se repetida 3+ ciclos', () => {
    const ledger = new InstitutionalDecisionLedger();
    
    for (let i = 0; i < 3; i++) {
      ledger.appendEvent({
        cycleId: `c${i}`,
        domain: 'recommendation',
        eventType: 'Otimizar Passivos',
        severity: 'HIGH',
        evidence: [],
        source: 'runtime'
      });
    }

    const recs = RecommendationPersistenceTracker.track(ledger);
    const target = recs.find((r: any) => r.recommendation === 'Otimizar Passivos');
    
    assert.ok(target !== undefined);
    assert.equal(target!.status, 'CRITICAL_IGNORANCE');
    assert.equal(target!.consecutiveCycles, 3);
  });

  it('deve bloquear claims evolutivos se houver apenas 1 ciclo (Fail-Closed Longitudinal)', () => {
    const canEmit = InstitutionalTrajectoryGuard.canEmitEvolutionaryClaims(1);
    assert.equal(canEmit, false);

    const safeClaim = InstitutionalTrajectoryGuard.enforce(1, 'Melhoria absurda estrutural');
    assert.ok(safeClaim.includes('Diagnóstico Inicial'));
  });

  it('deve bloquear falso turnaround em apenas 1 ciclo positivo sem histórico sustentado', () => {
    const ledger = new InstitutionalDecisionLedger();
    // No sustained structural improvements in ledger
    
    const turnaround = FiduciaryEvolutionEngine.validateTurnaround(ledger, true, 3);
    assert.equal(turnaround.isTrueTurnaround, false);
    assert.ok(turnaround.reason.includes('Recuperação pontual sem sustentação'));
  });

  it('deve classificar como Deterioração Progressiva se múltiplos eventos críticos', () => {
    const ledger = new InstitutionalDecisionLedger();
    ledger.appendEvent({ cycleId: '1', domain: 'bp', eventType: 'DETERIORATION', severity: 'CRITICAL', evidence: [], source: 'runtime' });
    ledger.appendEvent({ cycleId: '2', domain: 'dfc', eventType: 'DETERIORATION', severity: 'HIGH', evidence: [], source: 'runtime' });

    const insight = InstitutionalContinuityResolver.resolve(ledger, 4);
    assert.equal(insight.status, 'DETERIORAÇÃO_PROGRESSIVA');
  });

});
