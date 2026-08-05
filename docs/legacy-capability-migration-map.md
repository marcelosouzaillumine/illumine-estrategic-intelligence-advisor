# Legacy Capability Migration Map

This document tracks the migration of legacy pages and components into the new **Executive Operating System** (Capability-driven architecture).

| Legado atual | Novo destino | Status |
| :--- | :--- | :--- |
| DRE | CFO Office → Financial Performance | Migrar |
| Fluxo de Caixa | CFO Office → Cash Intelligence | Migrar |
| Contas a pagar/receber | CFO Office → Working Capital | Bridge |
| Clientes | Advisor Office → Client Intelligence | Migrar |
| Projetos | Advisor Office → Engagement Management | Migrar |
| Relatórios | Executive Intelligence Center | Reestruturar |
| Cadastros | Administration | Manter |

## CFO Office Migration

- **Financial Performance**: Substitui DRE e indicadores financeiros atuais. A nova experiência segue a jornada: `Insight → KPI → Risco → Recomendação → Ação`.
- **Cash Intelligence**: Substitui o fluxo de caixa, liquidez e análise operacional.
- **Planning & Forecast**: Substitui orçamento, comparativos e projeções.

## Advisor Office Migration

- **Client Intelligence**: Migração de clientes, projetos, contratos e acompanhamento.
- **Modelo de Jornada**: `Cliente → Diagnóstico → Plano de ação → Resultado`.

## CEO Office Migration

- Estratégia, metas, OKRs e indicadores globais.

## Board Intelligence Migration

- Governança, riscos e decisões.

## Desligamento do Legado (Fase 4)

Somente após a migração das Capabilities acima:
1. Remover menus antigos.
2. Remover rotas antigas do `routes.tsx`.
3. Retirar componentes obsoletos de `src/components/pages`.
4. Ativar de forma exclusiva e definitiva o **Executive Workspace**.
