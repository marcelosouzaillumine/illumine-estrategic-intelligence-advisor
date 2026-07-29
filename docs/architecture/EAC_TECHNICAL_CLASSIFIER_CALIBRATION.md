# EAC Technical Layer Classifier Calibration

## 1. Objective and Methodology
This calibration ran against a stratified sample of 25 candidates to determine if "Technical Layer" elements belong to distinct cognitive sections or if they are intrinsically mixed in practice.
No pages were modified. No wrappers were created.

## 2. Sample Results Overview
- **Sample Size**: 25 components
- **MIXED_BOUNDARY**: 19 cases
- **Isolated Roles**: 4 cases (Audit Trail, Data Provenance, Decision Trace)
- **NOT_APPLICABLE**: 2 cases

### Accuracy & Precision Insights
- **True Positives for Isolated Cognitive Roles**: Very Low. The classifier revealed that "Methodology", "Evidence", and "Provenance" are rarely isolated into purely distinct sections.
- **False Positives in Discovery**: High. The previous discovery incorrectly classified components based on single keywords without checking if they co-occurred with other technical roles.

## 3. Co-Occurrence Matrix
The vast majority of the components display severe co-occurrence:
- **Evidence + Provenance**: Highly common. Components pulling raw data almost always cite the source.
- **Trace + Recommendation**: Frequent in governance dashboards where the audit log is shown alongside the rationale.
- **Analytics + Raw Data**: Common in financial pages like DFC and EFOS.

## 4. Conclusion
The calibration proves that creating separate wrappers for `Methodology`, `Evidence`, and `Provenance` would be an architectural mistake. These roles are intertwined inside single components.
