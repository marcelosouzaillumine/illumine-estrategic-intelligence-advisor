// tests/advisory-narrative.test.ts
//
// Advisory Narrative & Board Communication Test Suite

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveNarrativeEngine } from '../src/workspace/runtime/advisory-narrative/ExecutiveNarrativeEngine';
import { FiduciaryCommunicationEngine } from '../src/workspace/runtime/advisory-narrative/FiduciaryCommunicationEngine';
import { BoardCommunicationEngine } from '../src/workspace/runtime/advisory-narrative/BoardCommunicationEngine';
import { ConfidenceNarrativeEngine } from '../src/workspace/runtime/advisory-narrative/ConfidenceNarrativeEngine';
import { StrategicRecommendationEngine } from '../src/workspace/runtime/advisory-narrative/StrategicRecommendationEngine';

const createBaseReportContext = () => ({
  scores: {
    financial: 80,
    operational: 80,
    governance: 75,
    structural: 85,
    composite: 80,
    liquidity: 80,
    capitalPreservation: 85
  },
  metrics: {
    ebitda: 1500,
    netIncome: 1200,
    retentionRatio: 0.5,
    netMargin: 15,
    margin: 15,
    availableCash: 120000
  },
  severity: { level: 'ESTÁVEL' },
  compliance: { confidenceLevel: 'HIGH_CONFIDENCE', dataCompleteness: 100 },
  cashFlowReport: {
    isAvailable: true,
    operational: { fco: 15000 },
    investment: { fci: -2000 },
    availableCash: 120000,
    confidence: 'HIGH_CONFIDENCE'
  },
  capitalGovernanceReport: {
    isAvailable: true,
    preservation: { preservationStatus: 'PRESERVAÇÃO_SAUDÁVEL' },
    behavior: { governanceMaturity: 'MATURA' },
    confidence: 'HIGH_CONFIDENCE'
  },
  context: { segment: 'Geral' },
  policyProfile: 'BALANCED',
  lineageHash: 'seed_lineage_hash'
});

const createBaseValidationResult = () => ({
  isValid: true,
  severity: 'SAFE',
  violations: [],
  warnings: [],
  survivabilityScores: {
    liquidity: 80,
    operational: 80,
    governance: 75,
    debt: 85,
    capitalPreservation: 85,
    strategic: 80,
    composite: 80
  },
  certification: {
    signature: 'DEC-CERT-TEST-SIGNATURE',
    fiduciaryCompatibility: 100,
    overallGrade: 'A'
  },
  policyProfile: 'BALANCED',
  predictiveAssessment: {
    isRuptureApproaching: false
  }
});

const createBaseComparisonReport = () => ({
  recommendedPath: 'Controlled Growth' as any,
  candidatePath: {
    category: 'Controlled Growth' as any,
    classification: 'STABLE',
    finalSurvivabilityScores: { composite: 82 },
    finalFatigue: { compositeFatigue: 30 }
  },
  baselines: {
    conservativePreservation: {
      finalSurvivabilityScores: { composite: 85 },
      liquidityRunwayCycles: 24,
      classification: 'STABLE'
    },
    controlledGrowth: {
      finalSurvivabilityScores: { composite: 82 },
      liquidityRunwayCycles: 18,
      classification: 'STABLE'
    },
    survivalStabilization: {
      finalSurvivabilityScores: { composite: 88 },
      liquidityRunwayCycles: 30,
      classification: 'STABLE',
      finalFatigue: { compositeFatigue: 20 }
    }
  }
});

