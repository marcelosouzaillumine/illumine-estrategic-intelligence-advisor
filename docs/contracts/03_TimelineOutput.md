# Contract: TimelineOutput

**Version:** 1.0
**Domain:** Temporal Continuity

## 1. Description
The `TimelineOutput` dictates the chronological order and phase alignment of an institution's history, evaluating if events represent structural regression, stable continuity, or antifragile growth.

## 2. Interface Definition
```typescript
interface TimelineOutput {
  temporalSpan: { startYear: number; endYear: number };
  detectedCycles: number;
  trajectory: 'REGRESSION' | 'STAGNATION' | 'GROWTH' | 'ANTIFRAGILE';
  criticalEvents: Array<{
    year: number;
    eventType: string;
    impactSeverity: string;
  }>;
  continuityNarrative: string;
  isTrueTurnaround: boolean;
}
```

## 3. Sovereign Source Engine
* `ExecutiveTimelineEngine`

## 4. Downstream Consumers
* `ConstitutionalGovernanceDashboardEngine`
* `InstitutionalResilienceEngine`

## 5. Immutability Rules
- Timeline events must be strictly chronologically ordered.
- `isTrueTurnaround` acts as a boolean lock: if true, causality engines must honor the turnaround in predictive scoring.
