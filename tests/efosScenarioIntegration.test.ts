import test from 'node:test';
import assert from 'node:assert';
import { adaptScenarioToEFOSInput } from '../src/core/runtime/efos/EFOSScenarioAdapter';
import { calculateInstitutionalExecution } from '../src/core/runtime/efos/InstitutionalExecutionAssessment';

test('▶ EFOS Scenario Integration Engine', async (t) => {
  await t.test('✔ adaptScenarioToEFOSInput: formata corretamente os deltas', () => {
    const efosContext = adaptScenarioToEFOSInput(
      'cen-123',
      'Cenário Expansão',
      1000000,
      200000,
      100000,
      50000,
      5000000,
      1500000
    );

    assert.strictEqual(efosContext.scenarioId, 'cen-123');
    assert.strictEqual(Math.round(efosContext.projectedRevenueGrowth), 20); // 200k / 1M * 100 = 20%
    assert.strictEqual(Math.round(efosContext.projectedCapexGrowth), 50); // 50k / 100k * 100 = 50%
    
    // Complexity = 20 * 0.6 + 50 * 0.4 = 12 + 20 = 32
    assert.strictEqual(Math.round(efosContext.projectedOperationalComplexity), 32);
  });

  await t.test('✔ calculateInstitutionalExecution: classifica como Preparado com EFOS alto e Pressão Baixa', () => {
    const input = {
      efosScore: 85,
      projectedRevenueGrowth: 10,
      projectedCapexGrowth: 10,
      projectedOperationalComplexity: 10
    };

    const output = calculateInstitutionalExecution(input);
    // GPI = (10 * 0.4) + (10 * 0.3) + (10 * 0.3) = 10
    // IEI = 85 (No penalty because GPI < EFOS)
    assert.strictEqual(output.governancePressureIndex, 10);
    assert.strictEqual(output.institutionalExecutionIndex, 85);
    assert.strictEqual(output.riskLevel, 'Baixo');
    assert.strictEqual(output.executionCapacity, 'Preparado');
    assert.ok(output.narrative.includes('Baixo'));
  });

  await t.test('✔ calculateInstitutionalExecution: penaliza IEI quando Pressão (GPI) excede EFOS Score', () => {
    const input = {
      efosScore: 50,
      projectedRevenueGrowth: 100, // Double the size
      projectedCapexGrowth: 100,
      projectedOperationalComplexity: 100
    };

    const output = calculateInstitutionalExecution(input);
    // GPI = 100
    // Penalty = (100 - 50) * 0.5 = 25
    // IEI = 50 - 25 = 25
    assert.strictEqual(output.governancePressureIndex, 100);
    assert.strictEqual(output.institutionalExecutionIndex, 25);
    assert.strictEqual(output.riskLevel, 'Crítico');
    assert.strictEqual(output.executionCapacity, 'Crítico');
  });

  await t.test('✔ calculateInstitutionalExecution: assegura limites de escala 0-100', () => {
    const input = {
      efosScore: 120, // should not happen normally, but tests resilience
      projectedRevenueGrowth: -50,
      projectedCapexGrowth: -50,
      projectedOperationalComplexity: -50
    };

    const output = calculateInstitutionalExecution(input);
    assert.strictEqual(output.governancePressureIndex, 0); // capped at 0
    assert.strictEqual(output.institutionalExecutionIndex, 100); // capped at 100
  });
});
