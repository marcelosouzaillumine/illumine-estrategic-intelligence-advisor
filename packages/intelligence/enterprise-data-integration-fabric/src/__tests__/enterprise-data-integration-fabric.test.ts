/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import {
  ConnectorFrameworkEngine,
  SourceAdapterRegistryEngine,
  RawDataIsolationEngine,
  DataIngestionPipelineEngine,
  TransformationNormalizationEngine,
  DomainCertificationPipelineEngine,
  CertifiedEnterpriseDatasetComposer,
  IntegrationEventBusEngine
} from '../index';

describe('Wave 19.3 — Enterprise Data Integration Fabric (EDIF v1.0)', () => {
  it('should create connector manifest with fiduciary declaration', () => {
    const manifest = ConnectorFrameworkEngine.createManifest('sap-01', 'SAP S/4HANA', 'FINANCIAL', 'FinancialGovernanceBoundary');
    expect(manifest.connectorId).toBe('sap-01');
    expect(manifest.domain).toBe('FINANCIAL');
    expect(manifest.certificationRequired).toBe(true);
    expect(manifest.authenticationMethod).toBe('OAUTH2_MUTUAL_TLS');
  });

  it('should isolate raw payload in raw landing zone', () => {
    const raw = RawDataIsolationEngine.isolateRawPayload('sap-01', 2048);
    expect(raw.connectorId).toBe('sap-01');
    expect(raw.rawPayloadSizeBytes).toBe(2048);
    expect(raw.isProcessed).toBe(true);
  });

  it('should route through domain certification pipeline and compose enterprise dataset', () => {
    const certifiedDomainDs = DomainCertificationPipelineEngine.routeAndCertify('FINANCIAL', 'ds-fin-01');
    expect(certifiedDomainDs.governance.certificationStatus).toBe('CERTIFIED');
    expect(certifiedDomainDs.lineage.validatorService).toBe('FinancialGovernanceBoundary');

    const enterpriseDs = CertifiedEnterpriseDatasetComposer.composeEnterpriseDataset('empresa-01', certifiedDomainDs);
    expect(enterpriseDs.certificationStatus).toBe('CERTIFIED');
    expect(enterpriseDs.financial).toBeDefined();
  });

  it('should calculate integration trust score (96.8)', () => {
    const trust = IntegrationEventBusEngine.calculateIntegrationTrustScore();
    expect(trust.compositeTrustScore).toBe(96.8);
  });
});
