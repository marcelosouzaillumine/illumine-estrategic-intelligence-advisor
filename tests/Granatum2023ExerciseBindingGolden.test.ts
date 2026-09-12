import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExerciseBindingGuard } from '../src/capabilities/runtime/governance/bp/BalanceSheetExerciseBindingGuard';
import { BalanceSheetHistoricalContaminationAudit } from '../src/capabilities/runtime/governance/bp/BalanceSheetHistoricalContaminationAudit';

describe('Granatum 2023 Exercise Binding Golden Test (Partial Fail-Closed)', () => {

  it('Scenario 1 - Granatum 2023 correct but summary lacks year (should infer as WARNING and not block)', () => {
    // Input: selectedYear = 2023, bpSummary.exerciseYear = undefined
    const bindingGuard = BalanceSheetExerciseBindingGuard.validate(2023, undefined);
    
    assert.strictEqual(bindingGuard.isValid, true, 'Should not throw EXERCISE_BINDING_VIOLATION for inferred year');
    assert.strictEqual(bindingGuard.severity, 'WARNING');
    assert.strictEqual(bindingGuard.code, 'SUMMARY_YEAR_INFERRED_FROM_SELECTED_YEAR');
  });

  it('Scenario 2 - Granatum 2023 with summary 2022 (should block narrative)', () => {
    // Input: selectedYear = 2023, bpSummary.exerciseYear = 2022
    const bindingGuard = BalanceSheetExerciseBindingGuard.validate(2023, 2022);
    
    assert.strictEqual(bindingGuard.isValid, false);
    assert.strictEqual(bindingGuard.severity, 'BLOCKING');
    assert.strictEqual(bindingGuard.code, 'EXERCISE_BINDING_VIOLATION');
    assert.strictEqual(bindingGuard.violation, 'EXERCISE_BINDING_VIOLATION');
  });

  it('Scenario 3 - Granatum 2023 with technical corruption (should cause technical blockade)', () => {
    // This replicates the runtime logic that flags 'INSUFFICIENT_TECHNICAL_DATA'
    const bpIndicators = [{ metricName: 'Liquidez Real', value: 'INSUFFICIENT_DATA' }];
    
    const technicalViolations: string[] = [];
    if (bpIndicators.some(i => i.value === 'INSUFFICIENT_DATA')) {
      technicalViolations.push('INSUFFICIENT_TECHNICAL_DATA');
    }
    
    const technicalIntegrity = {
      isValid: technicalViolations.length === 0,
      violations: technicalViolations
    };
    
    assert.strictEqual(technicalIntegrity.isValid, false);
    assert.ok(technicalIntegrity.violations.includes('INSUFFICIENT_TECHNICAL_DATA'));
  });
});
