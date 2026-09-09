# Observability Integration Audit

Auditoria dos pontos de instrumentação futura para a camada de rastreabilidade institucional. Nenhuma *engine* foi alterada semanticamente nesta fase. O objetivo é mapear onde os *hooks* de observabilidade (`TraceChainBuilder`) serão anexados.

## 1. Motores Analíticos (Engines)

| Domínio | Ponto de Injeção Primário | Estado Atual | Esforço de Injeção |
|---|---|---|---|
| **Executive Runtime** | `src/core/runtime/executive-governance-runtime.ts` | Processamento isolado. Produz BPs e Relatórios. | Médio (Necessita acoplar Lineage ID ao input DRE) |
| **ESGIM Runtime** | `src/core/runtime/esgim/ESGIMRuntime.ts` | Tipado. Gera matriz material. | Baixo |
| **Governance Journey** | `src/core/governance/journey/JourneyEngine.ts` | Gera Maturity Scores. | Baixo |
| **Constitutional Runtime** | `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts` | Valida axiomas, bloqueia decisões. | Alto (Requer TraceChain detalhado) |
| **Causality Engine** | `src/core/governance/causality/CausalityEngine.ts` | Analisa restrições sistêmicas. | Alto |
| **Scenario Runtime** | `src/core/runtime/scenario/ScenarioRegistry.ts` | Aplica choques, salva simulações. | Médio (Requer acoplar Scenario ID no Trace) |
| **Board Governance** | `src/core/governance/board-decision/BoardDecisionEngine.ts` | Sintetiza narrativas do conselho. | Médio |

## 2. Superfícies de Saída (Outputs)

| Superfície | Artefato Fiduciário | Integração Trace |
|---|---|---|
| **Advisory Narrative** | Textos gerados | Anexar `DecisionChainId` |
| **PDF Reports** | Download Executivo | Imprimir `CorrelationId` e `LineageId` no rodapé |
| **Board Packs** | Documentos do Conselho | Vincular `TraceId` integral |

---
*Conclusão da Auditoria:* Todos os módulos fiduciários encontram-se plenamente isolados, o que viabiliza a introdução de `TraceChainBuilder` nas bordas de entrada e saída sem comprometer as funções puras de cálculo.
