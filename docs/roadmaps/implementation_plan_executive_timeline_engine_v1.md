# Implementation Plan — Executive Timeline Engine (ETE) v1.0

## Goal Description
Build the Executive Timeline Engine (ETE) as the official longitudinal intelligence layer of the Governance Runtime.

The ETE transforms validated multi-period runtime outputs into institutional trajectory intelligence, enabling boards and executives to understand not only current conditions but also directional evolution over time.

The ETE must remain deterministic, explainable, lineage-backed and fully auditable. No generative inference may occur. All conclusions must be derived from validated historical runtime outputs.

---

## User Review Required

> [!IMPORTANT]
> The Executive Timeline Engine is a `LONGITUDINAL_INTELLIGENCE_LAYER`.
> It does **not**:
> * recalculate KPIs;
> * consume raw accounting statements;
> * override fiduciary classifications;
> * generate governance decisions.
>
> The ETE only interprets temporal movement of already validated runtime outputs.

---

## Proposed Architecture

```
Historical Runtime Outputs (T-N ... T-1) + Current Output (T-0)
                             │
                             ▼
                 Executive Timeline Engine (ETE)
                             │
                             ▼
                  ExecutiveTimelineOutput
                             │
                             ▼
                    Board Pack Runtime
                             │
                             ▼
         Sovereign Fiduciary Frontend Layer (SFFL)
```

---

## New Core Types

### [NEW] `src/core/runtime/executive-timeline/executive-timeline-types.ts`

```typescript
export type TrajectoryClassification =
  | 'IMPROVING'
  | 'RECOVERING'
  | 'STABLE'
  | 'PLATEAUED'
  | 'DETERIORATING'
  | 'STRUCTURALLY_DETERIORATING'
  | 'CONSTITUTIONALLY_RESTRICTED'
  | 'INSUFFICIENT_EVIDENCE';

export type AccelerationState =
  | 'POSITIVE_ACCELERATION'
  | 'NEGATIVE_ACCELERATION'
  | 'NEUTRAL_ACCELERATION';

export type TimelineConfidence =
  | 'HIGH_CONFIDENCE'
  | 'MEDIUM_CONFIDENCE'
  | 'LOW_CONFIDENCE'
  | 'FAIL_CLOSED';

export interface TimelineInflectionPoint {
  cycleReference: string;
  metricName: string;
  previousValue: number | string;
  newValue: number | string;
  direction: 'UP' | 'DOWN';
  fiduciaryImpact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface TimelineEvent {
  cycleReference: string;
  eventType:
    | 'TREASURY_RUPTURE'
    | 'LIQUIDITY_RECOVERY'
    | 'CAPITAL_EROSION'
    | 'EBITDA_INFLECTION'
    | 'DEBT_ACCELERATION'
    | 'WORKING_CAPITAL_INVERSION'
    | 'CONSTITUTIONAL_RESTRICTION';
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'RESTRICTIVE';
  lineageHash: string;
}

export interface ExecutiveTimelineOutput {
  trajectoryClassification: TrajectoryClassification;
  accelerationState: AccelerationState;
  confidenceLevel: TimelineConfidence;
  inflectionPoints: TimelineInflectionPoint[];
  timelineEvents: TimelineEvent[];
  executiveNarrative: string;
  lineageHash: string;
}
```

---

## Proposed Changes

### Core Engine and Sub-Engines

#### [NEW] `src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts`
* Primary entry point for timeline analysis.
* Combines trajectory, acceleration, confidence, and events engines.
* Emits `ExecutiveTimelineOutput`.

#### [NEW] `src/core/runtime/executive-timeline/engines/TrajectoryClassificationEngine.ts`
* Evaluates score trends YoY/Period-over-Period.
* Classifies the timeline trajectory (`IMPROVING`, `DETERIORATING`, etc.).

#### [NEW] `src/core/runtime/executive-timeline/engines/TimelineAccelerationEngine.ts`
* Evaluates velocity changes of core composite scores.
* Outputs the `AccelerationState`.

#### [NEW] `src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts`
* Analyzes past reports to flag fiduciary events (EBITDA inflection, capital erosion, cash depletion, etc.).

#### [NEW] `src/core/runtime/executive-timeline/engines/TimelineConfidenceEngine.ts`
* Determines confidence level based on history depth (cycles >= 3) and lineage integrity.

---

### Runtime and Presentation Integrations

#### [MODIFY] `src/core/runtime/executive-intelligence-runtime.ts`
* Incorporate `ExecutiveTimelineEngine` call within the main flow.
* Inject output under `report.timeline`.

#### [MODIFY] `src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts`
* Map the timeline section from the executive report into the board pack response structure.

#### [NEW] `src/components/pages/governance/ExecutiveTimelinePanel.tsx`
* Read-only dashboard panel to display historical trajectory, events list, inflection points, and confidence.

---

## Verification Plan

### Automated Tests
* Create unit test suite `tests/executive-timeline.test.ts` representing Scenario A, B, C, D, E.
* Ensure typecheck, linting, and self-audit compliance are maintained.
