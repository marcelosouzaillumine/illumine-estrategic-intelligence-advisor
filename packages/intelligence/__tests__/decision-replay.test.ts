/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionLedgerEngine, DecisionReplayEngine } from '../decision-trust-governance/src';

describe('@illumine/governance (Wave 18.10.5 Decision Replay Engine)', () => {
  it('should replay historical executive decisions deterministically from ledger hash', () => {
    const record = DecisionLedgerEngine.recordDecision('company-granatum', 'dec-2026', 'Cenário Recomendado');
    const replay = DecisionReplayEngine.replayDecision(record);
    expect(replay.isReproducible).toBe(true);
    expect(replay.replayStatus).toContain(record.decisionId);
  });
});
