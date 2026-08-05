# Tenant Isolation Constitution

## Princípio Fundamental
A arquitetura Illumine opera como um ecossistema Multi-Tenant B2B. Os dados de um cliente (Tenant) são ativos intocáveis por qualquer entidade externa ao seu escopo contratual ou de governança. O vazamento de dados inter-tenant é classificado como violação crítica.

## 1. Conceito de Tenant
Um **Tenant** é o ambiente lógico que cerca uma empresa ou corporação cliente na plataforma.
- Ele possui um identificador unívoco (`clientId` ou `tenantId`).
- Todos os registros transacionais, operacionais e de indicadores (Financeiro, OKRs, Documentos) pertencem absoluta e irredutivelmente a um Tenant.

## 2. Regras de Segregação

### 2.1 Segregação no Front-End
A UI deve solicitar explicitamente o ID do Tenant para operações.
Quando o `ExecutiveContext` é estabelecido, ele define o **Tenant Ativo**. Nenhuma visualização (gráficos, tabelas) pode exibir dados a menos que os dados possuam a chave de identificação idêntica ao Tenant Ativo em sessão.

### 2.2 Segregação em Domain Services
Repositórios e Serviços devem sempre possuir o `tenantId` como argumento mandatório.
- Exemplo: `financeRepository.getEntries(tenantId)`
- Jamais permitir métodos genéricos como `financeRepository.getAllEntries()` no escopo do cliente, a não ser que a identidade chamadora possua privilégios globais sistêmicos (`MASTER_ADMIN`), verificados pelo `AuthorizationDecisionEngine`.

### 2.3 Segregação Infraestrutural (Firestore Security Rules)
Nossa última camada de defesa é a infraestrutura. O Firestore implementa `Security Rules` rigorosas:
- A leitura ou escrita de um documento na coleção `financial_entries` verifica estritamente: `ownsClient(incoming().clientId)` e `request.auth.uid`.
- As Rules invocam chamadas cruzadas (ex: `get(/databases/$(database)/documents/clients/$(clientId))`) para garantir o pertencimento *before* request processing, impossibilitando bypass no Front-end manipulando o JSON de envio.

## 3. Padrões Obrigatórios

1. **Assinatura Contratual de Tenant:** Todo dado persistido deve conter a propriedade `clientId` ou `tenantId` em sua raiz. Coleções sem Tenant estão proibidas (exceto definições globais de sistema).
2. **Isolamento de Contexto UI:** Os hooks não geram tenantId sozinhos. Eles o extraem obrigatoriamente do `useExecutiveContext()`. Se o tenantId for `null`, o acesso ao módulo é negado e a tela exibe o seletor de cliente (`ClientSelector`).
3. **Escopo de Múltiplos Tenants (Consolidação):** Quando um perfil fiduciário (Advisor) ou proprietário visualizar múltiplos Tenants, as chamadas ocorrem individualizadas por `tenantId` no Application Service e agregadas em memória, ou via Cloud Function certificada. O bypass das Security Rules em UI para multi-tenancy é estritamente proibido.
