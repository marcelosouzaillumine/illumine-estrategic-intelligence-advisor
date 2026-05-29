// tests/institutional-war-gaming.test.ts

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalWarGameEngine } from '../src/core/runtime/war-gaming/InstitutionalWarGameEngine';
import { LongitudinalCrisisMemoryEngine } from '../src/core/runtime/war-gaming/LongitudinalCrisisMemoryEngine';
import { CrisisInput } from '../src/core/runtime/war-gaming/war-gaming-types';

describe('RC-1.8 - Institutional War Gaming & Crisis Intelligence', () => {

  beforeEach(() => {
    LongitudinalCrisisMemoryEngine.clearMemoryForTests();
  });

  const validBaseline = {
    hasDFC: true,
    hasValidCash: true,
    hasValidFunding: true,
    initialCash: 100000,
    receita: 500000,
    margemContribuicaoPct: 0.4,
    custosFixos: 150000,
    ebitda: 50000,
    prazoMedioFornecedores: 30,
    estoques: 80000,
    simulatedMonthlyCashFlow: 4000, // Ebitda / 12 approx
    covenantThresholds: { minEbitda: 20000, minCash: 20000 }
  };

  it('Deve bloquear simulação se a magnitude exceder 100% de perda estrutural', () => {
    const invalidInputs: CrisisInput[] = [{
      id: 'CR-1',
      type: 'REVENUE_COMPRESSION',
      description: 'Queda irrealista',
      magnitude: 1.5, // 150%
      targetVariable: 'Receita Líquida',
      durationMonths: 12
    }];

    assert.throws(() => {
      InstitutionalWarGameEngine.executeScenario('SCEN-1', 'HASH-1', invalidInputs, validBaseline);
    }, /FIDUCIARY_VIOLATION/);
  });

  it('Deve barrar simulação (Fail-Closed) se baseline de tesouraria ou DFC não for fiduciário', () => {
    const inputs: CrisisInput[] = [{
      id: 'CR-2',
      type: 'REVENUE_COMPRESSION',
      description: 'Queda severa',
      magnitude: 0.5,
      targetVariable: 'Receita Líquida',
      durationMonths: 12
    }];

    assert.throws(() => {
      InstitutionalWarGameEngine.executeScenario('SCEN-2', 'HASH-1', inputs, { ...validBaseline, hasDFC: false });
    }, /FIDUCIARY_VIOLATION.*DFC ausente/i);
  });

  it('Deve simular propagação e exaustão (Treasury Collapse) sob pressão extrema', () => {
    const inputs: CrisisInput[] = [{
      id: 'CR-3',
      type: 'REVENUE_COMPRESSION',
      description: 'Compressão severa',
      magnitude: 0.6, // -60% revenue
      targetVariable: 'Receita Líquida',
      durationMonths: 12
    }];

    const result = InstitutionalWarGameEngine.executeScenario('SCEN-3', 'B-HASH-3', inputs, validBaseline);
    
    assert.equal(result.scenario.status, 'COMPLETED');
    assert.ok(result.propagation.length > 0);
    
    const ebitdaNode = result.propagation.find(n => n.variable === 'EBITDA');
    assert.ok(ebitdaNode);
    assert.ok(ebitdaNode!.simulatedValue < 0, 'EBITDA deve ficar negativo com essa compressão pesada');

    assert.equal(result.treasurySurvival.exhaustionPointReached, true);
    assert.ok(result.treasurySurvival.availableRunwayMonths < 24);

    assert.equal(result.thesis.sustainabilityStatus, 'INSUSTENTÁVEL');
  });

  it('Deve persistir na memória longitudinal fiduciariamente', () => {
    const inputs: CrisisInput[] = [{
      id: 'CR-4',
      type: 'SUPPLIER_SHOCK',
      description: 'Redução de prazo',
      magnitude: 0.5,
      targetVariable: 'Prazo',
      durationMonths: 6
    }];

    InstitutionalWarGameEngine.executeScenario('SCEN-4', 'B-HASH-4', inputs, validBaseline);
    
    const memory = LongitudinalCrisisMemoryEngine.getHistoricalCrises();
    assert.equal(memory.length, 1);
    assert.equal(memory[0].scenarioId, 'SCEN-4');
    assert.ok(memory[0].lineageHash);
  });
});
