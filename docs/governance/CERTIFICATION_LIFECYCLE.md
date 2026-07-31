# Certification Lifecycle™

The **Certification Lifecycle™** governs the maturity and approval status of every component, page, domain, and subsystem within the Illumine OS™. It ensures the platform communicates institutional maturity rather than a binary pass/fail status.

## Lifecycle States

1. **CANDIDATE**
   - **Definition**: The component or capability has been newly developed or significantly refactored and is submitted to the ARB.
   - **Allowed Actions**: Testing, QA, Staging deployment.

2. **UNDER AUDIT**
   - **Definition**: The Canonical Assurance Engine™ (CAE™) is currently executing its 5 Pipelines over the candidate.
   - **Allowed Actions**: Observation, Telemetry gathering.

3. **CERTIFICATION PENDING**
   - **Definition**: Audit is complete, but pending final human-in-the-loop sign-off by the ARB.
   - **Allowed Actions**: Final review of the EAHI calculation.

4. **CERTIFIED**
   - **Definition**: The subsystem fully complies with the Canonical Constitution and achieves an acceptable EAHI without critical risks.
   - **Allowed Actions**: Production deployment, Enterprise usage.

5. **CERTIFIED WITH CONDITIONS**
   - **Definition**: The subsystem provides high value and meets baseline requirements but has identified Medium/Low risks mapped in the `CANONICAL_RISK_REGISTER.md`.
   - **Constraint**: Includes a mandatory expiration date (e.g., "Certification expires: Wave 16 Review"). Must be addressed by a Transformation T1/T2/T3.
   - **Allowed Actions**: Production deployment with strict monitoring.

6. **CERTIFICATION SUSPENDED**
   - **Definition**: A previously Certified component has drifted (e.g., due to an undetected PR) or degraded in real-world usage, violating the Constitutional Ratchet Enforcement.
   - **Allowed Actions**: Immediate rollback or emergency remediation patch.

7. **REVOKED**
   - **Definition**: The capability fundamentally violates a sovereign constitutional principle (e.g., Cognitive Tenant Isolation breach). 
   - **Allowed Actions**: Deprecation, hard block in CI/CD.