describe('Executive Advisory Narrative & Board Communication Framework', () => {

  describe('1. Mandatory 10-Section Structure', () => {
    it('Deve gerar um parecer contendo todas as 10 seções mandatórias', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const compReport = createBaseComparisonReport();

      const narrative = ExecutiveNarrativeEngine.orchestrate(report, valResult, compReport, 'EXECUTIVE', 'test-session-id');

      assert.ok(narrative.sections.institutionalContext.includes('CONTESTO INSTITUCIONAL'));
      assert.ok(narrative.sections.currentStructuralCondition.includes('CONDIÇÃO ESTRUTURAL CORRENTE'));
      assert.ok(narrative.sections.survivabilityStatus.includes('STATUS DE SOBREVIVÊNCIA'));
      assert.ok(narrative.sections.governanceStability.includes('ESTABILIDADE DE GOVERNANÇA'));
      assert.ok(narrative.sections.strategicTradeoffs.includes('Preservação vs Crescimento'));
      assert.ok(narrative.sections.predictiveSignals.includes('Comparação Preditiva de Rotas'));
      assert.ok(narrative.sections.recommendedStrategicPaths.includes('Diretriz Recomendada'));
      assert.ok(narrative.sections.institutionalRisks.includes('RISCOS INSTITUCIONAIS ATIVOS'));
      assert.ok(narrative.sections.confidenceLimitations.includes('AVALIAÇÃO DE CONFIANÇA'));
      assert.ok(narrative.sections.fiduciaryDisclosure.includes('DECLARAÇÃO DE DISCLOSURE FIDUCIÁRIO'));
    });
  });

  describe('2. Neutrality, Bounded Scenarios and Non-Speculation', () => {
    it('Deve descrever simulações como "bounded scenario projections" e nunca usar termos emocionais ou de garantia indevida', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const compReport = createBaseComparisonReport();

      const narrative = ExecutiveNarrativeEngine.orchestrate(report, valResult, compReport, 'EXECUTIVE', 'test-session-id');

      // Assert bounded scenario projections statement is present
      assert.ok(narrative.sections.predictiveSignals.includes('bounded scenario projections'));
      // Assert it does not present predictions as guarantees
      assert.ok(narrative.sections.predictiveSignals.includes('não constituindo de forma alguma garantias'));
      
      // Neutrality: no emotional/accusatory vocabulary
      const fullText = Object.values(narrative.sections).join(' ').toLowerCase();
      assert.ok(!fullText.includes('irresponsável'));
      assert.ok(!fullText.includes('desastre'));
      assert.ok(!fullText.includes('catástrofe'));
    });
  });

  describe('3. Audience-Adapted Tone and Content', () => {
    it('Deve adaptar o briefing para Conselho de Administração (BOARD) priorizando preservação de capital', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const compReport = createBaseComparisonReport();

      const boardNarrative = ExecutiveNarrativeEngine.orchestrate(report, valResult, compReport, 'BOARD', 'test-session-id');

      assert.ok(boardNarrative.title.includes('Conselho de Administração'));
      assert.ok(boardNarrative.sections.governanceStability.includes('DIRETRIZES DE ESTABILIZAÇÃO'));
    });

    it('Deve apresentar visão de tradeoffs operacionais adaptados para liderança executiva (EXECUTIVE)', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const compReport = createBaseComparisonReport();

      const execNarrative = ExecutiveNarrativeEngine.orchestrate(report, valResult, compReport, 'EXECUTIVE', 'test-session-id');

      assert.ok(execNarrative.title.includes('EXECUTIVE'));
    });
  });

  describe('4. Deterministic Lineage Integrity', () => {
    it('Deve propagar corretamente a assinatura lógica fiduciária (lineageHash) e correlationId no disclosure', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const compReport = createBaseComparisonReport();

      const sessionCorrelationId = 'SESSION-CORR-12345';
      const narrative = ExecutiveNarrativeEngine.orchestrate(report, valResult, compReport, 'BOARD', sessionCorrelationId);

      assert.ok(narrative.lineageHash === 'DEC-CERT-TEST-SIGNATURE');
      assert.ok(narrative.correlationId === sessionCorrelationId);
      assert.ok(narrative.sections.fiduciaryDisclosure.includes('DEC-CERT-TEST-SIGNATURE'));
      assert.ok(narrative.sections.fiduciaryDisclosure.includes(sessionCorrelationId));
    });
  });
});
