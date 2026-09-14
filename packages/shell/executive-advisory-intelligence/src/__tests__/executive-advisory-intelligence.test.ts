/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import {
  ExecutiveAdvisorEngine,
  ExecutiveRecommendationEngine,
  StrategicScenarioEngine,
  AdvisoryTrustEngine,
  HumanExecutiveReviewEngine
} from '../index';

describe('Wave 19.6 — Executive Advisory Governance Layer (EAIL v1.0)', () => {
  it('should generate advisory package with recommendations and counterArguments', () => {
    const advisory = ExecutiveAdvisorEngine.generateExecutiveAdvisory('empresa-01');
    expect(advisory.companyId).toBe('empresa-01');
    expect(advisory.recommendations).toHaveLength(1);

    const rec = advisory.recommendations[0];
    expect(rec.evidenceBundle.counterArguments).toHaveLength(2);
    expect(rec.humanReviewStatus).toBe('PENDING_REVIEW');
  });

  it('should simulate strategic scenario and calibrate trust score', () => {
    const rec = ExecutiveRecommendationEngine.generateRecommendation('empresa-02', 'Corte OPEX', 'Instrução');
    expect(rec.scenario.projectedEbitdaDeltaPercent).toBe(3.5);

    const calibratedTrust = AdvisoryTrustEngine.calibrateRecommendationTrust(rec, 1.2);
    expect(calibratedTrust).toBe(99.0);
  });

  it('should convert approved recommendation into DecisionCommandEnvelope via human review', () => {
    const rec = ExecutiveRecommendationEngine.generateRecommendation('empresa-03', 'Renegociação', 'Detalhe');
    const { updatedRecommendation, commandEnvelope } = HumanExecutiveReviewEngine.reviewAndApproveRecommendation(rec, 'APPROVED', 'user-exec-01');

    expect(updatedRecommendation.humanReviewStatus).toBe('APPROVED');
    expect(commandEnvelope).toBeDefined();
    expect(commandEnvelope?.sourceAgent).toBe('ExecutiveAdvisorEngine');
    expect(commandEnvelope?.requiredApproval).toBe('EXECUTIVE');
  });
});
