import { describe, it, expect } from 'vitest';
import { BalanceSheetRuntimeUIReconciliationAudit } from '../../runtime/governance/bp/BalanceSheetRuntimeUIReconciliationAudit';
import { RecommendationSourceAudit } from '../../runtime/governance/bp/RecommendationSourceAudit';

describe('BRILEF v1.0 - Granatum 2023 BP Integration Golden Test', () => {
  it('should block legacy strings like PL 59,6 mil and Liquidez Real 0,32', () => {
    // 1. Runtime vs UI Reconciliation (Mismatch)
    const runtimeValue = 9.05;
    const renderValue = 0.32; // Simulating UI rendering the hardcoded defaultNote

    const reconciliation = BalanceSheetRuntimeUIReconciliationAudit.reconcile(
      runtimeValue,
      renderValue,
      'Liquidez Real'
    );

    expect(reconciliation.severity).toBe('BLOCKING');
  });

  it('should block cross-statement recommendation leak', () => {
    const recommendationText = 'Recomendamos estancar a queima de caixa imediatamente.';
    
    const audit = RecommendationSourceAudit.audit(
      recommendationText,
      { statement: 'BP', engine: 'LegacyEngine' }
    );

    expect(audit.severity).toBe('BLOCKING');
  });
});
