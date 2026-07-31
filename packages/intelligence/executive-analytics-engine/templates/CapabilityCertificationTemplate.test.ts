import { describe, it, expect, beforeEach } from 'vitest';
import { CapabilityTemplate, DomainContextTemplate } from './CapabilityTemplate';

describe('CapabilityTemplate Certification', () => {
  let context: DomainContextTemplate;
  let capability: CapabilityTemplate;

  beforeEach(() => {
    capability = new CapabilityTemplate();
    context = {
      tenantId: 'TENANT_TEST',
      period: '2026-Q3',
      snapshotId: 'SNAP_TEST'
    };
  });

  it('must comply with Capability Lifecycle Governance', () => {
    const metadata = CapabilityTemplate.metadata;
    expect(metadata).toBeDefined();
    expect(metadata.capabilityId).toBeTruthy();
    expect(metadata.domain).toBeTruthy();
    expect(metadata.certificationStatus).toBeDefined();
  });

  it('must return 100% evidence coverage inside ExecutiveAnalyticsResult', () => {
    const result = capability.evaluate(context);
    
    expect(result.evidence).toBeDefined();
    expect(result.evidence.evidenceId).toContain('EVD-');
    expect(result.evidence.tenantId).toBe(context.tenantId);
    expect(result.evidence.certifiedAt).toBeDefined();
  });

  it('must not return any pre-formatted narrative text in technicalConclusion', () => {
    const result = capability.evaluate(context);
    
    // Assegurar que os diagnósticos (se houverem) contenham conclusões puramente técnicas
    result.diagnostics.forEach(diag => {
      expect(diag.technicalConclusion).toBeDefined();
      expect(diag.technicalConclusion.length).toBeGreaterThan(0);
      // Example of bad pattern rejection:
      expect(diag.technicalConclusion.toLowerCase()).not.toContain('recomenda-se');
      expect(diag.technicalConclusion.toLowerCase()).not.toContain('sugerimos');
    });
  });
});
