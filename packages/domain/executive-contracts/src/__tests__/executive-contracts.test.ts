import { describe, it, expect } from 'vitest';
import { Maturity, Stability, CapabilityManifest, BoardResolution, CompatibilityLevel } from '../index';
import { Score, Confidence } from '@illumine/core-primitives';

describe('@illumine/executive-contracts Pure Canonical Contracts', () => {
  it('should instantiate CapabilityManifest with correct enums and cognitiveProfile', () => {
    const manifest: CapabilityManifest = {
      id: 'cap-fin-01',
      name: 'Financial Intelligence Capability',
      version: '1.0.0',
      maturity: Maturity.CERTIFIED,
      stability: Stability.CANONICAL,
      dependencies: {
        dependencyContracts: ['Recommendation', 'PredictionRange'],
        dependencyCapabilities: ['accounting-intelligence']
      },
      cognitiveProfile: {
        reasoning: true,
        prediction: true,
        recommendation: true,
        explanation: true
      },
      governance: {
        explainabilityScore: 98,
        confidenceThreshold: 0.8
      }
    };

    expect(manifest.maturity).toBe(Maturity.CERTIFIED);
    expect(manifest.stability).toBe(Stability.CANONICAL);
    expect(manifest.cognitiveProfile.explanation).toBe(true);
  });

  it('should support BoardResolution versioning', () => {
    const res: BoardResolution = {
      resolutionId: 'res-100',
      resolutionVersion: 'v1',
      caseId: 'case-50',
      title: 'Aprovação de Reestruturação de Dívida',
      boardDecision: 'APPROVED',
      approvedByHumanUser: 'CEO Marcelo Souza',
      resolutionText: 'Fica aprovada a reestruturação da dívida bancária.',
      effectiveTimestamp: '2026-07-28T00:00:00Z'
    };

    expect(res.resolutionVersion).toBe('v1');
    expect(res.boardDecision).toBe('APPROVED');
  });

  it('should validate CompatibilityLevel enum', () => {
    expect(CompatibilityLevel.MAJOR).toBe('MAJOR');
  });
});
