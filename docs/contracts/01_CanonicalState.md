# Contract: CanonicalState

**Version:** 1.0
**Domain:** Governance Root

## 1. Description
The `CanonicalState` is the ultimate sovereign truth representation of the institutional profile. It enforces fail-closed validation, quarantine conditions, and cross-domain integrity before presenting data to the frontend layer.

## 2. Interface Definition
```typescript
interface CanonicalState {
  version: string;
  timestamp: string;
  constitutionalStatus: 'CONSTITUTIONALLY_VIABLE' | 'CONSTITUTIONAL_QUARANTINE';
  fiduciaryEnforcement: {
    isFailClosed: boolean;
    failClosedReasons: string[];
    enforcementLevel: string;
  };
  domainOutputs: {
    executiveReport?: ExecutiveReport;
    timelineOutput?: TimelineOutput;
    causalityOutput?: CausalityOutput;
    constitutionalOutput?: ConstitutionalOutput;
  };
  metadata: {
    lineageHash: string;
    auditTrail: string[];
  };
}
```

## 3. Sovereign Source Engine
* `ExecutiveAssuranceRuntime`
* `InstitutionalConsistencyGuard`

## 4. Downstream Consumers
* `ConstitutionalGovernanceDashboardEngine`
* All `SFFL` passive React components (via SBP)

## 5. Immutability Rules
- **READ-ONLY in UI:** Under no circumstances can the frontend mutate or extend `CanonicalState`.
- **FAIL-CLOSED:** If `constitutionalStatus === 'CONSTITUTIONAL_QUARANTINE'`, downstream consumers must suppress any positive reinforcement or advisory payloads, replacing them with strict restrictions.
