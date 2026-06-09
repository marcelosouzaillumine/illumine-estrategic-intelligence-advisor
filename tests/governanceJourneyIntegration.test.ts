import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateInstitutionalReadiness } from '../src/core/runtime/governance/InstitutionalReadinessAssessment';
import { generateInstitutionalRoadmap } from '../src/core/runtime/governance/RoadmapPrioritizationEngine';

describe('InstitutionalReadinessAssessment Engine', () => {
  it('should calculate IRG correctly for a healthy scenario', () => {
    const input = {
      efosScore: 85,
      ieiScore: 82, // High execution capability
      governancePressureIndex: 10, // Low pressure
      enterpriseValueDelta: 5000000,
      projectedOperationalComplexity: 10
    };

    const result = calculateInstitutionalReadiness(input);
    
    assert.ok(Math.abs(result.readinessGap - 21) < 1.0);
    assert.strictEqual(result.readinessLevel, 'Pequenos Ajustes');
    assert.strictEqual(result.governancePriority, 'Formalização de Processos Chave e Comitês Menores');
  });

  it('should calculate IRG correctly for an aggressive and pressured scenario', () => {
    const input = {
      efosScore: 40,
      ieiScore: 20, // Low execution capability due to penalty
      governancePressureIndex: 90, // High pressure
      enterpriseValueDelta: 20000000,
      projectedOperationalComplexity: 80
    };

    const result = calculateInstitutionalReadiness(input);
    
    assert.strictEqual(result.readinessGap, 100);
    assert.strictEqual(result.readinessLevel, 'Alto Risco Institucional');
  });

  it('should ensure determinism even with 100 IEI', () => {
    const input = {
      efosScore: 30,
      ieiScore: 100, // Artificially high
      governancePressureIndex: 0,
      enterpriseValueDelta: 0,
      projectedOperationalComplexity: 0
    };

    const result = calculateInstitutionalReadiness(input);
    
    assert.ok(result.readinessGap >= 35);
  });
});

describe('RoadmapPrioritizationEngine', () => {
  it('should trigger and order actions correctly for High IRG and High GPI', () => {
    const input = {
      irg: 85,
      gpi: 90
    };

    const roadmap = generateInstitutionalRoadmap(input);

    assert.ok(roadmap.curtoPrazo.length > 0);
    assert.ok(roadmap.medioPrazo.length > 0);
    assert.ok(roadmap.longoPrazo.length > 0);

    const hasHighPriority = roadmap.curtoPrazo.find((a: any) => a.title.includes('Formalizar processo decisório') || a.title.includes('Criar política de alçadas'));
    assert.ok(hasHighPriority !== undefined);
  });

  it('should return empty roadmap if both IRG and GPI are zero', () => {
    const input = {
      irg: 0,
      gpi: 0
    };

    const roadmap = generateInstitutionalRoadmap(input);

    assert.strictEqual(roadmap.curtoPrazo.length, 0);
    assert.strictEqual(roadmap.medioPrazo.length, 0);
    assert.strictEqual(roadmap.longoPrazo.length, 0);
  });
});
