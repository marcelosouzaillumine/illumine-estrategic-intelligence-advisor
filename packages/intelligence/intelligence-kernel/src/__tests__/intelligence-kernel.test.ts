import { describe, it, expect } from 'vitest';
import { IntelligenceIdentity, ProvenanceReference, IntelligenceArtifact, LearningSignal } from '../index';

describe('@illumine/governance-kernel (Phase 0 Foundation)', () => {
  it('should instantiate GovernanceIdentity and ProvenanceReference correctly', () => {
    const identity: IntelligenceIdentity = {
      id: 'intel-01',
      source: 'financial-engine',
      capability: 'financial-governance',
      version: '1.0.0',
      generatedAt: '2026-07-28T00:00:00Z'
    };

    const prov: ProvenanceReference = {
      sourceId: 'src-erp-100',
      evidenceIds: ['ev-1', 'ev-2'],
      lineageHash: 'sha256-abc123xyz'
    };

    expect(identity.id).toBe('intel-01');
    expect(prov.lineageHash).toBe('sha256-abc123xyz');
  });

  it('should construct GovernanceArtifact with identity and provenance', () => {
    const artifact: IntelligenceArtifact = {
      identity: {
        id: 'artifact-01',
        source: 'risk-engine',
        capability: 'risk-governance',
        version: '1.0.0',
        generatedAt: '2026-07-28T00:00:00Z'
      },
      provenance: {
        sourceId: 'src-risk-1',
        evidenceIds: ['ev-risk-1'],
        lineageHash: 'hash-risk-99'
      },
      payloadType: 'RISK_SCENARIO',
      payload: { riskScore: 88 }
    };

    expect(artifact.payloadType).toBe('RISK_SCENARIO');
    expect(artifact.provenance.lineageHash).toBe('hash-risk-99');
  });

  it('should construct LearningSignal correctly', () => {
    const signal: LearningSignal = {
      signalId: 'sig-01',
      caseId: 'case-100',
      decisionId: 'dec-100',
      signalType: 'ACCURACY_ADJUSTMENT',
      magnitude: 0.15,
      provenance: {
        sourceId: 'src-evaluator',
        evidenceIds: [],
        lineageHash: 'hash-eval'
      },
      emittedAt: '2026-07-28T00:00:00Z'
    };

    expect(signal.signalType).toBe('ACCURACY_ADJUSTMENT');
    expect(signal.magnitude).toBe(0.15);
  });
});
