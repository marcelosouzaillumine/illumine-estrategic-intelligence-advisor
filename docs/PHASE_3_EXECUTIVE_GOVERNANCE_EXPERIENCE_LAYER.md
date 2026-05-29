# PHASE 3: EXECUTIVE GOVERNANCE EXPERIENCE LAYER

## 1. Objective
This document defines the architectural boundaries for all User Interfaces (UI) within the Illumine Governance Axis. It enforces the **Zero-Logic-UI** principle, ensuring the UI remains a strict, passive renderer of the institutional runtime engines established in Phase 2.

## 2. Core Principle: Zero-Logic-UI
The UI **does not interpret**. The UI **only renders**.

**Prohibited Patterns in React Components:**
- Calculating risk scores (`score =`, `riskScore`, `fiduciaryScore`).
- Inferring severities (`calculateSeverity`, `inferRisk`).
- Prioritizing signals via local `if` statements (`calculatePriority`, `if (severity === 'CRITICAL') { rank = 1 }`).
- Creating causality from isolated metrics.

All interpretation must happen within `src/core/governance/`.

## 3. Component Orchestration Map

### 3.1. ExecutiveMonitoringCenter
- **Role:** Signal Hub.
- **Runtime Dependency:** `ExecutiveAttentionPriorityResolver`
- **Behavior:** Receives definitively resolved and prioritized signals. It does not call suppression logic directly; suppression happens upstream.

### 3.2. DecisionLifecycleCenter
- **Role:** Strict Traceability and Fiduciary Evidence.
- **Runtime Dependency:** `CrossDomainCausalityEngine`
- **Behavior:** Displays decisions separated by 'Company User' and 'Admin Master'. Displays causality lineage but does not judge the fiduciary merit of decisions.

### 3.3. RiskExposureCenter
- **Role:** Systemic Degradation Radar.
- **Runtime Dependency:** `InstitutionalCausalGraph`, `CrossDomainCausalityEngine`
- **Behavior:** Renders the domino effect and interconnected vulnerabilities. Does NOT act as a playbook execution engine.

### 3.4. CrisisResponseCenter
- **Role:** High-Risk Execution.
- **Runtime Dependency:** `SignalPriorityEngine`
- **Behavior:** **Strict Fail-Closed**. Only activates playbooks if the underlying signal exactly matches:
  - `escalationRequired === true`
  - `severity === 'CRITICAL'`
  - `status === 'READY'`
  If any condition fails, it renders an unconditional fail-closed fallback.

### 3.5. BoardDeckCenter
- **Role:** Formal Fiduciary Reporting.
- **Runtime Dependency:** `InstitutionalNarrativeEngine`
- **Behavior:** Consumes the unified narrative and renders the executive summary. Connects narratives to underlying evidence and lineage.

## 4. Enforcement
To prevent regressions, the codebase must statically block local interpretation patterns through the `audit-zero-logic-ui.js` script, which runs as a quality gate on all governance pages.
