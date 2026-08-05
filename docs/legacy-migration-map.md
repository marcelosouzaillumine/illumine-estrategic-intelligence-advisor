# Legacy Page Retirement Map

Este documento consolida o mapeamento "De-Para" da arquitetura legada baseada em telas (Dashboard, Financeiro, Fluxo de Caixa) para o **Executive Navigation Model** (orientado por Capabilities e Decision Surfaces). 

O objetivo é garantir a transição sem perda de contexto funcional e prover clareza sobre quais componentes antigos podem ser descontinuados após a migração da *Wave 17G*.

## Mapeamento de Telas (De-Para)

| Tela Legada | Novo Modelo (Executive OS) | Capability Relacionada | Status |
| :--- | :--- | :--- | :--- |
| **Financeiro** (`/finance/dre`) | CFO Office > Financial Performance | `FINANCIAL_DASHBOARD_VIEW` | ✅ Migrado |
| **DRE** (`/finance/dre`) | CFO Office > Financial Performance | `FINANCIAL_DASHBOARD_VIEW` | ✅ Migrado |
| **Fluxo de Caixa** (`/finance/cash-flow`) | CFO Office > Cash Intelligence | `FINANCIAL_ENTRIES_VIEW` | ✅ Migrado |
| **Relatórios** (`/finance/modeling`) | CFO Office > Executive Insights (Planning) | `FINANCIAL_BUDGET_MANAGE` | 🔄 Híbrido |
| **Clientes** (`/risk/compliance`) | Advisor Office > Client Portfolio | `TENANT_MANAGE` | ⏳ Planejado |
| **Configurações** (`/admin/settings`) | Risk/CEO Office > Administration | `SYSTEM_ADMINISTRATION` | ⏳ Planejado |

## Componentes a Serem Descontinuados (Sunset)
1. `src/components/AppSidebar.tsx` (estruturas legadas `finance_navigation`, `governance_navigation`, etc) - Em processo de refatoração para leitura universal do `navigation.registry.ts`.
2. Páginas de Dashboard legadas que renderizavam dados não validados pela *Enterprise Data Foundation*.
3. Estruturas rígidas de menu (`src/navigation/` antigos).

## Progresso da Migração
- O Menu Legado foi formalmente substituído pelo Executive Workspace Sidebar.
- Nenhuma dependência direta de SDK (Firebase) resiste na camada de UI.
- O Workspace adota hierarquia formal: `Office -> Capability -> Decision Surface -> Intelligence -> Action`.
