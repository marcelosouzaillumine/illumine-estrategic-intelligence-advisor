/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionLedgerEngine } from '../decision-trust-governance/src';

describe('@illumine/governance (Wave 18.10.5 Decision Ledger Engine)', () => {
  it('should generate an immutable hash record for decision compliance and auditability', () => {
    const record = DecisionLedgerEngine.recordDecision('company-granatum', 'dec-2026', 'Cenário Recomendado');
    expect(record.immutableHash).toBeDefined();
    expect(record.participatingAgents).toHaveLength(5);
  });
});
