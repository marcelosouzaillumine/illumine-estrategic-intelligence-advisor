# CONTROLLED_ACTIVATION_PROTOCOL

## Objetivo
Ativar a plataforma Illumine em ambiente controlado utilizando dados reais, preservando integralmente o baseline congelado RC-1.

## Princípios Obrigatórios
1. **Nenhuma alteração estrutural no Runtime**: Toda lógica analítica está bloqueada para modificações.
2. **Nenhuma nova feature**: O escopo está restrito à ativação da arquitetura atual com dados de produção.
3. **Nenhuma flexibilização da governança**: Toda regra de validação, escopo de tenant e isolamento permanece rígida.
4. **Entrada de dado real auditável**: Todo pipeline de dados deve deixar rastros (Lineage).
5. **Onboarding reversível**: Deve ser possível fazer rollback e limpeza completa de tenants de staging sem corromper a plataforma.
6. **Observabilidade de erros**: Erros de ingestão não devem ser engolidos silenciosamente; eles formam a base da validação de staging.
7. **RC-1 Congelado**: O baseline não deve sofrer mutação para acomodar bad data (bad data deve ser tratado na alfândega/Staging).

## Ambiente de Ativação Controlada
- **Tenants Piloto**: Apenas empresas selecionadas para teste beta/shadow.
- **Empresas Sandbox**: Utilizadas para ingestão de lotes com dirty data intencional para estressar a alfândega.
- **Dados Reais Limitados**: O volume inicial será contido para avaliar a performance e o peso dos cálculos.
- **Usuários Controlados**: Apenas usuários com role `system_admin` ou `data_auditor` atuando no staging inicial.
- **Feature Flags**: Liberação progressiva da UI de promoção de dados para o Runtime (Aprovação Manual requerida).

## Fluxo de Onboarding Real (Pipeline)
1. **Upload Seguro**: Recebimento de arquivos/integrações isolado do Runtime.
2. **Staging Layer**: Inserção em tabelas/collections de staging (promotedToRuntime = false).
3. **Validação**: Execução do `StagingValidationEngine` contra a `ValidationPolicy` pertinente.
4. **Normalização**: Mapeamento de rubricas reais para os Chart of Accounts (COA) do Illumine.
5. **Lineage**: Marcação de proveniência (hash, data de upload, usuário, ferramenta).
6. **Aprovação**: Auditoria visual na UI (ImportTransactionsModal / Staging Dashboard).
7. **Ingestão (Promoção)**: Transição via `ImportPublicationEngine` para o banco de dados oficial do Runtime.
8. **Rollback**: Remoção lógica ou física do lote caso detectado um falso positivo na ingestão.
