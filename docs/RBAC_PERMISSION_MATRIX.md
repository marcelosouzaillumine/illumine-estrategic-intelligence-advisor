# RBAC_PERMISSION_MATRIX

## FINALIDADE

Este documento define oficialmente a matriz institucional de permissões da plataforma Illumine.

A RBAC_PERMISSION_MATRIX torna-se a referência obrigatória para controlar:
* acesso por papel;
* acesso por tenant;
* acesso por entidade;
* acesso por relatório;
* acesso por simulação;
* acesso por snapshot;
* permissões fiduciárias;
* permissões executivas;
* exportações;
* auditoria;
* governança multi-tenant.

Toda implementação de acesso deverá obedecer:
* MASTER_ARCHITECTURE.md
* INSTITUTIONAL_ACCESS_GOVERNANCE.md
* MULTI_TENANT_GOVERNANCE_LAYER.md
* ENTERPRISE_PRODUCTIZATION_LAYER.md
* RBAC_PERMISSION_MATRIX.md

⸻

## PRINCÍPIO CENTRAL

A plataforma deverá operar pelo princípio:

**LEAST PRIVILEGE BY DEFAULT**

Todo usuário nasce sem acesso implícito.

Qualquer permissão deverá ser:
* explícita;
* rastreável;
* associada a tenantId;
* associada a entityScope;
* associada a role;
* auditável.

⸻

## PAPÉIS OFICIAIS

**SUPER_ADMIN**

Responsável pela governança global da plataforma.

Permissões:
* gerenciar tenants;
* gerenciar configurações globais;
* visualizar health técnico da plataforma;
* configurar políticas globais.

Restrições:
* não pode alterar lineage histórico;
* não pode apagar snapshots fiduciários;
* não pode modificar reports exportados;
* não pode acessar dados sensíveis de tenant sem autorização institucional explícita.

⸻

**TENANT_ADMIN**

Responsável pela administração local do tenant.

Permissões:
* gerenciar usuários do tenant;
* atribuir roles internas;
* configurar entidades;
* configurar visibility policies;
* visualizar auditorias do tenant.

Restrições:
* não pode acessar outros tenants;
* não pode apagar lineage;
* não pode sobrescrever snapshots;
* não pode exportar relatórios bloqueados por policy.

⸻

**BOARD_MEMBER**

Usuário de conselho.

Permissões:
* visualizar board packs aprovados;
* visualizar advisory consolidado aprovado;
* visualizar simulations board-approved;
* visualizar snapshots institucionais aprovados;
* exportar relatórios autorizados.

Restrições:
* não pode editar dados;
* não pode alterar parâmetros de runtime;
* não pode modificar simulations;
* não pode acessar dados operacionais brutos se não autorizado.

⸻

**CFO**

Usuário executivo financeiro.

Permissões:
* visualizar BP, DRE, Caixa;
* visualizar Executive Advisory completo;
* criar simulations;
* visualizar causalidade financeira;
* gerar board packs;
* criar fiduciary snapshots;
* visualizar observability financeira.

Restrições:
* não pode apagar snapshots;
* não pode sobrescrever lineage;
* não pode acessar tenants externos;
* não pode alterar logs.

⸻

**CONTROLLER**

Usuário técnico-financeiro.

Permissões:
* importar dados;
* revisar dados;
* validar conciliações;
* visualizar BP, DRE, Caixa;
* preparar reports;
* visualizar logs operacionais.

Restrições:
* não pode aprovar board packs;
* não pode exportar relatórios fiduciários sem aprovação;
* não pode alterar advisory;
* não pode compartilhar simulations estratégicas.

⸻

**AUDITOR**

Usuário de auditoria.

Permissões:
* acesso somente leitura;
* visualizar lineage;
* visualizar snapshots;
* visualizar logs;
* visualizar report versions;
* executar replay quando permitido.

Restrições:
* não pode editar dados;
* não pode criar simulations;
* não pode alterar reports;
* não pode gerar advisory.

⸻

**ADVISOR**

Usuário consultivo.

Permissões:
* visualizar entidades autorizadas;
* visualizar advisory contextual;
* criar simulations permitidas;
* gerar análises dentro do entityScope.

