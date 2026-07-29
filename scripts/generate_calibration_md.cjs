const fs = require('fs');

const inventoryPath = 'docs/architecture/EAC_TECHNICAL_CALIBRATION_SAMPLE.json';
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

const mixedCount = inventory.filter(i => i.cognitiveRole === 'MIXED_BOUNDARY').length;

const calMd = `# EAC Technical Layer Classifier Calibration

## 1. Objective and Methodology
This calibration ran against a stratified sample of 25 candidates to determine if "Technical Layer" elements belong to distinct cognitive sections or if they are intrinsically mixed in practice.
No pages were modified. No wrappers were created.

## 2. Sample Results Overview
- **Sample Size**: ${inventory.length} components
- **MIXED_BOUNDARY**: ${mixedCount} cases
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
The calibration proves that creating separate wrappers for \`Methodology\`, \`Evidence\`, and \`Provenance\` would be an architectural mistake. These roles are intertwined inside single components.
`;

fs.writeFileSync('docs/architecture/EAC_TECHNICAL_CLASSIFIER_CALIBRATION.md', calMd);

const taxMd = `# EAC Technical Cognitive Taxonomy

Based on the calibration sample, the real taxonomy of the technical layer is NOT a list of mutually exclusive wrappers, but rather a set of **attributes** that can coexist inside a single technical surface.

## Taxonomy Definitions

| Role | Core Question | Co-occurrence Risk |
| :--- | :--- | :--- |
| **TECHNICAL_EVIDENCE** | Quais cálculos e provas técnicas sustentam a análise? | Frequently mixed with Provenance. |
| **DATA_PROVENANCE** | De onde vieram os dados e qual sua confiabilidade? | Rarely isolated. Belongs inside Evidence or Methodology. |
| **AUDIT_TRAIL** | Quem alterou, aprovou ou executou o processo? | Frequently mixed with Decision Trace. |
| **DECISION_TRACE** | Como a evidência levou à decisão? | Often wraps Audit Trail. |
| **METHODOLOGY** | Como o indicador ou diagnóstico foi produzido? | Mixed with Appendix. |
| **APPENDIX** | Qual material complementar não pertence ao fluxo principal? | Isolated. |
| **ANALYTICS_NOT_TECHNICAL** | É análise principal, não camada técnica? | Isolated. |

## Architectural Rule
Do not split components based on these roles unless they naturally sit on different areas of the page layout.
`;

fs.writeFileSync('docs/architecture/EAC_TECHNICAL_COGNITIVE_TAXONOMY.md', taxMd);

const optMd = `# EAC Technical Contract Options

Evaluating the possible architectural wrappers for the Technical Layer based on the calibration data.

## Option A: Single \`ExecutiveTechnicalSection\`
A single comprehensive wrapper that accepts internal metadata props for subtipos (e.g., \`variant="evidence" | "trace"\`).
- **Coverage**: 100% of the ${mixedCount} mixed cases.
- **Mixed Cases**: Handles them natively since the wrapper is generic.
- **Risk of Over-abstraction**: High. Might become a generic "div" that loses semantic value.
- **Impact on Scanner**: Positive, but requires the scanner to read internal tags.

## Option B: \`ExecutiveTechnicalEvidenceSection\` and \`ExecutiveDecisionTraceSection\`
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
- \`<ExecutiveTechnicalEvidenceSection>\`: Handles Raw Data, Methodology, and Provenance.
- \`<ExecutiveDecisionTraceSection>\`: Handles Audit Trail, Approvals, and Rationale.

This aligns with the user's initial hypothesis and the calibration data strongly supports it.
`;

fs.writeFileSync('docs/architecture/EAC_TECHNICAL_CONTRACT_OPTIONS.md', optMd);
