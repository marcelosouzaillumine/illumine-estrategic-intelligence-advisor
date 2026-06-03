// src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime.test.ts

import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { InstitutionalBoardPackDocumentRuntime } from './InstitutionalBoardPackDocumentRuntime';
import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { ReportVariant } from './institutional-reporting-types';

describe('InstitutionalBoardPackDocumentRuntime', () => {
  const mockReport: Partial<ExecutiveIntelligenceReport> = {
    institutionalContext: {
      tenantId: 'TENANT_TEST',
      currentCycle: '2023-Q4'
    } as any as import('../institutional-context/types').InstitutionalContextProfile,
    runtimeMetadata: {
      lineageHash: 'HASH_123',
      auditTrail: ['Event A', 'Event B']
    } as any as import('../observability/observability-types').RuntimeExecutionTrace,
    compliance: {
      fiduciaryEnforcement: {
        complianceStatus: 'VALIDATED'
      }
    } as any as ExecutiveIntelligenceReport['compliance'],
    strategicIntelligence: {
      thesis: {
        unifiedThesisStatement: 'A empresa tem operado de forma consistente.'
      }
    } as any as import('../strategic-intelligence/strategic-intelligence-types').InstitutionalStrategicIntelligenceOutput,
    institutionalEvidence: {
      evidenceId: 'EVIDENCE_1',
      isValid: true
    } as any as import('../evidence-ingestion/InstitutionalEvidenceTypes').InstitutionalEvidenceValidationOutput,
    longitudinalCashIntelligence: {
      trajectoryClassification: 'SUSTAINABLE_REAL_GROWTH',
      longitudinalScore: 85,
      narrativeLongitudinal: {
        executiveNarrative: 'Crescimento real validado.'
      }
    } as any as import('../cash-intelligence/CashIntelligenceTypes').LongitudinalCashIntelligenceOutput
  };

  it('deve gerar o document output completo e imutavel', () => {
    const result = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport as ExecutiveIntelligenceReport, 'INVESTOR');

    assert.strictEqual(result.status, 'COMPLETE');
    assert.strictEqual(result.confidence, 'HIGH');
    assert.strictEqual(result.lineageHash, 'HASH_123');
    assert.strictEqual(result.reportVariant, 'INVESTOR');
    assert.strictEqual(result.auditTrail.length, 2);
    assert.strictEqual(result.evidenceAppendix.length, 1);
    
    // Markdown check
    assert.ok(result.markdownSections.cover.includes('**Variant**: INVESTOR'));
    assert.ok(result.markdownSections.executiveSummary.includes('A empresa tem operado de forma consistente.'));
    // Variant emphasis check
    assert.ok(result.markdownSections.executiveSummary.includes('Foco de Análise: Geração de Valor'));
  });

  it('deve modular o tom para BANKING', () => {
    const bankingResult = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport as ExecutiveIntelligenceReport, 'BANKING');
    assert.ok(bankingResult.markdownSections.executiveSummary.includes('Solvência e Liquidez'));
  });

  it('deve modular o tom para AUDIT e reportar falha contábil (fail-closed)', () => {
    const auditReport = JSON.parse(JSON.stringify(mockReport));
    auditReport.compliance.fiduciaryEnforcement.complianceStatus = 'FAILED';

    const auditResult = InstitutionalBoardPackDocumentRuntime.generateDocument(auditReport as ExecutiveIntelligenceReport, 'AUDIT');
    assert.strictEqual(auditResult.status, 'FAILED');
    assert.strictEqual(auditResult.confidence, 'BLOCKED');
    assert.ok(auditResult.markdownSections.executiveSummary.includes('Foco de Análise: Integridade e Conformidade'));
    assert.ok(auditResult.markdownSections.alerts.includes('ACCOUNTING INTEGRITY FAILED'));
    assert.ok(auditResult.restrictions.includes('Accounting Integrity Failed'));
  });

  it('deve ativar RESTRICTED se trajetoria for CHRONIC_DEPENDENCY', () => {
    const restrictedReport = JSON.parse(JSON.stringify(mockReport));
    restrictedReport.longitudinalCashIntelligence.trajectoryClassification = 'CHRONIC_DEPENDENCY';

    const result = InstitutionalBoardPackDocumentRuntime.generateDocument(restrictedReport as ExecutiveIntelligenceReport, 'TURNAROUND');
    assert.strictEqual(result.status, 'RESTRICTED');
    assert.strictEqual(result.confidence, 'LOW');
    assert.ok(result.markdownSections.alerts.includes('RESTRICTED TRAJECTORY'));
    assert.ok(result.restrictions.includes('Restricted Fiduciary Status Active'));
  });
});