Restrições:
* não pode acessar entidades fora do escopo;
* não pode exportar board packs sem autorização;
* não pode alterar lineage;
* não pode acessar dados de outros tenants.

⸻

**OPERATIONAL_USER**

Usuário operacional.

Permissões:
* visualizar dados operacionais liberados;
* inserir dados conforme escopo;
* acompanhar status básicos.

Restrições:
* não pode visualizar advisory estratégico;
* não pode criar simulations críticas;
* não pode acessar snapshots fiduciários;
* não pode exportar reports executivos.

⸻

**INVESTOR**

Usuário investidor.

Permissões:
* visualizar relatórios aprovados;
* visualizar dashboards investidor-approved;
* baixar materiais liberados.

Restrições:
* não pode visualizar causalidade interna completa;
* não pode visualizar stress tests internos;
* não pode acessar logs;
* não pode acessar simulations draft.

⸻

## MATRIZ DE PERMISSÕES

**AÇÕES PRINCIPAIS**

Permissões mínimas por ação:
* VIEW_DASHBOARD
* VIEW_FINANCIALS
* VIEW_EXECUTIVE_ADVISORY
* VIEW_CAUSALITY
* VIEW_OBSERVABILITY
* CREATE_SIMULATION
* SHARE_SIMULATION
* APPROVE_SIMULATION
* VIEW_SIMULATION
* EXPORT_SIMULATION
* CREATE_SNAPSHOT
* VIEW_SNAPSHOT
* EXPORT_SNAPSHOT
* CREATE_BOARD_PACK
* APPROVE_BOARD_PACK
* VIEW_BOARD_PACK
* EXPORT_BOARD_PACK
* MANAGE_USERS
* MANAGE_TENANT
* MANAGE_ENTITY
* VIEW_AUDIT_LOGS
* EXECUTE_REPLAY
* IMPORT_DATA
* APPROVE_DATA
* CONFIGURE_POLICIES

⸻

## VISIBILITY POLICIES

Toda permissão deverá respeitar também a visibilityPolicy do recurso.

Políticas mínimas:
* PUBLIC_WITHIN_TENANT
* INTERNAL
* CFO_ONLY
* BOARD_ONLY
* AUDIT_LOCKED
* INVESTOR_APPROVED
* PRIVATE_TO_OWNER
* BOARD_APPROVED
* REGULATORY_EXPORT

⸻

## ENTITY SCOPE

Toda permissão deverá ser avaliada em conjunto com:
* tenantId;
* entityId;
* groupId;
* consolidatedScope;
* ownershipScope.

Nenhuma permissão poderá atravessar entityScope sem autorização explícita.

⸻

## DECISÃO DE ACESSO

Toda decisão de acesso deverá avaliar:
1. tenantId;
2. userRole;
3. permissions;
4. entityScope;
5. visibilityPolicy;
6. resourceOwner;
7. approvalState;
8. auditRequirement.

A ausência de qualquer elemento obrigatório deverá resultar em:

**DENY BY DEFAULT**

⸻

## AUDITORIA OBRIGATÓRIA

Toda ação sensível deverá gerar log:
* actorId;
* tenantId;
* role;
* permission;
* resourceId;
* resourceType;
* entityScope;
* timestamp;
* decision;
* reason.

Ações sensíveis:
* exportação;
* criação de snapshot;
* criação de board pack;
* approval;
* replay;
* simulation sharing;
* alteração de policy;
* alteração de usuários.

⸻

## PROIBIÇÕES

A plataforma NÃO poderá:
* conceder acesso implícito;
* permitir acesso cross-tenant;
* permitir acesso sem entityScope;
* permitir exportação sem log;
* permitir alteração de lineage;
* permitir exclusão de snapshots fiduciários;
* permitir advisory estratégico para roles não autorizadas;
* permitir simulation crítica sem governança.

⸻

## OBJETIVO FINAL

A RBAC_PERMISSION_MATRIX estabelece a base institucional para implementar:
* Permission Engine;
* Entity Scope Engine;
* Tenant Isolation;
* Report Visibility Governance;
* Simulation Governance;
* Fiduciary Snapshot Access Control;
* Immutable Audit Trail.

A plataforma Illumine deverá operar com permissionamento explícito, auditável, segregado e fiduciariamente seguro.
