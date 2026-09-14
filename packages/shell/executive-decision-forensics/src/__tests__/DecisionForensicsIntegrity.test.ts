import { describe, it, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { DecisionForensicEngine } from '../engines/DecisionForensicEngine';
import { ExecutiveDecisionForensicsPackage } from '../models/ExecutiveDecisionForensicsPackage';
import { RecommendationNode } from '../models/DecisionLineage';

describe('Decision Forensics Integrity (GFC-COG-013)', () => {
  let engine: DecisionForensicEngine;
  let validRecNode: RecommendationNode;
  
  beforeEach(() => {
    engine = new DecisionForensicEngine();
    validRecNode = {
      id: 'REC-001',
      parentId: 'RSN-001',
      type: 'RECOMMENDATION',
      timestamp: new Date().toISOString(),
      suggestion: 'Test Rec',
      impactScore: 90
    };
  });

  it('BLOCK: Rejeita recomendação sem cadeia de evidência', () => {
    const rawPackage: Partial<ExecutiveDecisionForensicsPackage> = {
      decisionId: 'DEC-1',
      tenantId: 'T1',
      initiatedBy: { tenantId: 'T1', userId: 'U1', role: 'CEO', sessionTokenHash: 'h' },
      observationChain: [{ id: 'OBS-1', type: 'OBSERVATION', description: 'desc', source: 'src', timestamp: '' }],
      // missing evidence chain
      reasoningChain: [{ id: 'RSN-001', parentId: 'EVD-1', type: 'REASONING', logicApplied: 'A', alternativesDiscarded: [], timestamp: '' }],
      confidenceEvolution: [{ timestamp: '', score: 90, factors: [] }],
      governanceChecks: [{ ruleId: 'R1', status: 'PASSED', details: '', timestamp: '' }],
      finalRecommendation: validRecNode
    };

    assert.throws(
      () => engine.compileForensicTrace(rawPackage),
      /Missing evidence chain/
    );
  });

  it('IMMUTABLE TRACE VIOLATION: Falha ao tentar alterar hash forense', () => {
    const originalHash = 'abc123hash';
    const tamperedHash = 'xyz987hash';
    
    assert.throws(
      () => engine.verifyTraceImmutability(originalHash, tamperedHash),
      /IMMUTABLE TRACE VIOLATION: The historical trace has been altered\./
    );
  });

  it('FORENSIC CHAIN BROKEN: Recomendação aponta para raciocínio inexistente', () => {
    const rawPackage: Partial<ExecutiveDecisionForensicsPackage> = {
      decisionId: 'DEC-1',
      tenantId: 'T1',
      initiatedBy: { tenantId: 'T1', userId: 'U1', role: 'CEO', sessionTokenHash: 'h' },
      observationChain: [{ id: 'OBS-1', type: 'OBSERVATION', description: 'desc', source: 'src', timestamp: '' }],
      evidenceChain: [{ id: 'EVD-1', type: 'EVIDENCE', dataPoint: 'DP', confidence: 90, timestamp: '' }],
      reasoningChain: [{ id: 'RSN-002', parentId: 'EVD-1', type: 'REASONING', logicApplied: 'A', alternativesDiscarded: [], timestamp: '' }],
      confidenceEvolution: [{ timestamp: '', score: 90, factors: [] }],
      governanceChecks: [{ ruleId: 'R1', status: 'PASSED', details: '', timestamp: '' }],
      finalRecommendation: validRecNode // aponta para RSN-001
    };

    assert.throws(
      () => engine.compileForensicTrace(rawPackage),
      /FORENSIC CHAIN BROKEN: Recommendation points to unknown reasoning ID\./
    );
  });
});
