# Contract: BoardPackOutput

**Version:** 1.0
**Domain:** Presentation & Reporting

## 1. Description
The `BoardPackOutput` orchestrates the final unified state required to render the institutional executive summary and deep-dive analytics. It bundles the `CanonicalState` into presentation-ready, safe-to-render data structures.

## 2. Interface Definition
```typescript
interface BoardPackOutput {
  reportId: string;
  generatedAt: string;
  canonicalState: CanonicalState;
  institutionalSummary: {
    lifecycleStage: string;
    governanceMaturity: string;
    capitalPreservationStatus: string;
  };
  executivePriorities: Array<{ priorityId: string; title: string; type: string }>;
  constitutionalDashboard: ConstitutionalOutput;
}
```

## 3. Sovereign Source Engine
* `InstitutionalBoardPackRuntime`

## 4. Downstream Consumers
* `SovereignBoardPackPage.tsx`
* API Export Layers

## 5. Immutability Rules
- The `BoardPackOutput` must directly embed the `CanonicalState` to guarantee that the UI and API layers have the unadulterated source of truth.
- Rendered dashboards must prioritize the `constitutionalDashboard` payload when enforcing warnings.
