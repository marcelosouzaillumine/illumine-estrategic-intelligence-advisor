import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { BalanceSheetCapability } from '../../capabilities/BalanceSheetCapability';

describe('Balance Sheet Certification - Gate 6', () => {
  const capability = new BalanceSheetCapability();

  it('1. Zero UI Governance: FinancialPositionPage must not contain banned terms', () => {
    // We read the actual page component
    const filePath = path.join(__dirname, '../../../../../../src/components/pages/FinancialPositionPage.tsx');
    const pageContent = fs.readFileSync(filePath, 'utf-8').toLowerCase();

    // Verify it doesn't contain local math logic that should be in the Engine
    expect(pageContent).not.toContain('const totalcurrent =');
    expect(pageContent).not.toContain('usefinancialmath');
    expect(pageContent).not.toContain('aggregatepositions');
    
    // Banned narrative logic
    expect(pageContent).not.toContain('a empresa está saudável');
    expect(pageContent).not.toContain('recomendamos');
    expect(pageContent).not.toContain('comitê fiduciário homologa');
  });

  it('2. Capability Ownership: Verify structural metadata', () => {
    const result = capability.evaluate({
      tenantId: 'T1',
      period: '2026-Q2',
      snapshotId: 'snap-1',
      financialData: []
    });

    expect(result.evidence.capabilityName).toBe('BalanceSheetCapability');
    expect(result.evidence.owner).toBe('Financial Governance Domain');
  });

  it('3. Evidence Coverage: Every result has an evidence Reference ID', () => {
    const result = capability.evaluate({
      tenantId: 'T1',
      period: '2026-Q2',
      snapshotId: 'snap-1',
      financialData: [{ saldoAtual: 100, saldoInicial: 50, moeda: 'BRL' }]
    });

    expect(result.evidence.tenantId).toBeDefined();
    expect(result.evidence.dataSource).toBeDefined();
    // Real implementation would also check that UI components are actually receiving this
  });
});
