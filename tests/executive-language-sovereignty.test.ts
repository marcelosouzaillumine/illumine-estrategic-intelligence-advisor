import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FiduciaryRuntimeAdapter } from '../src/services/FiduciaryRuntimeAdapter';
import { ExecutiveLanguageViolationError } from '../src/core/runtime/presentation-governance/ExecutiveLanguageBoundaryGuard';

describe('Executive Language Sovereignty Framework (ELSF) v1.0 Tests', () => {

  it('1. Registry correctly translates technical terms and institutional keys', () => {
    const registry = FiduciaryRuntimeAdapter.ExecutiveLanguageRegistry;
    assert.strictEqual(registry.translate('BOARD'), 'Conselho');
    assert.strictEqual(registry.translate('EXECUTIVE'), 'Diretoria');
    assert.strictEqual(registry.translate('TECHNICAL'), 'Análise Técnica');
    assert.strictEqual(registry.translate('Runway Fiduciário'), 'Capacidade de Sustentação Financeira');
    assert.strictEqual(registry.translate('FCO'), 'Fluxo Operacional de Caixa');
    assert.strictEqual(registry.translate('CRITICAL'), 'Crítico');
  });

  it('2. BoundaryGuard allows all technical terms under TECHNICAL profile', () => {
    const guard = FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard;
    assert.strictEqual(guard.translate('This is CDIL and EQE', 'TECHNICAL'), 'This is CDIL and EQE');
    assert.strictEqual(guard.translate('Status: CRITICAL', 'TECHNICAL'), 'Status: CRITICAL');
  });

  it('3. BoundaryGuard throws ExecutiveLanguageViolationError under TEST/CI for Level 1 leaks (BOARD/EXECUTIVE)', () => {
    const guard = FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard;

    // Level 1 term "EQE" under BOARD should throw
    assert.throws(() => {
      guard.translate('Análise do motor EQE finalizada', 'BOARD');
    }, ExecutiveLanguageViolationError);

    // Level 1 term "CDIL" under EXECUTIVE should throw
    assert.throws(() => {
      guard.translate('Verificar módulo CDIL', 'EXECUTIVE');
    }, ExecutiveLanguageViolationError);
  });

  it('4. BoundaryGuard throws for Level 2 leaks under BOARD/EXECUTIVE, but allows them in TECHNICAL', () => {
    const guard = FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard;

    // FCO is Level 2
    assert.throws(() => {
      guard.translate('O FCO está negativo', 'BOARD');
    }, ExecutiveLanguageViolationError);

    // Allowed in TECHNICAL
    assert.doesNotThrow(() => {
      guard.translate('O FCO está negativo', 'TECHNICAL');
    });
  });

  it('5. BoundaryGuard translates Level 3 terms successfully', () => {
    const guard = FiduciaryRuntimeAdapter.ExecutiveLanguageBoundaryGuard;
    
    // Level 3 terms (like CRITICAL, WARNING) should be translated automatically.
    // If we translate it, CRITICAL becomes Crítico, which is not a leak.
    const resultCritical = guard.translate('CRITICAL', 'BOARD');
    assert.strictEqual(resultCritical, 'Crítico');

    const resultWarning = guard.translate('WARNING', 'EXECUTIVE');
    assert.strictEqual(resultWarning, 'Atenção');
  });
});
