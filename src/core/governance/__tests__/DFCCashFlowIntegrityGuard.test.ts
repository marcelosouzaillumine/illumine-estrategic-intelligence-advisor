import { describe, it, expect } from 'vitest';
import { DFCCashFlowIntegrityGuard } from '../runtime/governance/dfc/DFCCashFlowIntegrityGuard';
import { DFCCashBPDivergenceAudit } from '../runtime/governance/dfc/DFCCashBPDivergenceAudit';

describe('DFCCashFlowIntegrityGuard', () => {
  it('deve bloquear quando detectar NaN em variáveis críticas', () => {
    const result = DFCCashFlowIntegrityGuard.validate(NaN, 100, 50, 150);
    expect(result.isValid).toBe(false);
    expect(result.blockReason).toContain('Valores corrompidos detectados');
  });

  it('deve bloquear quando FCO + FCI + FCF for diferente da variação líquida declarada', () => {
    // FCO = 100, FCI = -50, FCF = 0 => Total = 50. Informado: 200 (Divergência matemática)
    const result = DFCCashFlowIntegrityGuard.validate(100, -50, 0, 200);
    expect(result.isValid).toBe(false);
    expect(result.blockReason).toContain('Inconsistência matemática na DFC');
  });

  it('deve passar em validações matematicamente corretas', () => {
    const result = DFCCashFlowIntegrityGuard.validate(100, -50, 0, 50);
    expect(result.isValid).toBe(true);
  });
});

describe('DFCCashBPDivergenceAudit', () => {
  it('deve bloquear se a linha final de caixa DFC for diferente da linha de caixa BP acima da tolerância', () => {
    const result = DFCCashBPDivergenceAudit.evaluate(1000, 500, 2000, 1500);
    expect(result.severity).toBe('MATHEMATICAL_BLOCKING');
  });

  it('deve gerar EXPLAINABLE_WARNING quando lucro contábil for positivo e FCO for negativo', () => {
    const result = DFCCashBPDivergenceAudit.evaluate(1500, -500, 2000, 2000);
    expect(result.severity).toBe('EXPLAINABLE_WARNING');
    expect(result.explanation).toContain('lucro contábil');
    expect(result.explanation).toContain('consome caixa');
  });

  it('deve passar sem warnings se lucro e caixa estão saudáveis e alinhados', () => {
    const result = DFCCashBPDivergenceAudit.evaluate(1500, 2000, 2000, 2000);
    expect(result.severity).toBe('NONE');
  });
});
