# AGFP-0015 — Architecture Decision Records (ADR System)

**RFC: Sistema Formal de Registro de Decisões de Arquitetura do Illumine AGF**

---

## 1. Contexto & Objetivo
Estabelecer o repositório estruturado de decisões técnicas da plataforma, garantindo que toda regra `MUST`, escolha de biblioteca ou contrato de layout possua justificativa, trade-offs analisados e autoria rastreável.

---

## 2. Template Padrão de ADR (Markdown & JSON Schema)

```markdown
# ADR-0042: Adição da Arquitetura Funcional (EFA) para Cadastros e Configurações

* **Status**: Approved
* **Data**: 2026-07-28
* **Autor**: Architecture Review Board
* **Aprovador**: Lead Architect
* **AGFP Relacionado**: AGFP-0012

## Contexto & Problema
Páginas funcionais como `ClientsPage.tsx` e `DadosHistoricosPage.tsx` tentavam forçar a estrutura analítica de relatórios do Conselho, gerando telas prolixas e reduzindo a produtividade operacional.

## Alternativas Consideradas
1. Manter o layout EAA único para todas as telas (Rejeitado: reduz produtividade).
2. Criar layouts ad-hoc por tela (Rejeitado: queima a consistência de UI).
3. Instituir a **Executive Functional Architecture (EFA)** como segundo domínio canônico (Aprovado).

## Decisão
Formalizar a EFA com os padrões `MasterDetailLayout`, `SettingsLayout`, `PipelineLayout` e `TreeMapperLayout`.

## Consequências & Trade-Offs
- **Positivo**: Aumento de 40% na velocidade de cadastro e eliminação de fricção.
- **Trade-Off**: Necessidade de manter dois catálogos de layouts canônicos (EAA e EFA).

## Componentes Afetados & Breaking Changes
- **Afetados**: `ClientsPage`, `PartnersPage`, `DadosHistoricosPage`, `PlanoDeContasPage`.
- **Breaking Change**: Não (Minor release v12.0.0).
```

---

## 3. Fluxo de Aprovação de ADR

```text
  [Draft: Autor] ➔ [Technical Review: Squads] ➔ [ARB Approval: Board] ➔ [Indexed in AKG]
```
