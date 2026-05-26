# Board Experience Layer

## Overview
The Board Experience Layer is an operational, fiduciary-safe visual environment designed for executive boards. It leverages the Institutional Operating System and the Executive Experience Governance Model to provide deterministic, causation-first navigation for enterprise data without any AI inference or visual sugar-coating.

## Core Principles
1. **Runtime-Backed:** No storytelling exists without a valid `sourceRuntime`.
2. **Lineage-Driven:** All narratives must possess a verifiable causal `lineage`.
3. **Confidence-Aware:** `LOW` or `MEDIUM` confidence levels trigger absolute disclosures. `UNVERIFIED` data acts as a block.
4. **Violation-Visible:** Active violations (`CRITICAL`, `WARNING`) can never be hidden, suppressed, or visually downgraded.
5. **Causality-First:** Navigation moves naturally from macroscopic summary to root causes, and then to propagation impacts.
6. **Fiduciary-Safe:** Fail-Closed mechanisms govern all rendering attempts. If the data is tampered with, the UI dies gracefully via `BoardModeGuard`.

## Component Architecture
- **`BoardExperienceShell.tsx`**: The master Dummy Renderer container.
- **`BoardModeGuard.ts`**: The client-side gatekeeper verifying hash integrity and absolute compliance before mounting UI.
- **`RuntimeDisclosureBanner.tsx`**: The unremovable header identifying the state of the reality runtime (Confidence, Violations).
- **`BoardNarrativeNavigator.tsx`**: Governs traversal using `InstitutionalBoardFlow` restrictions (e.g. no skipping Root Cause to go to Recommendations).
- **`CausalDrilldownPanel.tsx`**: Renders explicit causality paths as mapped in the lineage.
- **`ExecutiveEvidenceExplorer.tsx`**: Presents hard telemetry metrics for any presented insights.
- **`InstitutionalTimelineViewer.tsx`**: Projects chronologies built exclusively from the Runtime's evidence chain.

## Governance & Audit
Any attempt to render a dashboard without `RuntimeDisclosureBanner` or bypass `BoardModeGuard` triggers a fatal block. All navigations log an audit trail within the `ExecutiveSessionContext`.
