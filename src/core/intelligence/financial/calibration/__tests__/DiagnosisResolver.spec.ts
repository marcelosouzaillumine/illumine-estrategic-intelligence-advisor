import { describe, it, expect } from 'vitest';
import { ExecutiveDiagnosisResolver } from '../ExecutiveDiagnosisResolver';
import { DiagnosticValidationResult, ContradictionDetection } from '../contracts/CalibrationContracts';

describe('ExecutiveDiagnosisResolver', () => {
  const resolver = new ExecutiveDiagnosisResolver();

  it('should rewrite diagnosis when FALSE_LIQUIDITY_ALARM is detected', () => {
    const validationResult: DiagnosticValidationResult = {
      validationStatus: 'CONFLICT',
      originalDiagnosis: 'Crise de liquidez',
      evidenceChecked: ['liquidityImmediate'],
      conflictingMetrics: ['liquidityImmediate'],
      confidenceAdjustment: -100
    };

    const contradictions: ContradictionDetection[] = [
      {
        type: 'FALSE_LIQUIDITY_ALARM',
        description: 'Excesso de caixa.',
        involvedMetrics: ['liquidityImmediate: 7.65'],
        severity: 'CRITICAL'
      }
    ];

    const resolved = resolver.resolve(validationResult, contradictions);
    
    expect(resolved.detectedConflict).toBe('FALSE_LIQUIDITY_ALARM');
    expect(resolved.resolvedDiagnosis).toContain('Não foi identificada crise de liquidez');
    expect(resolved.reasoning).toContain('análise integrada de calibração alterou a interpretação executiva');
  });

  it('should maintain original diagnosis if VALID and no contradictions', () => {
    const validationResult: DiagnosticValidationResult = {
      validationStatus: 'VALID',
      originalDiagnosis: 'Crescimento saudável',
      evidenceChecked: ['revenueGrowth'],
      conflictingMetrics: [],
      confidenceAdjustment: 0
    };

    const resolved = resolver.resolve(validationResult, []);
    
    expect(resolved.detectedConflict).toBe('NONE');
    expect(resolved.resolvedDiagnosis).toBe('Crescimento saudável');
  });
});
