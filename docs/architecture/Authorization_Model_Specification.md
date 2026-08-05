# Authorization Model Specification

## Princípio Fundamental
A autorização na plataforma Illumine nunca é baseada na avaliação literais de títulos organizacionais ("se a pessoa é CFO"). A autorização baseia-se na verificação afirmativa e isolada de uma **Capacidade (Capability)**. 

O sistema avalia "O que este perfil pode fazer?", desacoplando a UI das lógicas intrincadas de compliance.

## 1. O Modelo

O fluxo de Resolução de Autorização opera na seguinte topologia:

```
Persona  --->  Role  --->  Permission  --->  Capability  --->  Action  --->  Policy
```

### 1.1 Persona (O humano ou sistema)
A entidade que tenta realizar a ação. Representada por um `userId` e seu perfil corporativo. Pode atuar em diferentes posições dependendo de qual Tenant está acessando.

### 1.2 Role (Papel de Negócio)
Uma abstração compreensível por humanos (ex: `CLIENT_ADMIN`, `ADVISOR`, `VIEWER`).
Um Role é um "agrupador de Permissões". O sistema o utiliza para facilidade de atribuição, mas **nunca para verificações if/else no código.**

### 1.3 Permission (Permissão Técnica)
Um registro sistêmico associado a um Role.
As permissões são resolvidas pelo `AuthorizationDecisionEngine` e injetadas no contexto do usuário no momento de carga de sua Sessão Executiva.

### 1.4 Capability (Capacidade)
A constante canônica (ex: `FINANCIAL.VIEW`) exposta em `Capabilities.ts`.
Esta é a linguagem primária da aplicação. Componentes visuais utilizam as Capabilities para auto-organizar sua exibição, escondendo ou exibindo botões e módulos.

- **Frontend Check:** `<Can capability={CAPABILITIES.FINANCIAL_VIEW}> ... </Can>`
- **Logic Check:** `can(CAPABILITIES.SYSTEM_ADMINISTRATION)`

### 1.5 Action & Policy
A Capability pode liberar uma Ação abstrata (ex: "Criar Lançamento"). Contudo, antes da persistência, uma Policy mais aprofundada pode entrar em cena no domínio.
Por exemplo, a Capability libera o formulário, mas a Policy `ApprovalThresholdPolicy` determina que lançamentos acima de 1M precisam de aprovação (Estado de Estágio).

## 2. A Camada `AuthorizationDecisionEngine`
O motor central.
1. O Front-end interage com `can()`.
2. Em background ou no carregamento inicial, a engine recebe as credenciais e vínculos, inspeciona o banco (Persistence Contracts) e elabora a matriz de `Capabilities`.
3. Essa matriz é assinada e mantida em memória no `ExecutiveContext`.
4. Todos os hooks de domínio que submetem algo podem rodar validações assíncronas de Policy através desse mesmo motor (`AuthorizationDecisionEngine.authorize(context, capability, payload)`).
