# PLATFORM_RENDER_PROTOCOL.md — Platform Render Protocol v1.0

> **Padrão Normativo de Renderização Visual do Platform Workspace & Governança Operacional**  
> *Autoridade Supreme: Architecture Review Board (ARB) & Experience Architecture Foundation (EAF v1.0)*  
> *Alinhado à [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md), ADR-069, ADR-070 e ADR-077*

---

## 1. Visão Geral e Princípio Central (ADR-077)

O **Illumine Operating System (Illumine OS™)** segrega estritamente dois ambientes funcionais:

```
Illumine Operating System
├── Executive Workspace (Decisões de C-Level, Conselho & Diretoria — 8 Camadas Cognitivas)
└── Platform Workspace  (Administração, Governança Cadastral & Operações — 6 Camadas Operacionais)
```

O **Platform Workspace** tem como foco responder à pergunta:  
> *"A plataforma está corretamente configurada, integrada e operando com qualidade de dados?"*

As páginas de cadastro e operação jamais renderizam componentes de consultoria executiva (`ExecutiveDiagnosis`, `ExecutiveRecommendation`, `ExecutiveNarrative`).

---

## 2. Estrutura Canônica das 6 Camadas Operacionais

```
Platform Page
│
├── Layer 1 — Platform Header (Nome do recurso, ambiente, tenant, status operacional)
├── Layer 2 — Governance Overview (Saúde da base cadastral, cadastros pendentes & erros)
├── Layer 3 — Operational Metrics (Métricas operacionais puras, totais, ativos e completude)
├── Layer 4 — Platform Workspace (Tabelas operacionais, busca, filtros & master-detail)
├── Layer 5 — Platform Editor (Formulários de criação, edição e permissões)
└── Layer 6 — Platform Audit Trail (Rastreabilidade de usuário, alteração, data & origem)
```

---

## 3. Especificação dos Componentes Canônicos de Plataforma (`src/components/platform/`)

1. `<PlatformHeader />`: Identificação operacional do recurso e ambiente.
2. `<PlatformGovernanceOverview />`: Resumo fiduciário da qualidade dos dados e sincronizações.
3. `<PlatformOperationalMetrics />`: Cards de métricas numéricas diretas sem tom consultivo.
4. `<PlatformWorkspace />`: Contêiner de tabelas operacionais e ações de lote.
5. `<PlatformEditor />`: Painel de edição de parâmetros e permissões de acesso.
6. `<PlatformAuditTrail />`: Histórico imutável de alterações e log fiduciário.
7. `<PlatformStatusCard />`: Exibição de integridade dos conectores e registros.

---

## 4. Classificação de Páginas

### Registration Experience (Platform Workspace)
- `ClientsPage` / `ClientsManagementPage`
- `CompaniesPage`
- `PartnersPage`
- `UsersPage`
- `PermissionsPage`

### Operational Experience (Operational Workspace)
- `TasksPage`
- `WorkflowsPage`
- `ProjectsPage`
- `PendingActionsPage`
