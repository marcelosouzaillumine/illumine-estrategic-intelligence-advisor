# EAC Technical Cognitive Taxonomy

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
