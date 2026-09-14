# Contract: ExecutiveReport

**Version:** 1.0
**Domain:** Decision Governance

## 1. Description
The `ExecutiveReport` represents the synthesized executive insight generated from underlying financial and timeline layers. It distills complex metrics into actionable priorities, governance status, and capital preservation logic.

## 2. Interface Definition
```typescript
interface ExecutiveReport {
  executionId: string;
  executiveLayer: {
    capitalPreservationScore: { score: number; components: Record<string, number> };
    patrimonialRecoveryHorizon: { available: boolean; rationale: string };
    capitalRecoverability: { classification: string };
    governanceInterpretation: { classification: string; narrative: string };
  };
  earningsQuality: {
    score: number;
    semanticLabel: string;
    netIncomeTrace: Record<string, unknown>;
  };
  cashQuality: {
    score: number;
    semanticLabel: string;
  };
  priorityRankings: Array<{ title: string; severity: string; rationale: string }>;
}
```

## 3. Sovereign Source Engine
* `ExecutiveGovernanceRuntime`
* `InstitutionalFinancialDomainOrchestrator`

## 4. Downstream Consumers
* `CrossStatementCausalityEngine`
* `ExecutiveTimelineEngine`

## 5. Immutability Rules
- Must carry the `executionId` for traceability.
- Values like `score` and `semanticLabel` must be derived explicitly inside the runtime boundaries, never re-calculated in the frontend.
