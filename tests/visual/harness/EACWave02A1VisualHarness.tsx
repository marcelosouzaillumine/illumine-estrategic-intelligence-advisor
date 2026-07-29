import React from 'react';
import { HistoricalEvidencePanel } from '../../../src/components/temporal/HistoricalEvidencePanel';
import { ExecutiveEvidenceViewer } from '../../../src/components/executive-delivery/ExecutiveEvidenceViewer';
import { EvidenceDetailPanel } from '../../../src/components/cognitive/EvidenceDetailPanel';
import { EvidenceCorrelationPanel } from '../../../src/components/war-room/EvidenceCorrelationPanel';
import { HistoricalEvidenceCoverage } from '../../../src/components/institutional-memory/HistoricalEvidenceCoverage';
import { InstitutionalMemoryProvider } from '../../../src/context/institutional-memory/InstitutionalMemoryProvider';

export default function EACWave02A1VisualHarness() {
  let target = '';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    target = params.get('target') || '';
  }

  const renderTarget = () => {
    switch (target) {
      case 'historical-evidence':
        return <HistoricalEvidencePanel provenance={{
          provenanceId: 'PROV-2026-001',
          snapshotId: 'SNAP-2026-001',
          evidenceBundleId: 'EB-78fa23c9',
          explainabilityChainId: 'EXP-chain-0042',
          graphSnapshotId: 'GS-2026-001',
          correlationId: 'CORR-2026-001',
          lineageId: 'sha256:a4f8bc91dd3e7f12c5a66ef4901bc7e85d2f1a90cb3d4e7f8a12b5c3d6e9f0a1',
          createdAt: '2026-07-10T12:00:00Z'
        }} />;
      case 'executive-evidence':
        return <ExecutiveEvidenceViewer evidence={{
          datasetHash: 'sha256:9f8e7d6c5b4a3210fedcba9876543210abcdef01234567890abcdef012345678',
          tenantId: 'test-tenant',
          calibrationProfile: 'balanced',
          confidenceLevel: 'HIGH',
          dataCompleteness: 0.95,
          executionId: 'exec-2026-07-10-14a3b2c1d0',
          timestamp: '2026-07-10T12:00:00Z',
          auditFlags: ['FIDUCIARY_COMPLIANT', 'RUNTIME_VERIFIED'],
          narrativeRestrictions: [],
          reportVersion: '2.1.0'
        }} />;
      case 'evidence-detail':
        return <EvidenceDetailPanel evidences={[
          { id: 'ev-001-abc', title: 'Relatório Contábil Q2 2026', source: 'FINANCIAL_ENGINE', confidence: 'VERIFIED', type: 'FINANCIAL' },
          { id: 'ev-002-def', title: 'Projeção de Fluxo de Caixa', source: 'PROJECTION_ENGINE', confidence: 'HIGH', type: 'PROJECTION' },
          { id: 'ev-003-ghi', title: 'Score de Risco Setorial', source: 'RISK_ENGINE', confidence: 'MEDIUM', type: 'RISK' }
        ]} />;
      case 'evidence-correlation':
        return <EvidenceCorrelationPanel evidences={[
          'DOC-2026-001: Balanço Patrimonial Auditado',
          'DOC-2026-002: Parecer do Conselho Fiscal',
          'DOC-2026-003: Relatório de Integridade Fiduciária',
          'DOC-2026-004: Certificado de Compliance LGPD'
        ]} />;
      case 'evidence-coverage':
        return (
          <InstitutionalMemoryProvider>
            <HistoricalEvidenceCoverage />
          </InstitutionalMemoryProvider>
        );
      default:
        return <div>Target not found: {target}</div>;
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full">
        {renderTarget()}
      </div>
    </div>
  );
}
