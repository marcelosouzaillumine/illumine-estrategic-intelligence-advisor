# Contract: ConstitutionalOutput

**Version:** 1.0
**Domain:** Governance Disclosure

## 1. Description
The `ConstitutionalOutput` represents the aggregated disclosure logic constructed by the Constitutional Governance Dashboard Engine. It transforms raw runtime warnings into strict, auditable governance assertions.

## 2. Interface Definition
```typescript
interface ConstitutionalOutput {
  status: 'CONSTITUTIONALLY_VIABLE' | 'CONSTITUTIONAL_QUARANTINE';
  axioms: Array<{ rule: string; verified: boolean }>;
  restrictions: Array<{ scope: string; restriction: string }>;
  enforcementDetails: {
    failClosedTriggered: boolean;
    reason: string;
  };
  lineage: {
    hash: string;
    complete: boolean;
  };
  confidence: {
    level: string;
    metrics: Record<string, unknown>;
  };
}
```

## 3. Sovereign Source Engine
* `ConstitutionalGovernanceDashboardEngine`

## 4. Downstream Consumers
* `SovereignBoardPackPage.tsx`
* `ConstitutionalGovernanceDashboardPanel.tsx`

## 5. Immutability Rules
- The UI layer strictly renders `ConstitutionalOutput` verbatim.
- No semantic mapping, re-scoring, or local recalculations are permitted in the components consuming this contract.
