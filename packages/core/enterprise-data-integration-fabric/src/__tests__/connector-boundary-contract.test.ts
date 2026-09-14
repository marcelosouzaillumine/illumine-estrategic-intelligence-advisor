/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ConnectorFrameworkEngine } from '../index';

describe('Quality Gate 1 — Connector Boundary Contract Test', () => {
  it('should enforce that no connector manifest exposes direct access to Executive Runtime or AI Agents', () => {
    const manifest = ConnectorFrameworkEngine.createManifest('crm-01', 'Salesforce CRM', 'COMMERCIAL', 'CommercialGovernanceBoundary');

    // Connector output MUST be a CertifiedDomainDataset, not a raw agent runtime call
    expect(manifest.outputDataset).toBeDefined();
    expect(manifest.outputDataset.identity.domain).toBe('COMMERCIAL');
    expect((manifest as any).agentRuntime).toBeUndefined();
    expect((manifest as any).executiveCouncil).toBeUndefined();
  });
});
