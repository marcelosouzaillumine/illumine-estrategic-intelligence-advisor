import { describe, it, expect } from 'vitest';
import { FinancialContradictionDetector } from '../FinancialContradictionDetector';
import { ValidationInput } from '../FinancialDiagnosticValidator';

describe('FinancialContradictionDetector', () => {
  const detector = new FinancialContradictionDetector();

  it('should detect FALSE_LIQUIDITY_ALARM', () => {
    const input: ValidationInput = {
      liquidityImmediate: 7.65,
      diagnosis: 'Crise severa de liquidez'
    };
    
    const contradictions = detector.detect(input);
    expect(contradictions.length).toBe(1);
    expect(contradictions[0].type).toBe('FALSE_LIQUIDITY_ALARM');
  });

  it('should detect UNHEALTHY_GROWTH', () => {
    const input: ValidationInput = {
      revenueGrowth: 0.15,
      ebitdaMarginGrowth: -0.05,
      operatingCashFlow: -100,
      diagnosis: 'Expansão de mercado'
    };
    
    const contradictions = detector.detect(input);
    expect(contradictions.length).toBe(1);
    expect(contradictions[0].type).toBe('UNHEALTHY_GROWTH');
  });

  it('should detect IDLE_CAPITAL_RISK', () => {
    const input: ValidationInput = {
      cashBalance: 1200000,
      revenueGrowth: 0.02,
      roic: 0.05,
      diagnosis: 'Operação estável'
    };
    
    const contradictions = detector.detect(input);
    expect(contradictions.length).toBe(1);
    expect(contradictions[0].type).toBe('IDLE_CAPITAL_RISK');
  });
});
