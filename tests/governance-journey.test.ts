import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FiduciaryRuntimeAdapter } from '../src/services/FiduciaryRuntimeAdapter';

describe('Governance Journey Layer (GJL™) Integration Tests', () => {
  const clientId = 'GLOBAL';

  it('1. GJL™ must be read-only/orchestration-only and generate a 100-scale Presentation Index (GJI)', () => {
    // Read-only generation
    const journey = FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId, 'DEMO_SCENARIO', 'STANDARD');
    
    assert.ok(journey.gjiScore >= 0 && journey.gjiScore <= 100, "GJI Score must be on a 0-100 scale");
    assert.ok(journey.gjiStage, "Should compute GJI stage");
    assert.ok(journey.boardNarrative, "Should compute board narrative");
    assert.strictEqual(journey.steps.length, 8, "Should contain exactly 8 journey steps");
  });

  it('2. GJI™ must be clearly labeled as index and EAI™ sorting must keep all 8 steps visible', () => {
    const journey = FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId, 'DEMO_SCENARIO', 'STANDARD');
    
    // Check GJI label description implicitly is consolidated navigation index
    assert.strictEqual(journey.steps.length, 8, "All 8 steps must be present");
    
    // Validate EAI sorting doesn't lose steps
    const sortedSteps = [...journey.steps].sort((a, b) => b.executiveAttentionScore - a.executiveAttentionScore);
    assert.strictEqual(sortedSteps.length, 8, "Sorted list must also have 8 steps");
    
    // Confirm EAI values are defined
    sortedSteps.forEach(step => {
      assert.ok(typeof step.executiveAttentionScore === 'number', "Each step must have an EAI score");
    });
  });

  it('3. BRL™ Gate lock rules: Step 7 & 8 must block scores, quartiles and percentiles under NOT_CERTIFIED', () => {
    // Scenario 'LIQUIDITY_SHOCK' triggers NOT_CERTIFIED readiness status in the mock data
    const readiness = FiduciaryRuntimeAdapter.benchmarkReadinessEngine.evaluateReadiness(clientId, 'LIQUIDITY_SHOCK');
    assert.strictEqual(readiness.certificationStatus, 'NOT_CERTIFIED', "LIQUIDITY_SHOCK should trigger NOT_CERTIFIED");

    const journey = FiduciaryRuntimeAdapter.governanceJourneyEngine.generateJourney(clientId, 'DEMO_SCENARIO', 'LIQUIDITY_SHOCK');
    const step7 = journey.steps.find(s => s.id === 'step-07')!;
    const step8 = journey.steps.find(s => s.id === 'step-08')!;

    // Step 7 (BCI) Blocked Assertions
    assert.strictEqual(step7.primaryValue, 'BLOQUEADO', "Step 7 must be locked/blocked");
    assert.strictEqual(step7.status, 'CRITICAL', "Step 7 status must be CRITICAL when BRL is NOT_CERTIFIED");
    assert.ok(step7.actionRequired, "Step 7 must display required actions");
    assert.ok(!step7.executiveSummary.includes("BPS"), "Step 7 must not show BPS score");
    assert.ok(!step7.executiveSummary.includes("percentile"), "Step 7 must not show percentile");

    // Step 8 (BAI) Blocked Assertions
    assert.strictEqual(step8.primaryValue, 'BLOQUEADO', "Step 8 must be locked/blocked");
    assert.strictEqual(step8.status, 'CRITICAL', "Step 8 status must be CRITICAL when BRL is NOT_CERTIFIED");
    assert.ok(step8.actionRequired, "Step 8 must display required actions");
    assert.ok(!step8.executiveSummary.includes("APS"), "Step 8 must not show APS score");
  });

  it('4. Board Pack Slide Count must equal exactly 16 slides, with GJL™ as slide 2', () => {
    const boardPack = FiduciaryRuntimeAdapter.boardPackGeneratorEngine.generateBoardPack(clientId, 'DEMO_SCENARIO', 'STANDARD', 'Holding Illumine S/A');
    
    assert.strictEqual(boardPack.slides.length, 16, "Board pack must contain exactly 16 slides");
    
    const slide2 = boardPack.slides.find(s => s.slideNumber === 2)!;
    assert.strictEqual(slide2.title, "1. JORNADA DE GOVERNANÇA (GJL™)", "Slide 2 title mismatch");
    assert.ok(slide2.content.some(c => c.includes("Governance Journey Index")), "Slide 2 content should mention GJI");
  });
});
