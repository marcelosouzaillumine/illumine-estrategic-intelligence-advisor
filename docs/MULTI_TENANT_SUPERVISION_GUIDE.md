# Guia de Supervisão Multi-Tenant e Isolamento Contábil (Assessores)

Este manual destina-se a consultores, parceiros estratégicos e assessores financeiros (advisors). Ele descreve a arquitetura de isolamento contábil de inquilinos e as diretrizes para auditar visualizações consolidadas multi-tenant.

---

## 1. Arquitetura de Isolamento de Inquilino

A plataforma assegura o isolamento lógico rigoroso de dados de inquilino (tenant data partition) por padrão.
- **Armazenamento**: Cada inquilino possui coleções isoladas identificadas por `tenantId`.
- **Visibilidade de Memória**: O contexto do React é alimentado pelo `TenancyProvider`, expondo apenas os dados pertencentes ao `activeTenantId` selecionado pelo usuário.
- **Bypass Restrito**: Nenhuma consulta ao banco de dados Firestore ou processador em memória pode ler registros sem aplicar a cláusula de filtro de `tenantId`.

---

## 2. Prerrogativas de Função (Role-Based Access Control)

Apenas usuários com funções administrativas e consultivas elevadas podem visualizar múltiplos inquilinos de maneira integrada:

- **MASTER_ADMIN / ADVISOR**: Podem acessar o **Multi-Tenant Operations Grid** para comparar índices de estresse operacional, tendências de liquidez regional e conformidade agregada de grupos econômicos.
- **CLIENT_USER**: Não possui acesso ao Grid Multi-Tenant. Se tentar acessar, a interface exibirá um aviso de restrição de segurança e a API interceptadora bloqueará a requisição.

---

## 3. Logs de Auditoria Contínua

Cada leitura ou acesso a relatórios e painéis que exibam dados consolidados multi-tenant aciona o `MultiTenantSupervisionEngine`.
- **Geração de Evidência**: O engine valida a função do usuário (`actorRole`) e invoca o `TenantAuditLogger.logAction` registrando no Firestore:
  - `actorId` do assessor.
  - `targetTenantId` acessado.
  - Ação (`VIEW_REPORT` ou `UNAUTHORIZED_ACCESS_ATTEMPT`).
  - Carimbo de data/hora (timestamp).
  - Descrição da finalidade fiduciária daquela visualização.
  
Isso garante conformidade total com as normas brasileiras de sigilo bancário, societário e LGPD.

---

## 4. Operações no Grid de Supervisão

O **Multi-Tenant Operations Grid** consolida os estados de estresse calculados para cada empresa ou subsidiária:
1. **Stress Index**: Taxa calculada de deterioração de governança e pressão de liquidez baseando-se apenas em eventos append-only.
2. **Tendências de Risco**: Agrega sinais de mercado e riscos comuns a múltiplos inquilinos sem expor dados confidenciais confinados.
3. **Controle de Vazamento**: O Grid nunca renderiza balanços brutos de outro inquilino para um assessor sem auditoria ativa em andamento.
