# STAGING_VALIDATION_PROTOCOL

## Princípio Fundamental
Nenhum dado real entra no Runtime oficial sem passar pela camada Staging validada. O Staging Layer é a "alfândega" da plataforma Illumine.

## Ambiente Isolado (Staging Layer)
- **Staging Tenant**: Isolamento em nível de tenant ou marcador lógico específico de staging temporário.
- **Staging Dataset**: Todos os dados brutos recém-chegados, marcados com `promotedToRuntime = false`.
- **Staging Lineage**: Metadados de proveniência intocados e gerados no ato do upload.
- **Staging Runtime Mode**: Cálculos executados neste modo não impactam dashboards consolidados nem disparam relatórios executivos.

## Pipeline Completo de Validação
O pipeline deve seguir estritamente o fluxo unidirecional:
`Upload` → `Parsing` → `Normalização` → `Hierarquização` → `Mapping` → `Validation (Engine)` → `Confidence Check` → `Lineage Tagging` → `Aprovação UI` → `Runtime Input (Promotion)` → `Executive Report (Advisory)`.

## Itens Específicos de Validação (Validation Engine)
- [ ] O BP (Balanço Patrimonial) fecha corretamente (Ativo = Passivo + PL), com tolerância de centavos devidamente parametrizada e bloqueio para erros materiais.
- [ ] A DRE (Demonstração do Resultado) hierárquica soma corretamente de baixo para cima, não ocorrendo dupla contagem.
- [ ] O DFC (Fluxo de Caixa) reconcilia saldos de caixa inicial e final.
- [ ] Sinais contábeis: as lógicas de débito/crédito estão normalizadas (ex: custos e despesas entram com o sinal correto na soma do EBITDA).
- [ ] Contas sintéticas e analíticas não se misturam em agregações indevidas.
- [ ] Regimes de competência vs. caixa não conflitam na matriz do Staging.
- [ ] Multi-entidade: Eliminações intercompany não impactam erroneamente o balanço consolidado durante os testes simulados em Staging.
- [ ] Modo degradado (Degraded Modes): Se o BP falta, o sistema se adapta passivamente para operar sob *Income Statement Confidence Mode*, sem crashar.
