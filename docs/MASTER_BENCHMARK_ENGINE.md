# MASTER BENCHMARK ENGINE

Este documento estipula a arquitetura da camada de **Institutional Benchmarking & Governance Network**, responsável por prover métricas comparativas na plataforma Illumine. A premissa central é o princípio de **Privacy-Preserving Governance**: o valor fiduciário de uma comparação de mercado nunca pode justificar o sacrifício do anonimato de um Tenant.

## Arquitetura de Privacidade (K-Anonymity)

Nenhuma query atravessa a engine sem passar pelo `BenchmarkPrivacyGuard`. 
- Se a amostra solicitada tiver um número de entidades menor que `MIN_COHORT_SIZE` (k-anonymity simulado para `k=5` no MVP), a engine não filtra os dados — ela sofre um "Curto Circuito de Privacidade" e emite um `BLOCKED_BY_PRIVACY`.

## A Esteira de Dados Anonimizados

1. **`BenchmarkDatasetBuilder`**: Busca a massa de dados do *Runtime* institucionalizado (em modo MVP, gera um Dataset sintético contendo dezenas de `profiles`). Nunca trafega `tenantId`.
2. **`BenchmarkAnonymizationEngine`**: Intercepta os profiles e converte faturamentos brutos em Bandas (Ex: `$120M` -> `TIER_3_100M_500M`), removendo toda rastreabilidade nominal.
3. **`BenchmarkCohortBuilder`**: Cruza a query do usuário com o Dataset higienizado para criar a `Cohort`.
4. **`InstitutionalBenchmarkEngine`**: Se a Cohort sobreviver ao `PrivacyGuard`, essa engine computa P25, Mediana (P50), P75 e a distribuição de risco/confidence daquela fatia.
5. **`BenchmarkLineageBinder`**: Atrela a execução a um Hash inquebrável, garantindo que o gráfico visto pelo Conselho Diretivo na reunião X foi gerado pelas regras de governança Y sem manipulações.

## Governança da UI

A View Layer (`InstitutionalBenchmarkingPage`) não consolida os dados; ela apenas os pinta. É expressamente proibido pela suite *Active Governance*:
- Trafegar variáveis com nomes `tenantId` nos componentes de benchmark.
- Chamar métodos como `.reduce` ou algoritmos estatísticos nativos (o que denotaria quebra do fluxo da *Engine*).
- Ocultar a proteção fiduciária (o *PrivacyProtectionBadge* é ostensivo).
