# Runtime Domain Review Program v1.1 — Constitutional Governance Runtime
## Relatório de Auditoria Local

Este relatório foca exclusivamente nas ocorrências dentro de `src/core/runtime/constitutional-governance/`.

### Resumo Executivo
- **DO_NOT_TOUCH:** 1 ocorrências
- **REVIEW_REQUIRED:** 20 ocorrências
- **SAFE_NOW:** 0 ocorrências

---

## DO_NOT_TOUCH (1 itens)
| Arquivo | Linha | Código | Justificativa |
|---|---|---|---|
| `FiduciaryAxiomEngine.ts` | 121 | `public evaluateReportAxioms(report: any): { isViolated: bool` | Engine de avaliação fiduciária. Não tocar para evitar quebra em regras constitucionais. |

## REVIEW_REQUIRED (20 itens)
| Arquivo | Linha | Código | Justificativa |
|---|---|---|---|
| `ConstitutionalAxiomDisclosureEngine.ts` | 4 | `public static extractAxioms(runtimeOutput: any): Constitutio` | Contrato de extração. O payload runtimeOutput precisará de interface própria. |
| `ConstitutionalConfidenceDisclosureEngine.ts` | 4 | `public static extractConfidence(runtimeOutput: any): Confide` | Contrato de extração. O payload runtimeOutput precisará de interface própria. |
| `ConstitutionalEnforcementDisclosureEngine.ts` | 4 | `public static extractEnforcementActions(runtimeOutput: any):` | Contrato de extração. O payload runtimeOutput precisará de interface própria. |
| `ConstitutionalGovernanceDashboardEngine.ts` | 14 | `public static generate(runtimeOutput: any): ConstitutionalGo` | Análise manual pendente. |
| `ConstitutionalGovernanceRuntime.ts` | 26 | `public static evaluate(context: any): ConstitutionalComplian` | Entrada principal de orquestração do Runtime Constitucional. |
| `ConstitutionalGovernanceRuntime.ts` | 70 | `protocols: results as any,` | Cast de resultados dinâmicos. Risco de alteração sem contrato firme. |
| `ConstitutionalLineageDisclosureEngine.ts` | 4 | `public static extractLineage(runtimeOutput: any): Constituti` | Contrato de extração. O payload runtimeOutput precisará de interface própria. |
| `ConstitutionalProtocolDefinition.ts` | 4 | `payload?: any;` | Definição de contrato base de protocolo. |
| `ConstitutionalProtocolDefinition.ts` | 12 | `validate(context: any): ValidationResult;` | Análise manual pendente. |
| `ConstitutionalRestrictionDisclosureEngine.ts` | 4 | `public static extractRestrictions(runtimeOutput: any): Const` | Contrato de extração. O payload runtimeOutput precisará de interface própria. |
| `ConstitutionalRestrictionDisclosureEngine.ts` | 8 | `canonicalRestr.forEach((r: any) => {` | Mapeamento dinâmico. Necessário inferir contrato restritivo. |
| `protocols/AIConstitutionProtocol.ts` | 9 | `public validate(context: any): ValidationResult {` | Contrato de entrada público do protocolo. Requer tipagem formal do contexto constitucional. |
| `protocols/CausalConstitutionProtocol.ts` | 9 | `public validate(context: any): ValidationResult {` | Contrato de entrada público do protocolo. Requer tipagem formal do contexto constitucional. |
| `protocols/ExecutiveDecisionConstitutionProtocol.ts` | 13 | `public validate(context: { cglContext: any, decisions: Execu` | Parâmetro agnóstico do protocolo (contexto base ou cglContext). |
| `protocols/FiduciaryConstitutionProtocol.ts` | 9 | `public validate(context: any): ValidationResult {` | Contrato de entrada público do protocolo. Requer tipagem formal do contexto constitucional. |
| `protocols/LineageConstitutionProtocol.ts` | 9 | `public validate(context: any): ValidationResult {` | Contrato de entrada público do protocolo. Requer tipagem formal do contexto constitucional. |
| `protocols/ScenarioConstitutionProtocol.ts` | 10 | `public validate(context: { baselineContext: any, scenarioCon` | Parâmetro agnóstico do protocolo (contexto base ou cglContext). |
| `protocols/ScenarioSimulationConstitutionProtocol.ts` | 13 | `public validate(context: { baselineContext: any, scenario: I` | Parâmetro agnóstico do protocolo (contexto base ou cglContext). |
| `protocols/SemanticConstitutionProtocol.ts` | 10 | `public validate(context: any): ValidationResult {` | Contrato de entrada público do protocolo. Requer tipagem formal do contexto constitucional. |
| `protocols/TreasuryConstitutionProtocol.ts` | 9 | `public validate(context: any): ValidationResult {` | Contrato de entrada público do protocolo. Requer tipagem formal do contexto constitucional. |

## SAFE_NOW (0 itens)
_Nenhuma ocorrência encontrada._

