# Protocolo de Operação Piloto (Phase 8.3)

Este documento define os parâmetros, limites e diretrizes da primeira operação piloto real com dados controlados na plataforma Illumine, em estrita conformidade com os princípios da arquitetura `Runtime-First`.

## 1. Definições de Participantes Autorizados

Para garantir isolamento e segurança fiduciária, a operação piloto operará exclusivamente sob os seguintes escopos:

- **Tenants Piloto Autorizados**:
  - `tenantId: "PILOT-TENANT-HQ"` (Holding Principal do grupo de testes)
  - `tenantId: "PILOT-TENANT-SUB1"` (Primeira subsidiária)
- **Empresas Piloto (Clientes)**:
  - `clientId: "PILOT-CLIENT-A"` (Operadora de Tecnologia)
  - `clientId: "PILOT-CLIENT-B"` (Serviços Compartilhados)
- **Usuários Piloto Autorizados**:
  - `actorId: "USER-PILOT-CFO"` (Perfil CFO, com direitos de promoção e publicação)
  - `actorId: "USER-PILOT-OPERATOR"` (Perfil Operador, restrito a upload e staging)
  - `actorId: "USER-PILOT-AUDITOR"` (Perfil Auditor, somente leitura da linhagem e logs)

## 2. Datasets Autorizados

Nenhum outro tipo de dado ou estrutura externa poderá ser alimentado:
1. **Financial Statements**: BP, DRE, DFC estruturados com base no plano de contas governado.
2. **Transactional Statements**: Lançamentos brutos de contas a pagar (`TRANSACTIONS_PAYABLES`) e contas a receber (`TRANSACTIONS_RECEIVABLES`).

## 3. Limites Operacionais & Tolerâncias

- **Materialidade Contábil**: Tolerância de arredondamento fixada em `0.0005` (0.05% do Ativo Total) para Balanço Patrimonial.
- **Tolerância Transacional**: Não são permitidos títulos com valor igual a zero ou datas futuras incoerentes.
- **Teto de Upload**: Máximo de 1.000 registros por lote (`batchId`) para evitar sobrecarga no gateway de staging.

## 4. Protocolo de Soft Rollback Fiduciário (`PilotRollbackProtocol`)

Para assegurar a reversibilidade integral da operação sem comprometer a rastreabilidade e a linhagem (Lineage), o processo de reversão obedecerá às seguintes regras rígidas:

1. **Sem Deleção Destrutiva**: Nenhum comando físico de `DELETE` ou purga de banco de dados poderá ser acionado sobre logs de auditoria, históricos de validação ou lineage.
2. **Estados Fiduciários**: No banco `financial_staging`, o status dos registros revertidos será modificado para `'REVERTED'`.
3. **Governance Gate**: Qualquer reversão exige justificação, identificação do ator fiduciário (`actorId`), timestamp preciso e o escopo da operação.
4. **Despublicação**: O `ImportPublicationEngine` anulará a assinatura digital do pacote de dados, registrando um evento `IMPORT_REVERTED`.
