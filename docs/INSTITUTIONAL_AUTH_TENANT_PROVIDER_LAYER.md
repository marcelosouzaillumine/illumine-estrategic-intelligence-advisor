# INSTITUTIONAL_AUTH_TENANT_PROVIDER_LAYER

FINALIDADE

Este documento define oficialmente a camada de autenticação institucional e provisão multi-tenant da plataforma Illumine.

A INSTITUTIONAL_AUTH_TENANT_PROVIDER_LAYER torna-se responsável por:

* autenticação institucional;
* identidade executiva;
* tenant resolution;
* entity resolution;
* role resolution;
* session governance;
* tenant isolation runtime;
* propagation de contexto institucional;
* enforcement de RBAC;
* injeção de DataAccessContext;
* governança de sessão;
* autorização contextual;
* bootstrap institucional do runtime.

A plataforma Illumine deixa oficialmente de operar com:

* contexto mockado;
* legacyTenantId transitório;
* injeção manual de actorId;
* roles hardcoded em componentes;
* contexto local improvisado.

A Illumine passa a operar como:

* infraestrutura institucional autenticada;
* runtime multi-tenant contextual;
* sistema executivo governado por sessão institucional.

⸻

PRINCÍPIO CENTRAL

A plataforma deverá operar sob:

**Institutional Session First**

Nenhuma operação institucional poderá ocorrer sem:

* sessão autenticada;
* tenant resolvido;
* role resolvida;
* entityScope resolvido;
* permissions resolvidas;
* contexto institucional válido.

⸻

GOVERNANÇA CENTRAL

Toda implementação deverá obedecer:

* MASTER_ARCHITECTURE.md
* ENTERPRISE_PRODUCTIZATION_LAYER.md
* MULTI_TENANT_GOVERNANCE_LAYER.md
* RBAC_PERMISSION_MATRIX.md
* INSTITUTIONAL_ACCESS_GOVERNANCE.md
* INSTITUTIONAL_AUTH_TENANT_PROVIDER_LAYER.md

⸻

OBJETIVO DA CAMADA

Eliminar definitivamente:

* legacyTenantId;
* mocks de usuário;
* contexto fixo;
* permissões locais;
* identity injection manual.

Substituir por:

* InstitutionalAuthProvider;
* TenantResolutionEngine;
* InstitutionalSession;
* RuntimeContextProvider;
* SessionGovernanceLayer.

⸻

COMPONENTES OBRIGATÓRIOS

### 1. InstitutionalAuthProvider

Responsável por:
* autenticação;
* recuperação da sessão;
* resolução do usuário institucional;
* bootstrap do runtime contextual.

Deverá prover:
* actorId;
* tenantId;
* role;
* permissions;
* entityScope;
* consolidatedScope;
* groupScope;
* sessionMetadata.

### 2. TenantResolutionEngine

Responsável por:
* resolver tenant institucional;
* resolver entityScope;
* resolver grupo econômico;
* resolver ownership scope;
* validar isolation boundaries.

Nenhuma sessão poderá:
* possuir tenant indefinido;
* acessar tenant cruzado;
* operar sem entityScope.

### 3. InstitutionalSession

Contrato institucional obrigatório:

```typescript
interface InstitutionalSession {
  actorId: string;
  tenantId: string;
  role: OfficialRole;
  permissions: OfficialAction[];
  entityScope: string[];
  groupScope?: string[];
  consolidatedScope?: boolean;
  visibilityPolicies: VisibilityPolicy[];
  sessionId: string;
  authenticatedAt: string;
  requestSource: string;
}
```

### 4. RuntimeContextProvider

Responsável por:
* distribuir contexto institucional;
* alimentar GovernedRepositories;
* alimentar PermissionEngine;
* alimentar EntityScopeEngine;
* alimentar observability;
* alimentar simulations;
* alimentar reporting.

### 5. Session Governance

Toda sessão deverá possuir:
* lineage;
* auditabilidade;
* timeout;
* invalidation;
* refresh governance;
* access telemetry.

⸻

REMOÇÃO OBRIGATÓRIA

A plataforma deverá remover progressivamente:

* legacyTenantId;
* mock CFO users;
* mock actorId;
* hardcoded role injection;
* fake institutional contexts;
* local context builders em páginas React.

⸻

UI GOVERNANCE

Componentes React:

* não poderão montar DataAccessContext;
* não poderão definir roles;
* não poderão definir tenantId;
* não poderão inferir permissions.

A UI deverá consumir exclusivamente:
* InstitutionalSession;
* RuntimeContextProvider;
* hooks governados.

⸻

SEGURANÇA

Toda autenticação deverá operar com:
* tenant isolation;
* session lineage;
* audit trail;
* secure token propagation;
* permission enforcement;
* request governance.

⸻

OBSERVABILITY

Toda sessão deverá gerar:
* session telemetry;
* permission telemetry;
* denial telemetry;
* cross-tenant detection;
* runtime access analytics.

⸻

PROIBIÇÕES

A plataforma NÃO poderá:
* operar sem sessão institucional;
* operar sem tenant resolvido;
* operar com permissões implícitas;
* permitir identity spoofing;
* permitir actorId manual;
* permitir role manual em componentes;
* permitir bypass do RuntimeContextProvider.

⸻

OBJETIVO FINAL

A plataforma Illumine passa a operar como:

* Authenticated Institutional Runtime
* Enterprise Multi-Tenant Executive Environment
* Session-Governed Governance Platform
* Fiduciary Access Infrastructure

com:

* autenticação institucional;
* tenant isolation;
* RBAC contextual;
* sessões governadas;
* runtime autenticado;
* propagação institucional segura.
