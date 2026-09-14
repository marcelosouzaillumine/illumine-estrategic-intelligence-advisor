import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BalanceSheetPresentationLeakAudit } from '../src/capabilities/runtime/governance/bp/BalanceSheetPresentationLeakAudit';
import { BalanceSheetRuntimePresentationReconciliationAudit } from '../src/capabilities/runtime/governance/bp/BalanceSheetRuntimePresentationReconciliationAudit';

describe('Balance Sheet Fail-Closed Rendering Golden Test', () => {
  it('should completely nullify executive content when blocking state is active', () => {
    // Simulating the exact state of the GovernanceOutput after a SEMANTIC_DRIFT_DETECTED
    const mockOutput = {
      blockingState: {
        isBlocked: true,
        blockingCode: 'SEMANTIC_DRIFT_DETECTED',
        blockingReason: 'Narrativa incompatível com os indicadores do exercício selecionado.'
      },
      // When blocked, the runtime should have set these to undefined/null
      executiveNarrative: undefined,
      boardNarrative: undefined,
      patrimonialThesis: undefined,
      executivePlan: undefined,
      recommendations: []
    };

    const auditResult = BalanceSheetPresentationLeakAudit.audit(mockOutput);
    
    assert.strictEqual(auditResult.hasLeak, false, 'Should have no presentation leaks');
    assert.strictEqual(auditResult.leaks.length, 0);
  });

  it('should detect a presentation leak if an executive field survives the block', () => {
    const leakyOutput = {
      blockingState: { isBlocked: true },
      executiveNarrative: 'Esta narrativa não deveria existir no output bloqueado.'
    };

    const auditResult = BalanceSheetPresentationLeakAudit.audit(leakyOutput);
    
    assert.strictEqual(auditResult.hasLeak, true, 'Should detect presentation leak');
    assert.ok(auditResult.leaks.includes('executiveNarrative'));
  });

  it('should reconcile runtime and UI states correctly', () => {
    const runtimeBlocked = true;
    const uiShowingContent = true;

    const reconcileResult = BalanceSheetRuntimePresentationReconciliationAudit.reconcile(runtimeBlocked, uiShowingContent);
    
    assert.strictEqual(reconcileResult.isValid, false);
    assert.strictEqual(reconcileResult.violation, 'FAIL_CLOSED_VIOLATION: Runtime is blocked but UI is exhibiting executive content');
  });

  it('should pass reconciliation when UI correctly hides content', () => {
    const reconcileResult = BalanceSheetRuntimePresentationReconciliationAudit.reconcile(true, false);
    assert.strictEqual(reconcileResult.isValid, true);
  });
});
