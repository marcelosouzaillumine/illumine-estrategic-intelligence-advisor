// @ts-nocheck
// tests/institutional-board-pack.test.ts

import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalBoardPackRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Institutional Board Pack Runtime', () => {

  const createBaseReport = (): any => ({
    runtimeMetadata: { lineageHash: 'BD-PACK-TEST-HASH', historicalCyclesAvailable: 5, auditTrail: ['EXEC-001', 'STR-002'] },
    institutionalContext: { tenantId: 'test-tenant', currentCycle: '2026-05' },
    capitalStructure: { fundingDependenceLevel: 'MODERATE', rolloverRisk: 'LOW' },
    metrics: {
      financialMetrics: { ocf: 500, revenue: 10000 },
      scaleEfficiency: { recGrowth: 0.10, ebitdaGrowth: 0.12 }
    },
    resilienceReport: { status: 'SAFE', antifragilityScore: 90, runtimeMetadata: { lineageHash: 'RES-HASH' } },
    treasuryIntelligenceReport: { stressStatus: 'STABLE', runtimeMetadata: { lineageHash: 'TRS-HASH' } },
    operatingPressureReport: { structuralPressureSeverity: 'LOW' },
    survivalReport: { activeSurvivalMode: null, forbiddenInstitutionalPriorities: [], activeFiduciaryLocks: [] },
    strategicIntelligence: {
      posture: 'EXPANSION_POSTURE',
      vectors: [{ direction: 'RECURRENT_GROWTH', vectorConfidence: 'HIGH' }],
      trajectory: 'TRAJECTORY_STABLE',
      expansionSustainability: { isSustainable: true },
      contradictions: [],
      explainability: {
        strategicLineage: 'STR-HASH-123',
        trajectoryRationale: 'Stable recurrent growth with high ocf generation.',
        sustainabilityExplanation: 'Expansion is strictly funded by operational cash flow.'
      },
      thesis: { unifiedThesisStatement: 'Sustainable structural growth directed by strong operational cash flow.' }
    },
    executiveCommand: { activeDirectives: [] },
    operationalGovernance: {
      executionIntegrity: { status: 'EXECUTION_STABLE', confidence: 'HIGH', rationale: 'No frictions.' },
      operationalFriction: { frictions: [] },
      operationalContinuity: { status: 'SUSTAINED_CONTINUITY' },
      auditTrail: ['GOV-HASH']
    }
  });

  it('1. Generates COMPLETE report when fiduciary conditions are met', () => {
    const report = createBaseReport();
    const result = InstitutionalBoardPackRuntime.generate(report);

    assert.strictEqual(result.status, 'COMPLETE');
    assert.strictEqual(result.metadata.runtimeMetadata.contractVersion, true);
    assert.ok(result.metadata.boardPackLineageHash.startsWith('BOARD_PACK'));
    assert.strictEqual(result.executiveSnapshot.fiduciaryRestrictionsActive, 0);
  });

  it('2. Enforces RESTRICTED report on insufficient historical cycles (fail-closed)', () => {
    const report = createBaseReport();
    report.runtimeMetadata.historicalCyclesAvailable = 1;
    
    const result = InstitutionalBoardPackRuntime.generate(report);

    assert.strictEqual(result.status, 'RESTRICTED');
    assert.strictEqual(result.metadata.runtimeMetadata.contractVersion, false);
    assert.ok(result.fiduciaryRestrictions.some(r => r.restrictionType === 'INSUFFICIENT_HISTORY'));
  });

  it('3. Lineage preservation is mandatory', () => {
    const report = createBaseReport();
    report.runtimeMetadata.lineageHash = null;
    
    const result = InstitutionalBoardPackRuntime.generate(report);

    assert.strictEqual(result.status, 'FAILED');
    assert.ok(result.disclosureSet[0].statement.includes('MISSING_LINEAGE_HASH'));
  });

});
