# Real Data Edge Cases

Este documento cataloga os *edge cases* reais observados na ingestão de dados contábeis e as heurísticas do *StagingValidationEngine* responsáveis por barrá-los.

## 1. BP Desbalanceado
**Problema**: A equação fundamental da contabilidade não fecha (Ativo ≠ Passivo + PL).
**Motivo Comum**: PDF quebrado onde o sistema não leu contas sintéticas, ou envio de uma DRE junto do BP sem zeramento de resultado.
**Warning**: `INVALID_BALANCE_SHEET`
**Tratativa**: Bloqueio. A *StagingValidationPolicy* permite um `MATERIALITY_THRESHOLD_EXCEEDED` (ex: desvios menores que 0.05% para erros de arredondamento cambial), acima disso, é rejeição imediata.

## 2. Quebra de Hierarquia (Hierarchy Break)
**Problema**: Contas analíticas não somam ao valor de sua conta sintética pai.
**Motivo Comum**: PDF com paginação irregular que cortou linhas.
**Warning**: `HIERARCHY_BREAK`
**Tratativa**: Bloqueio.

## 3. Conta Duplicada
**Problema**: Múltiplas contas com a mesma classificação DRE/BP no mesmo período.
**Warning**: `DUPLICATE_ACCOUNT`
**Tratativa**: Warning Severo / Degradação de Confiança (se não estourar materialidade).

## 4. Conta Órfã
**Problema**: Conta analítica lançada sem estrutura sintética mãe.
**Warning**: `ORPHAN_ACCOUNT`
**Tratativa**: Warning.

## 5. Inversão de Sinais (Sign Inversion)
**Problema**: Receita lançada como negativa (débito contábil) em sistemas que exportam como natureza devedora. Custo como positivo, etc.
**Motivo Comum**: Exportações cruas (TXT/CSV) do ERP que não aplicam sinal gerencial na DRE.
**Warning**: `SIGN_INVERSION`
**Tratativa**: A engine tentará inferir a natureza pela estrutura. Se não conseguir corrigir com 100% de precisão, marca como bloqueio.

## 6. Mismatch de Fluxo de Caixa (Cashflow Mismatch)
**Problema**: A soma de Caixa Inicial + Variação do Período (Ativ. Op + Invest + Fin) diverge do Caixa Final do período.
**Motivo Comum**: DFC incompleto ou desconsideração de variação cambial do caixa.
**Warning**: `CASHFLOW_MISMATCH`
**Tratativa**: Bloqueio de DFC. Impede o uso deste dataset no motor de simulação (que requer caixa consolidado real).

## 7. Mismatch de Versão de Política (Policy Mismatch)
**Problema**: O dataset foi validado com uma *StagingValidationPolicy* obsoleta ou nula.
**Warning**: `POLICY_VERSION_MISMATCH`
**Tratativa**: Bloqueio na publicação.

## 8. Outros Casos de Dataset Inválido
- **Arquivos Incompletos**: PDF faltando uma página do Passivo. Gera erro de BP desbalanceado.
- **Datas Inconsistentes**: Exportações que começam em Abril e acabam em Maio (mês quebrado) sem saldo inicial. Gera `INCOMPLETE_DATASET`.
