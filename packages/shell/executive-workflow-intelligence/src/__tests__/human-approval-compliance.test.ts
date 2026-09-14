/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionCommandEnvelopeResolver, ExecutiveTrustLedgerEngine, ExecutionEngine } from '../index';

describe('Quality Gate 2 — Human Approval Compliance Test', () => {
  it('should prevent execution of actions with REJECTED status', () => {
    const envelope = DecisionCommandEnvelopeResolver.createEnvelope('dec-crit', 'FinancialAgent', 'CRITICAL', 'M&A');
    const ledgerEntry = ExecutiveTrustLedgerEngine.recordEntry(envelope, 'REJECTED', 'user-board');

    expect(() => ExecutionEngine.executeAction(ledgerEntry)).toThrow('Impossível executar ação rejeitada no fluxo de aprovação fiduciária.');
  });
});
