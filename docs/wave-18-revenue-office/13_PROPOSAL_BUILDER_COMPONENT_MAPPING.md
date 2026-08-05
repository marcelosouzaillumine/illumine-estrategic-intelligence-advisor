# Wave 18B.2 — Component Mapping

This document enforces the Visual Constitution by mapping the Revenue Domain entities directly to their feature components and the underlying Executive Design System UI.

| Domain Concept | Feature Component | UI Component (Design System) | Capability |
| :--- | :--- | :--- | :--- |
| **Proposal Workspace** | `ProposalBuilderWorkspace` | `ExecutiveWorkspaceLayout`, `PageHeader` | The orchestration shell, navigation, and global context injection. |
| **Proposal Section** | `ProposalSectionEditor` | `ExecutiveCard`, `ExecutiveAccordion` | Modular block rendering depending on section type (Hero, Challenge, Solution). |
| **Template Instance** | `ProposalTemplateSelector` | `SemanticCard`, `ExecutiveStatusBadge` | Grid displaying available blueprints (Enterprise, Consulting, Channel). |
| **Implementation Plan** | `ProposalTimelineEditor` | `ExecutiveLineageTimeline` | Visual builder mapping to `ProposalImplementationPlan` milestones. |
| **Pricing Snapshot** | `ProposalPricingPanel` | `ExecutiveMetricCard`, `ExecutiveTable` | Financial summary configuration linking to `ProposalPricingSnapshot`. |
| **Approval Status** | `StatusView` / `ProposalPreview` | `ExecutiveDecisionTrace`, `ExecutiveVerdictCard` | Renders the audit trail and current version state (Draft, InternalReview, Published). |
| **Digital Acceptance** | `DigitalAcceptanceForm` | `ExecutiveActionSurface`, `ExecutiveDecisionMemo` | Client signature module triggering the `ProposalAccepted` event. |
