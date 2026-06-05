# Contract: CausalityOutput

**Version:** 1.0
**Domain:** Causality Diagnostics

## 1. Description
The `CausalityOutput` maps the exact tension vectors between financial statements (e.g., Profit vs. Cash, Equity vs. Funding), exposing structural impossibilities or hidden financial engineering.

## 2. Interface Definition
```typescript
interface CausalityOutput {
  tensionsDetected: number;
  criticalTensions: Array<{
    sourceNode: string;
    targetNode: string;
    tensionType: 'LIQUIDITY_TRAP' | 'ARTIFICIAL_FUNDING' | 'EQUITY_EROSION' | 'PHANTOM_PROFIT';
    severity: string;
    rationale: string;
  }>;
  overallCausalityHealth: string;
  blockedConclusions: string[];
}
```

## 3. Sovereign Source Engine
* `CrossStatementCausalityEngine`
* `InstitutionalCausalityExplorer`

## 4. Downstream Consumers
* `ExecutiveAssuranceRuntime`
* `InstitutionalResilienceEngine`

## 5. Immutability Rules
- The `blockedConclusions` array is sovereign: if causality marks a conclusion as blocked (e.g., "Cannot claim organic growth"), no upstream or downstream system can override this block.
