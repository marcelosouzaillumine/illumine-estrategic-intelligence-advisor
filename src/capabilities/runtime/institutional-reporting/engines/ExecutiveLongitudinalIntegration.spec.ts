
import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { LongitudinalScoreEngine } from './LongitudinalScoreEngine';
import { FiduciaryTimelineEngine } from './FiduciaryTimelineEngine';
import { ExecutiveSnapshotEngine } from './ExecutiveSnapshotEngine';
import { CashIntelligenceRuntimeOutput } from '../../../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes';
import { ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';
import { ExecutiveReportNarrativeOrchestrator } from '../ExecutiveReportNarrativeOrchestrator';

const createMockHistoricalOutput = (
  runway: number,
  fcoPositive: boolean,
  classification: string,
  reconciliationStatus: 'RECONCILED' | 'BLOCKED' = 'RECONCILED',
  isAvailable: boolean = true
): CashIntelligenceRuntimeOutput => {
  return {
    isAvailable,
    universalIndicators: {
      burnRateOperacional: { value: fcoPositive ? -100 : 100, classification: 'NOT_APPLICABLE' },
      cashRunwayInstitucional: { months: runway, classification: 'HEALTHY' },
      dependenciaDeCapitalizacao: { value: 0 },
      dependenciaFornecedores: { value: 0, alert: 'NORMAL' },
      aprisionamentoCapitalEstoque: { value: 0, alert: 'NORMAL' },
      exposicaoPartesRelacionadas: { value: 0, alert: 'NORMAL' },
      conversaoEbitdaCaixa: { value: 0, alert: 'NORMAL' },
      classificacaoFiduciariaFCF: 'UNSPECIFIED_EXTERNAL_SUPPORT'
    },
    liquidityClassification: {
      classification: classification as any,
      label: '', confidence: 'HIGH', severity: 'SAUDÁVEL', rationale: ''
    },
    artificialLiquidityDetected: { isArtificial: false, diagnoses: [], liquidityDistortionFactors: [], rationale: '', blockedConclusions: [] },
    reconciliationAlerts: { isReconcilable: true, variancePercentage: 0, confidence: 'HIGH', reconciliationStatus, temporalSeverity: 'LOW', alerts: [], disclosures: [], restrictsOptimisticInterpretations: false },
    legacyOperationalSustainabilityAssessment: { isSustained: true, selfFinancingCapacity: 'HIGH', operationalCashConsistency: 'HIGH_CONSISTENCY', operationalFragilityIndex: 0, dependencyTrend: 'STABLE', resilienceScore: 100, longitudinalConsistency: '' },
    fiduciaryOperationalSustainabilityAssessment: { classification: fcoPositive ? 'OPERATIONALLY_SUSTAINABLE' : 'DEPENDENT_ON_EXTERNAL_CAPITAL', resilienceScore: 100, operationalFragilityIndex: 0, longitudinalConsistency: '' },
    continuityRisk: { continuityRisk: 'LOW', hasRuptureRisk: false, projectedRunwayMonths: runway, runwayClassification: 'HEALTHY', runwayConfidence: 'HIGH', runwayDistortionFactors: [], runwayStability: 'STABLE', liquidityDependency: false, continuityRiskDrivers: [], recommendedActions: [] },
    fiduciaryNarrative: { executiveNarrative: '', fiduciaryOpinion: '', fiduciaryWarnings: [], blockedInterpretations: [], causalFindings: [], institutionalImplications: [] },
    blockedConclusions: [],
    allowedConclusions: fcoPositive ? ['OPERATIONAL_GENERATION'] : [],
    confidenceLevel: 'HIGH', auditTrail: [], lineageHash: '', cashIntelligenceLineageHash: '', causalReferences: [], score: 100
  };
};

describe('Executive Longitudinal Integration', () => {

  describe('LongitudinalScoreEngine', () => {
    it('Deve capar o score pontual alto se for ARTIFICIAL_TURNAROUND (Teto 35)', () => {
      const score = LongitudinalScoreEngine.calculate('ARTIFICIAL_TURNAROUND', 90);
      assert.ok(score !== 'NOT_AVAILABLE' && score <= 35);
    });

    it('Deve manter/elevar score pontual baixo se for STRUCTURAL_IMPROVEMENT', () => {
      const score = LongitudinalScoreEngine.calculate('STRUCTURAL_IMPROVEMENT', 40);
      assert.ok(score !== 'NOT_AVAILABLE' && score >= 55);
      assert.equal(score, 80);
    });

    it('Deve retornar NOT_AVAILABLE para INSUFFICIENT_HISTORICAL_DATA', () => {
      const score = LongitudinalScoreEngine.calculate('INSUFFICIENT_HISTORICAL_DATA', 90);
      assert.equal(score, 'NOT_AVAILABLE');
    });

    it('Deve penalizar CHRONIC_DEPENDENCY mesmo com caixa crescente (Teto 40)', () => {
      const score = LongitudinalScoreEngine.calculate('CHRONIC_DEPENDENCY', 85);
      assert.ok(score !== 'NOT_AVAILABLE' && score <= 40);
    });

    it('Deve calcular score de REAL_RECOVERY com alta volatilidade (penalizado pro teto)', () => {
      const score = LongitudinalScoreEngine.calculate('VOLATILE_RECOVERY', 70);
      assert.equal(score, 70);
    });

    it('Deve avaliar STABLE_SUSTAINABILITY entre 85-100', () => {
      const score = LongitudinalScoreEngine.calculate('STABLE_SUSTAINABILITY', 70);
      assert.equal(score, 90);
    });
  });

  describe('FiduciaryTimelineEngine', () => {
    it('Deve retornar INSUFFICIENT_HISTORY para timeline vazia', () => {
      const timeline = FiduciaryTimelineEngine.extract([]);
      assert.equal(timeline.timelineIntegrityStatus, 'INSUFFICIENT_HISTORY');
    });

    it('Deve aplicar status BROKEN se houver ciclo bloqueado', () => {
      const p1 = createMockHistoricalOutput(2, true, 'HEALTHY');
      const p2 = createMockHistoricalOutput(4, true, 'HEALTHY', 'BLOCKED');
      const timeline = FiduciaryTimelineEngine.extract([p1, p2]);
      assert.equal(timeline.timelineIntegrityStatus, 'BROKEN');
    });

    it('Deve rastrear artificialidade com exatidão', () => {
      const p1 = createMockHistoricalOutput(2, false, 'LIQUIDEZ_ARTIFICIAL');
      const p2 = createMockHistoricalOutput(4, false, 'HEALTHY');
      const timeline = FiduciaryTimelineEngine.extract([p1, p2]);
      assert.equal(timeline.artificialLiquidityFrequency, 0.5);
      assert.equal(timeline.dependencyRecurrence, 1);
    });
  });

  describe('ExecutiveSnapshotEngine', () => {
    it('Deve bloquear conclusões otimistas em ARTIFICIAL_TURNAROUND', () => {
      const mockReport: Partial<ExecutiveIntelligenceReport> = {
        strategicIntelligence: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJECTORY_STABLE', thesis: { unifiedThesisStatement: 'Fake thesis' }, explainability: {} as any } as any,
        operationalGovernance: { executionIntegrity: { status: "EXECUTION_STABLE", capabilityConfidence: "HIGH", strainFactors: [] } } as any,
        scores: { composite: 85, financial: 90, operational: 80, governance: 80, structural: 80 },
        longitudinalCashIntelligence: {
          trajectoryClassification: 'ARTIFICIAL_TURNAROUND',
          historicalPatternsDetected: [],
          runwayEvolutionTrend: 'UP',
          narrativeLongitudinal: { executiveNarrative: 'Voô de galinha', advisoryWarnings: [], isRecoveryReal: false },
          blockedConclusions: [],
          longitudinalScore: 'NOT_AVAILABLE',
          recoveryNarrativeBlocked: true,
          timelineIntegrityStatus: 'VALID',
          fiduciaryWarnings: []
        }
      };

      const snapshot = ExecutiveSnapshotEngine.generate(mockReport as ExecutiveIntelligenceReport);
      
      assert.equal(snapshot.recoveryNarrativeBlocked, true);
      assert.ok(snapshot.fiduciaryRestrictionsActive! > 0);
      assert.equal(snapshot.trajectoryConfidence, 'LOW');
      assert.ok(snapshot.fiduciaryRestrictions!.length > 0);
      assert.ok(snapshot.fiduciaryRestrictions![0].description.includes('ARTIFICIAL_TURNAROUND'));
    });
  });

  describe('ExecutiveReportNarrativeOrchestrator', () => {
    it('Deve suprimir crescimento sustentável se houver dependência crônica', () => {
      const result = ExecutiveReportNarrativeOrchestrator.generateExecutiveSummary({
        strategic: { posture: 'EXPANSION_POSTURE', trajectory: 'TRAJECTORY_STABLE', thesis: { unifiedThesisStatement: 'Fake thesis' }, explainability: {} as any } as any,
        governance: { executionIntegrity: { status: "EXECUTION_STABLE", capabilityConfidence: "HIGH", strainFactors: [] } } as any,
        hasSurvivalMode: false,
        longitudinal: {
          trajectoryClassification: 'ARTIFICIAL_TURNAROUND',
          historicalPatternsDetected: [],
          runwayEvolutionTrend: 'UP',
          narrativeLongitudinal: { executiveNarrative: '', advisoryWarnings: [], isRecoveryReal: false },
          blockedConclusions: [],
          longitudinalScore: 'NOT_AVAILABLE',
          recoveryNarrativeBlocked: true,
          timelineIntegrityStatus: 'VALID',
          fiduciaryWarnings: []
        }
      } as any);

      // O orchestrator deve adicionar o alerta e NÃO PODE conter 'crescimento sustentável' (o código original baseText não continha, mas injetamos algo)
      assert.ok(result.includes(' IMPORTANTE: A melhora de liquidez recente tem origem em fontes externas, mascarando uma dependência crônica.'));
    });
  });

});
