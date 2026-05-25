# MASTER CONSOLIDATED INTELLIGENCE ENGINE

Este documento define as diretrizes absolutas para o **Modo Multi-Entity (Inteligência Consolidada)** da plataforma Illumine. A arquitetura corporativa garante que a consolidação financeira e causal ocorra de forma transparente, isolada e isenta de intervenções manuais não auditáveis.

A camada consolidada atua acima do `MASTER_FINANCIAL_INTELLIGENCE_ENGINE.md`, consumindo outputs normalizados de múltiplas entidades (clientes ou holdings associadas) e gerando uma inteligência executiva sistêmica.

---

## 1. Princípios Fundamentais (Active Governance)

- **Pureza Matemática e Causal:** A View Layer (React UI) nunca deduz, recalcula, soma ou classifica risco ou narrativa. A UI age exclusivamente como `Presenter`. A Data Layer age exclusivamente como `Fetcher`.
- **Topologia Rastreada:** O `EntityGraph` rastreia a linhagem `PARENT/SUBSIDIARY` garantindo o correto mapeamento de consolidação e intercompany.
- **Isolamento Single-Entity:** Motores originais de Single-Entity não podem ser poluídos com lógica de consolidação. A consolidação é uma camada superposta que orquestra outputs isolados em um `ConsolidatedFinancialOutput`.
- **Proibição de Fallbacks Silenciosos:** Nenhuma Engine, Gateway ou Loader tem autorização para "tapar buracos" de dados faltantes gerando zeros absolutos. A ausência de materialidade rebaixa o Confidence Score do Runtime, que por sua vez gera *Governance Violations*.

## 2. A Arquitetura das Cinco Fases

O Motor Consolidado foi construído modularmente em cinco Fases de Evolução e Proteção Fiduciária.

### Fase 1: Entity Topology Layer (`src/topology/`)
O cérebro organizacional responsável por descobrir a cadeia societária (`lineage`), estabelecer escopos de consolidação (`100% full consolidation`) e expor dependências mútuas primárias (`IntercompanyResolver`). Mantém total retrocompatibilidade com o sistema de `clientId` original.

### Fase 2: Consolidated Financial Runtime (`src/core/runtime/consolidated/`)
Motor de agregação matemática rigorosa. Orquestra a soma dos BP/DREs através do `ConsolidatedFinancialOrchestrator`, e neutraliza receitas e mútuos entre CNPJs do mesmo grupo por meio do `IntercompanyEliminationEngine`.

### Fase 3: Consolidated Advisory Intelligence Layer (`src/core/runtime/consolidated/advisory/`)
O Motor de Causalidade. Diferencia empresas geradoras de caixa operacional de meras holdings patrimoniais (`HoldingStructureInterpreter`), encontra "crescimento de receita falso" via vendas internas, e propaga risco sistêmico de colapso de caixa (`Treasury Contamination`) se a holding asfixia subsidiárias rentáveis.

### Fase 4: Consolidated Executive Presentation Layer (`src/components/consolidated/`)
A View Layer isolada e protegida. Consome exclusivamente o `ConsolidatedExecutiveAdvisoryReport`. Sem cálculos ou inferências na UI.

### Fase 5: Consolidated Data Integration (`src/core/runtime/consolidated/data/`)
A camada de integração de dados em nuvem. Substitui os mocks locais pelo carregamento paralelo de dados via Firebase, estritamente orientada a não intervir matematicamente.
- **Mapeamento Vigente:** *Legacy ClientId as EntityId Bridge*. Até a futura fase de Data Model Hardening, o motor buscará coleções nativas usando `clientId === entity.id`.
- **Gateways e Loaders:** O `ConsolidatedFinancialDataLoader` carrega todas as entidades do escopo e o `ConsolidatedDataValidationGateway` as converte para o formato rigoroso exigido pelo Runtime Financeiro.
- **Modo Demo:** O fixture `DEMO_GROUP_FIXTURE` permanece em código apenas como switch (DEMO_MODE) no contexto para apresentações comerciais desconectadas.

## 3. Segurança e Auditoria
O sistema é continuamente validado via **Self-Audit Automático (`npm run governance:audit`)**:
1. `runTopologyAudit.ts`: Garante que dependências e métodos de controle acionário funcionem.
2. `runConsolidatedFinancialAudit.ts`: Protege as regras de eliminação intra-grupo.
3. `runConsolidatedAdvisoryAudit.ts`: Avalia se o IA determinístico está rastreando causalidade estrutural parasitária de forma sensível.
4. `runConsolidatedPresentationAudit.ts`: Escaneia os componentes visuais para garantir obediência cega ao padrão de pureza da View Layer.
5. `runConsolidatedDataIntegrationAudit.ts`: Vasculha as Data Layers para proibir uso de reduce(), operações matemáticas ou mock leaking.

> A Inteligência Consolidada não pode, em nenhuma circunstância, mascarar prejuízos estruturais ou inflar números via eliminações imperfeitas. No Illumine, Risco Oculto em Filiais contamina a narrativa da Holding.
