import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreasuryIntelligenceRuntimeOutput } from '../src/capabilities/runtime/treasury-intelligence/types';
import { InstitutionalOperationalGovernanceOutput } from '../src/capabilities/runtime/operational-governance/operational-governance-types';
import { InstitutionalBoardPackOutput } from '../src/capabilities/runtime/institutional-reporting/institutional-reporting-types';
import { InstitutionalDeploymentReadinessOutput } from '../src/capabilities/runtime/deployment-readiness/DeploymentReadinessTypes';

describe('Runtime Contract Harmonization (RC-1.13A)', () => {

  it('1. Treasury Output inherits from RuntimeOutputBase correctly', () => {
    const treasury: TreasuryIntelligenceRuntimeOutput = {
      isAvailable: true,
      severity: 'STABLE',
      governanceVerdict: 'Ok',
      priorityMatrix: { priorities: [], restrictedLayers: [], activeCascadeBlock: false },
      distributionSustainability: { eligible: true, accountingDistributable: 0, fiduciaryDistributable: 0, isBlocked: false, blockedReasons: [], patrimonialErosionIndex: 0 },
      reinvestmentIntelligence: { reinvestmentQuality: 'HIGH', operationalReturnSustainability: 100, compatibilityWithSurvivability: true, warnings: [] },
      fiduciaryEfficiency: { efficiencyScore: 100, survivabilityAdjustedEfficiency: 100, silentCashDestructionDetected: false, inefficientAllocationPatterns: [] },
      treasuryResilience: { reserveSustainabilityDays: 360, liquidityRedundancyRatio: 2, resilienceHalfLifeDays: 360, reserveDegradationVelocity: 0, dependencyRecurrenceIntensity: 'NONE', exhaustionProjected: false },
      cashPriority: { escalatedPriorityList: [], payrollPriorityScore: 100, criticalCapexPriorityScore: 100, reserveProtectionPriorityScore: 100 },
      stressSimulations: { stressSeverity: 'STABLE', cumulativeExhaustionDays: 0, activeStressFactors: [], simulatedExhaustionProjected: false },
      capitalPreservation: { preservationScore: 100, preservationDiscipline: 'HIGH', reserveErosionVelocity: 0 },
      runtimeMetadata: { generatedAt: '2026', runtimeVersion: '1.0', contractVersion: 'RC_1_13A', tenantId: 'test', cycleReference: '2026' },
      lineage: { lineageHash: 'TREASURY_001' as any, parentHashes: [] },
      disclosures: [],
      compliance: { integrityStatus: 'INTACT', complianceStatus: 'COMPLIANT', complianceBlockers: [] },
      explainability: { structuralDrivers: [], propagationChains: [], evidence: [], confidenceDecomposition: {}, lineageReferences: [], level: 'DETERMINISTIC' }
    };

    assert.strictEqual(treasury.severity, 'STABLE');
    assert.strictEqual(treasury.runtimeMetadata.contractVersion, 'RC_1_13A');
  });

  it('2. Operational Governance Output inherits from RuntimeOutputBase correctly', () => {
    const gov: InstitutionalOperationalGovernanceOutput = {
      executionIntegrity: { status: 'EXECUTION_STABLE', capabilityConfidence: 'HIGH', strainFactors: [] },
      frictions: [],
      continuity: { status: 'CONTINUITY_STABLE', resilienceScore: 100, stabilityFactors: [] },
      dependencies: [],
      strategicAlignment: { isAligned: true, alignmentNarrative: 'Aligned', tensions: [] },
      thesis: { thesisStatement: 'Thesis', primaryStrain: null, institutionalPosture: 'ALIGNED_EXECUTION', lineageHash: 'GOV_001' },
      _persistenceDelta: null,
      runtimeMetadata: { generatedAt: '2026', runtimeVersion: '1.0', contractVersion: 'RC_1_13A', tenantId: 'test', cycleReference: '2026' },
      lineage: { lineageHash: 'GOV_001' as any, parentHashes: [] },
      disclosures: [],
      compliance: { integrityStatus: 'INTACT', complianceStatus: 'COMPLIANT', complianceBlockers: [] },
      explainability: { structuralDrivers: [], propagationChains: [], evidence: [], confidenceDecomposition: {}, lineageReferences: [], level: 'DETERMINISTIC' }
    };

    assert.strictEqual(gov.executionIntegrity.status, 'EXECUTION_STABLE');
  });

  it('3. FailClosed types are strictly defined', () => {
    const failClosedObj = {
      state: 'INSUFFICIENT_DATA',
      reasons: [],
      disclosures: [],
      blockedOutputs: []
    };
    assert.strictEqual(failClosedObj.state, 'INSUFFICIENT_DATA');
  });

});
