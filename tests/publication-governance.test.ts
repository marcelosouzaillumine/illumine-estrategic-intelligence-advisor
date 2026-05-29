// tests/publication-governance.test.ts
//
// Publication Governance Framework Test Suite

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutivePublicationRuntime } from '../src/core/runtime/publication-governance/ExecutivePublicationRuntime';
import { FiduciaryDisclosureValidationEngine } from '../src/core/runtime/publication-governance/FiduciaryDisclosureValidationEngine';
import { ExportAuthorizationEngine } from '../src/core/runtime/publication-governance/ExportAuthorizationEngine';
import { NarrativeConsistencyEngine } from '../src/core/runtime/publication-governance/NarrativeConsistencyEngine';

const createBaseReportContext = () => ({
  scores: {
    financial: 80,
    operational: 80,
    governance: 75,
    structural: 85,
    composite: 80,
    liquidity: 80,
    capitalPreservation: 85,
    debt: 80
  },
  metrics: {
    ebitda: 1500,
    netIncome: 1200,
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
  lineageHash: 'seed_lineage_hash',
  treasuryIntelligenceReport: {
    isAvailable: true,
    severity: 'STABLE'
  },
  cashSustainabilityReport: {
    isAvailable: true,
    continuityRisk: {
      continuityRisk: 'LOW',
      hasRuptureRisk: false,
      runwayStability: 'STABLE'
    }
  }
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
  policyProfile: 'BALANCED'
});

const createBaseAdvisoryNarrative = () => ({
  title: 'Briefing Fiduciário',
  sections: {
    institutionalContext: 'CONTESTO INSTITUCIONAL Geral.',
    currentStructuralCondition: 'CONDIÇÃO ESTRUTURAL CORRENTE: FCO positivo. Aviso de atenção.',
    survivabilityStatus: 'STATUS DE SOBREVIVÊNCIA regular.',
    governanceStability: 'ESTABILIDADE DE GOVERNANÇA: Rastreabilidade mantida.',
    strategicTradeoffs: 'Preservação vs Crescimento detalhado.',
    predictiveSignals: 'Projeções de cenários sob premissas.',
    recommendedStrategicPaths: 'Diretriz Recomendada: Controlled Growth.',
    institutionalRisks: 'RISCOS INSTITUCIONAIS ATIVOS. Limitações de dados.',
    confidenceLimitations: 'Limitações preditivas e fragilidade de tesouraria divulgadas.',
    fiduciaryDisclosure: 'Disclosure fiduciário: limites de materialidade, dependência de caixa e fail-closed'
  },
  recommendations: {
    recommendedPath: 'Controlled Growth',
    alternatives: ['Conservative Preservation'],
    justification: 'Crescimento com salvaguardas.'
  }
});

describe('Institutional Reporting & Publication Governance Framework', () => {

  describe('1. Fiduciary Disclosures Validation', () => {
    it('Deve negar status CERTIFIED se houver omissão de divulgações mandatórias', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      // Wipe out disclosure keywords
      narrative.sections.fiduciaryDisclosure = 'Nenhuma declaração fiduciária relevante.';
      narrative.sections.confidenceLimitations = 'Dados sob análise regular.';

      const metadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-1',
        'EXECUTIVE_PDF',
        report,
        valResult,
        narrative,
        true
      );

      assert.notEqual(metadata.certification, 'CERTIFIED', 'Missing disclosures must prevent CERTIFIED classification');
      assert.equal(metadata.certification, 'CERTIFIED_WITH_DISCLOSURE');
      assert.ok(metadata.missingDisclosures.length > 0);
    });

    it('Deve conceder status CERTIFIED quando todas as divulgações mandatórias estão presentes', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      const metadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-1',
        'EXECUTIVE_PDF',
        report,
        valResult,
        narrative,
        true
      );

      assert.equal(metadata.certification, 'CERTIFIED');
      assert.equal(metadata.missingDisclosures.length, 0);
    });
  });

  describe('2. Internal Visualization vs Formal Export Gates', () => {
    it('Deve aprovar visualização interna de relatório RESTRICTED mas bloquear sua exportação formal', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      // Trigger RESTRICTED status by dropping composite score below 50
      valResult.survivabilityScores.composite = 45;

      // 1. Internal View
      const internalMetadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-2',
        'ADVISORY_REPORT',
        report,
        valResult,
        narrative,
        true // isInternalView = true
      );

      assert.equal(internalMetadata.certification, 'RESTRICTED');
      assert.equal(internalMetadata.isExportable, true, 'Internal view of restricted reports should be permitted');

      // 2. Formal Export
      const exportMetadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-2',
        'ADVISORY_REPORT',
        report,
        valResult,
        narrative,
        false // isInternalView = false
      );

      assert.equal(exportMetadata.certification, 'RESTRICTED');
      assert.equal(exportMetadata.isExportable, false, 'Formal export of restricted reports must be blocked');
    });

    it('Deve barrar exportação de Board Pack se o relatório estiver sob classificação RESTRICTED', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      // Trigger RESTRICTED status
      valResult.survivabilityScores.composite = 48;
      
      // Delete required component to trigger BOARD PACK COMPLIANCE warning
      delete (report as any).cashSustainabilityReport;

      const boardPackMetadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-BOARD',
        'BOARD_PACK',
        report,
        valResult,
        narrative,
        false
      );

      assert.equal(boardPackMetadata.isExportable, false);
      assert.ok(boardPackMetadata.warnings.some(w => w.includes('COMPLIANCE')));
    });
  });

  describe('3. Lineage Hash Propagation', () => {
    it('Deve herdar corretamente a assinatura lógica fiduciária do runtime pai', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      const metadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-3',
        'EXECUTIVE_PDF',
        report,
        valResult,
        narrative,
        true,
        'CORR-NARR-321'
      );

      assert.ok(metadata.exportSignature.includes('CORR-NARR-321'));
      assert.ok(metadata.exportSignature.includes('DEC-CERT-T')); // Inherited signature prefix
    });
  });

  describe('4. Narrative & Score Consistency Checking', () => {
    it('Deve travar publicação se houver recomendação otimista sob severidade fiduciária crítica', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      // Contradiction: growth recommendation under critical severity
      valResult.severity = 'UNSUSTAINABLE';
      report.severity.level = 'ESTRESSADO';
      narrative.recommendations.recommendedPath = 'Aggressive Expansion';

      const metadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-4',
        'EXECUTIVE_PDF',
        report,
        valResult,
        narrative,
        true
      );

      assert.equal(metadata.certification, 'BLOCKED');
      assert.equal(metadata.isExportable, false);
      assert.ok(metadata.warnings.some(w => w.includes('Recomendação de crescimento/expansão')));
    });

    it('Deve travar publicação se houver recomendação de crescimento sob risco de ruptura de tesouraria', () => {
      const report = createBaseReportContext();
      const valResult = createBaseValidationResult();
      const narrative = createBaseAdvisoryNarrative();

      // Contradiction: growth recommendation under treasury rupture risk
      report.treasuryIntelligenceReport.severity = 'TREASURY_RUPTURE_RISK';
      narrative.recommendations.recommendedPath = 'Controlled Growth';

      const metadata = ExecutivePublicationRuntime.evaluatePublication(
        'ART-5',
        'EXECUTIVE_PDF',
        report,
        valResult,
        narrative,
        true
      );

      assert.equal(metadata.certification, 'BLOCKED');
      assert.equal(metadata.isExportable, false);
      assert.ok(metadata.warnings.some(w => w.includes('ruptura de tesouraria')));
    });
  });
});
