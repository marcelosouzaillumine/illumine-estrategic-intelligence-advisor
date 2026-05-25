# Real Data Onboarding Checklist

Este checklist cobre as validações obrigatórias para aceitar conjuntos de dados contábeis reais de clientes no ambiente controlado (Piloto).

## A. Ingestão e Processamento
- [ ] Validação do **BP (Balanço Patrimonial)** real.
- [ ] Validação da **DRE (Demonstração de Resultados)** real.
- [ ] Validação de **Fluxo de Caixa / Tesouraria** real.
- [ ] Teste de **Consolidação Multi-Entidade** (Holding + 2+ Filiais).
- [ ] Teste de Mútuos e **Intercompany Elimination**.

## B. Validação das Inteligências
- [ ] **Temporal Causality Engine:** Consegue extrair insights temporais de um DRE real sem crashar (lidando com nulos ou zero-revenue).
- [ ] **Scenario Intelligence:** Simulador capaz de estressar o BP recém-criado sem dependências locais na UI.
- [ ] **Stress Propagation:** Detecção de falência / asfixia se os dados reais vierem de empresas insolventes.

## C. Telemetria e Segurança
- [ ] **Observability Layer:** Todos os warnings (ex: "EBITDA artificial devido a mútuo") devem aparecer via `runtimeMetadata.warnings`.
- [ ] **Governance Audit Intacto:** Nenhuma regra fiduciária pode ser violada pela carga de dados reais.

## D. Protocolo de Rollback
- [ ] **Rollback de Tenant:** Capacidade de deletar/limpar o workspace do cliente em 1-click.
- [ ] **Rollback de Dataset:** Capacidade de arquivar ou invalidar o último payload contábil inserido (volta ao mês anterior).
- [ ] **Rollback de Cenário:** Simulador limpa cache projetado.
- [ ] **Rollback Snapshot:** Reversão do *Master Executive Report* para versão "Before Impact".
