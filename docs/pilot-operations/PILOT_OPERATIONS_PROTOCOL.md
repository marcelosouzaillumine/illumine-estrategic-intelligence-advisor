# Controlled Pilot Operations Protocol (PILOT_OPERATIONS_PROTOCOL)

This document establishes the operational parameters, isolation rules, and fail-closed procedures for pilot environments of the Illumine Strategic Intelligence Platform.

## 1. Core Principles

- **Operational Validation Only**: Pilot environments are designed strictly to validate executive usability, governance comprehension, and system performance. They do not serve as production environments or feature sandboxes.
- **Strict Logical Isolation**: Every pilot tenant's data, caches, memory, and telemetry must reside in separate, non-overlapping contexts. No cross-contamination of metadata or logs is permitted.
- **No speculative or generative AI inputs**: All calculations of corporate governance metrics, liquidity buffers, and causal linkages must use verified, deterministic algorithms.

## 2. Status & Health Assessment Matrix

The system dynamically monitors and maps operational status to health bands:

- **ONBOARDING / ACTIVE** -> **HEALTHY**: Regular operation, low error rates, normal cognitive load.
- **DEGRADED / SUPERVISION_REQUIRED** -> **PARTIAL / DEGRADED**: Active blocking feedback or elevated telemetry errors.
- **FAIL_CLOSED** -> **FAIL_CLOSED**: Immediate restriction of interactive options, blocking data submission, displaying only the immutable audit lineage.

## 3. Supervision Telemetry

Telemetry collection is restricted to:
- Time spent on workflows (latencies).
- Page access frequencies.
- Interaction counts.
- System error triggers.

Demographics, sensitive business variables, or raw inputs are never logged.
