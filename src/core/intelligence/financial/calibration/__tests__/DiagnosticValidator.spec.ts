import { describe, it, expect } from 'vitest';
import { FinancialDiagnosticValidator, ValidationInput } from '../FinancialDiagnosticValidator';

describe('FinancialDiagnosticValidator', () => {
  const validator = new FinancialDiagnosticValidator();

  it('should flag CONFLICT for high liquidity but stress diagnosis', () => {
    const input: ValidationInput = {
      liquidityImmediate: 8.0, // Altíssimo
      diagnosis: 'SEVERE_LIQUIDITY_STRESS'
    };
    
    const result = validator.validate(input);
    expect(result.validationStatus).toBe('CONFLICT');
    expect(result.confidenceAdjustment).toBe(-100);
  });

  it('should flag INSUFFICIENT_EVIDENCE if evaluating cash flow without operating cash flow metric', () => {
    const input: ValidationInput = {
      netIncome: 1000,
      diagnosis: 'CASH_BURN'
    };

    const result = validator.validate(input);
    expect(result.validationStatus).toBe('INSUFFICIENT_EVIDENCE');
    expect(result.conflictingMetrics).toContain('operatingCashFlow (missing)');
  });

  it('should pass as VALID for consistent data', () => {
    const input: ValidationInput = {
      liquidityImmediate: 0.4, // Baixa liquidez
      diagnosis: 'SEVERE_LIQUIDITY_STRESS'
    };

    const result = validator.validate(input);
    expect(result.validationStatus).toBe('VALID');
    expect(result.confidenceAdjustment).toBe(0);
  });
});
