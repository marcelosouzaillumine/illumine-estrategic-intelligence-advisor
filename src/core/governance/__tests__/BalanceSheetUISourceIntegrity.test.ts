import { describe, it, expect } from 'vitest';
import { BalanceSheetLegacyConsumptionAudit } from '../../runtime/governance/bp/BalanceSheetLegacyConsumptionAudit';

describe('BRILEF v1.0 - UI Source Integrity Test', () => {
  it('should block legacy narrative render', () => {
    // Simulate UI component attempting to render legacy defaultNote
    const legacyText = 'A companhia encerrou o exercício de 2022 com patrimônio líquido positivo de R$ 59,6 mil... Liquidez Real (0,32) ... Loss Absorption Crítico';
    
    const audit = BalanceSheetLegacyConsumptionAudit.auditConsumption(
      'BalanceSheetPage',
      'defaultNote',
      legacyText,
      2023
    );

    expect(audit.source).toBe('LEGACY');
  });

  it('should allow valid governance output', () => {
    const validText = 'A organização apresenta solvência preservada com indicadores de liquidez robustos.';
    
    const audit = BalanceSheetLegacyConsumptionAudit.auditConsumption(
      'BalanceSheetPage',
      'narrative',
      validText,
      2023
    );

    expect(audit.source).toBe('GOVERNANCE_OUTPUT');
  });
});
