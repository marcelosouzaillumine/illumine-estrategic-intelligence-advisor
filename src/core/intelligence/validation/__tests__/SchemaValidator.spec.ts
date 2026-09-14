import { describe, it, expect } from 'vitest';
import { SchemaValidator } from '../SchemaValidator';
import { ExecutiveArtifact } from '../../contracts/schema/v1/ExecutiveArtifact.schema';

const createValidBaseArtifact = (): ExecutiveArtifact => ({
  meta: {
    runtimeVersion: '1.2.5',
    knowledgeVersion: '1.0',
    ontologyVersion: '1.0',
    processingTimeMs: 100,
    pipelineId: 'test_pipeline',
    sessionId: 'session_123',
    executionId: 'exec_456'
  },
  knowledgeContext: {
    ontologyVersion: '1.0',
    conceptsUsed: ['liquidity'],
    knowledgePacksUsed: ['liquidity_pack'],
    knowledgeProvenance: []
  },
  financialInsights: { observations: [], patterns: [], strengths: [], attentionPoints: [], opportunities: [] },
  reasoning: {
    facts: [{ metric: 'Current Ratio', value: 1.5, source: 'Balance Sheet' }],
    observations: [],
    patterns: [],
    hypotheses: [],
    insights: [],
    findings: []
  },
  decision: {
    risks: [],
    opportunities: [],
    decisionOptions: [],
    recommendations: [],
    nextBestActions: []
  },
  governance: {
    confidence: { score: 90, level: 'HIGH', factors: [] },
    decisionProvenance: [{
      source: 'Balance Sheet',
      evidence: 'Current Ratio is 1.5',
      knowledgeUsed: 'liquidity_pack',
      ruleApplied: 'standard_liquidity',
      inference: 'Adequate liquidity',
      finding: 'Stable position',
      decision: 'Maintain',
      outcome: 'None',
      confidence: 90,
      timestamp: new Date().toISOString(),
      engine: 'DecisionEngine',
      knowledgeVersion: '1.0',
      ontologyVersion: '1.0',
      runtimeVersion: '1.2.5'
    }]
  }
});

describe('SchemaValidator', () => {
  it('should pass a fully compliant artifact', () => {
    const artifact = createValidBaseArtifact();
    expect(() => SchemaValidator.validate(artifact)).not.toThrow();
  });

  it('should block Finding without relatedFacts (Hallucination Prevention)', () => {
    const artifact = createValidBaseArtifact();
    artifact.reasoning.findings.push({
      type: 'RISK',
      title: 'Fake Risk',
      finding: 'This risk is not based on facts',
      relatedFacts: [] // Empty facts
    });

    expect(() => SchemaValidator.validate(artifact)).toThrowError(/BLOCKED - Governance Validation Failed: Finding without Fact/);
  });

  it('should pass Finding with relatedFacts', () => {
    const artifact = createValidBaseArtifact();
    artifact.reasoning.findings.push({
      type: 'STRENGTH',
      title: 'Strong Liquidity',
      finding: 'Liquidity is well above average',
      relatedFacts: ['Current Ratio']
    });

    expect(() => SchemaValidator.validate(artifact)).not.toThrow();
  });

  it('should block Recommendation without Confidence', () => {
    const artifact = createValidBaseArtifact();
    
    // We cast to unknown to bypass TS compile check and simulate runtime bypass
    const recWithoutConfidence = {
      action: 'Invest',
      reason: 'Excess cash',
      priority: 'HIGH',
      timeframe: 'Q1',
      expectedImpact: 'Growth',
      risk: 'Low'
    };
    
    artifact.decision.recommendations.push(recWithoutConfidence as unknown as never);

    // Should fail Zod structure validation first because confidenceLevel is required
    expect(() => SchemaValidator.validate(artifact)).toThrow();
  });

  it('should block if Overall Confidence is missing', () => {
    const artifact = createValidBaseArtifact();
    (artifact.governance as unknown as Record<string, unknown>).confidence = undefined;

    expect(() => SchemaValidator.validate(artifact)).toThrow();
  });

  it('should block if Decision Provenance Trace is missing', () => {
    const artifact = createValidBaseArtifact();
    artifact.governance.decisionProvenance = [];

    expect(() => SchemaValidator.validate(artifact)).toThrowError(/BLOCKED - Governance Validation Failed: No Decision Provenance Trace/);
  });
});
