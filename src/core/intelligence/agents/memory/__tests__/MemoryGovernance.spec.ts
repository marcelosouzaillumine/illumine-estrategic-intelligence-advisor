import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryGovernance } from '../MemoryGovernance';
import { MemoryType, MemoryLifecycleStatus } from '../contracts/ExecutiveMemoryArtifact';
import { MemoryConfidenceLevel } from '../contracts/MemoryConfidenceLevel';

describe('MemoryGovernance', () => {
  let governance: MemoryGovernance;

  beforeEach(() => {
    governance = new MemoryGovernance();
  });

  it('should block an automated agent from registering a decision', () => {
    const artifact: any = {
      type: MemoryType.DECISION_CONTEXT,
      source: { user: 'ExecutiveFinancialAgent', timestamp: '2025' }
    };
    expect(() => governance.validateArtifact(artifact)).toThrowError(/Automated agents cannot create decisions/);
  });

  it('should downgrade a human FACT to a VALIDATED_INSIGHT', () => {
    const artifact: any = {
      type: MemoryType.INSIGHT,
      confidence: MemoryConfidenceLevel.FACT,
      source: { user: 'CFO', timestamp: '2025' }
    };
    const validated = governance.validateArtifact(artifact);
    expect(validated.confidence).toBe(MemoryConfidenceLevel.VALIDATED_INSIGHT);
  });
});
