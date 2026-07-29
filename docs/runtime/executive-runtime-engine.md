# AGFP-0020 — Executive Runtime Engine (ERE)

**RFC: Motor Dinâmico de Interpretação de Manifestos e Execução de Interfaces (v15.0)**

---

## 1. Contexto & Objetivo
A **Executive Runtime Engine (ERE)** interpreta os manifestos `.page.manifest.yml` em tempo de execução ou compilação incremental. A ERE garante a conexão automática com o ViewModel, aplicação das regras EBIL, roteamento, permissões e auditoria sem código manual.

---

## 2. Pipeline de Execução do ERE Engine

```text
  [PMS Manifest (.yml)] ➔ [ERE Parser & Validator]
                                  │
  [ViewModel Adapter] ◄──── [Architecture Resolver (EAA vs EFA)]
          │                       │
  [State & Data Provider] ──> [Canonical Component Mapper] ➔ [React Virtual DOM]
```

---

## 3. Tarefas Automáticas do ERE Engine
1. **Identificação de Arquitetura**: Detecta se o manifesto é `EAA` (relatórios/conselho) ou `EFA` (cadastros/operações).
2. **Seleção de Primitivas Canônicas**: Mapeia seções para `ExecutivePageTemplate`, `PageHeader`, `ExecutiveSurface` e `ExecutiveAccordion`.
3. **Aplicação do EBIL**: Injeta a identidade de marca do tenant sem violar os tokens de cor ou tipografia.
4. **Conexão MVVM**: Conecta a página dinamicamente ao ViewModel `useConsolidatedExecutivePageViewModel` ou equivalente.
5. **Cálculo de Métricas AHS e GCI**: Registra continuamente os índices de saúde arquitetural e conformidade.
