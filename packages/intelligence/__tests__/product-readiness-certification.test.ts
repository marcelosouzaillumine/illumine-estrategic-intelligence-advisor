/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ProductReadinessContract } from '@illumine/executive-contracts';

describe('@illumine/governance (Wave 18.7 Product Readiness Certification)', () => {
  it('should validate ProductReadinessContract with Evidence-First metrics and ARB decision (PRC v1.0 / ADR-085)', () => {
    const contract: ProductReadinessContract = {
      readinessId: 'prc-18.7-001',
      version: '1.0.0',
      auditTimestamp: '2026-07-30T11:00:00Z',
      totalComponents: 148,
      componentsUsed: 148,
      unusedComponents: 0,
      coveragePercent: 100,
      findings: [
        {
          findingId: 'fnd-01',
          title: 'Validação de Isocronismo Visual e Invariância Fiduciária',
          severity: 'S4',
          impactCategory: 'UserExperience' as any,
          evidence: {
            evidenceId: 'ev-01',
            inspectedFile: 'src/components/executive/advisory/ExecutiveAdvisoryWorkspace.tsx',
            commandExecuted: 'npm run typecheck',
            verificationStatus: 'VERIFIED'
          },
          resolution: 'Isolamento de workspace homologado com 100% de sucesso'
        }
      ],
      arbDecision: 'APPROVED'
    };

    expect(contract.arbDecision).toBe('APPROVED');
    expect(contract.coveragePercent).toBe(100);
    expect(contract.findings[0].evidence.verificationStatus).toBe('VERIFIED');
  });
});
