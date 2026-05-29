# Governance Workflow Reference (GOVERNANCE_WORKFLOW_REFERENCE)

This document provides technical reference details regarding workflow state transitions, audit lineages, and visibility policies.

## 1. State Machine Transitions

Workflow state changes (e.g., from `MANAGEMENT_ACTION` to `CFO_INTERVENTION` or `BOARD_INTERVENTION`) must be processed fiduciarily:
- Transitions require an authorized executive actor.
- A valid, non-empty `lineageHash` representing the source dataset must accompany the transition.
- A unique `correlationId` tracks the workflow request sequence.

## 2. Audit Lineage Tracing

Every transaction review, scenario simulation, and qualitative feedback submission generates an immutable lineage reference prefix (`0xMAIN...`). This allows:
- Reconstructing the exact input configuration that led to a specific recommendation.
- Verifying the deterministic correlation of causal scores.
- Proving compliance to external fiduciaries.
