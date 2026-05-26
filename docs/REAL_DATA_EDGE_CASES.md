# REAL_DATA_EDGE_CASES

Este documento lista casos extremos esperados durante o Onboarding de Dados Reais e como a Plataforma Illumine os tratará.

## 1. Dados Incompletos (Incomplete Datasets)
- **Cenário**: O ERP envia DRE e BP, mas omite informações de fluxo de caixa (DFC).
- **Tratamento**: A plataforma deve escalar para *Degraded Mode*. Warnings são gerados no Staging. A DFC não será inferida estocasticamente. O `RuntimeConfidence` do período cai de `GOLDEN` para `PARTIAL`.

## 2. Inconsistência de Sinais Contábeis
- **Cenário**: O usuário sobe balancetes onde contas redutoras (ex: Depreciação Acumulada, Custos) vêm ora positivas, ora negativas, dependendo do sistema fonte.
- **Tratamento**: O StagingValidationEngine detectará inconsistência se a soma não bater o total da categoria pai. Exigirá aprovação manual explícita para forçar a normalização dos sinais ou um re-mapeamento.

## 3. Desbalanceamento do Balanço Patrimonial (BP Math)
- **Cenário**: Ativo difere de Passivo + PL.
- **Tratamento**: O `bpConsistency` check falhará no Staging. Um `blockingRule` deve impedir a promoção se a diferença for maior que a *tolerance* da `ValidationPolicy`. Erros de arredondamento de centavos (dentro da tolerance) disparam *Warning* não bloqueante.

## 4. Contas Órfãs e Duplicadas (Unmapped or Duplicated Accounts)
- **Cenário**: Duas filiais consolidadas reportam a mesma rubrica com strings ligeiramente diferentes, ou contas transacionais (Pagar/Receber) aparecem sem contraparte identificável.
- **Tratamento**: O `ValidationEngine` levantará a flag `UNMAPPED_TRANSACTION_ACCOUNT` ou `MISSING_COUNTERPARTY`. Na UI do Staging, essas rubricas devem ser exibidas em destaque para mapeamento manual de reconciliação.

## 5. Transações Extrapoladas ou Vazias
- **Cenário**: Transações financeiras com valor zero, data inválida ou datas de vencimento absurdas.
- **Tratamento**: Warnings transacionais diretos: `INVALID_TRANSACTION_AMOUNT`, `INVALID_TRANSACTION_DATE`, `MISSING_DUE_DATE`.
