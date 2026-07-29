# EAC Technical Contract Options

Evaluating the possible architectural wrappers for the Technical Layer based on the calibration data.

## Option A: Single `ExecutiveTechnicalSection`
A single comprehensive wrapper that accepts internal metadata props for subtipos (e.g., `variant="evidence" | "trace"`).
- **Coverage**: 100% of the 19 mixed cases.
- **Mixed Cases**: Handles them natively since the wrapper is generic.
- **Risk of Over-abstraction**: High. Might become a generic "div" that loses semantic value.
- **Impact on Scanner**: Positive, but requires the scanner to read internal tags.

## Option B: `ExecutiveTechnicalEvidenceSection` and `ExecutiveDecisionTraceSection`
Splitting into exactly two archetypes: Data/Math vs History/Logic.
- **Coverage**: Fits the natural dichotomy found in the codebase (EFOS/DRE use Evidence, Governance uses Trace).
- **Mixed Cases**: Low risk of conflict between these two. Evidence and Trace rarely share the exact same UI component.
- **Risk of Duplicity**: Low.
- **Impact on Scanner**: High precision. The scanner knows exactly if it's reading math or audit logs.

## Option C: Three Wrappers (Evidence, Trace, Methodology)
Adding Methodology as a third wrapper.
- **Coverage**: Fails on the mixed cases. Methodology is almost always embedded inside Evidence.
- **Risk of Duplicity**: Very High.
- **Impact on Scanner**: Negative, creates false boundaries.

## Recommendation
**Option B is the healthiest architecture.**
- `<ExecutiveTechnicalEvidenceSection>`: Handles Raw Data, Methodology, and Provenance.
- `<ExecutiveDecisionTraceSection>`: Handles Audit Trail, Approvals, and Rationale.

This aligns with the user's initial hypothesis and the calibration data strongly supports it.
