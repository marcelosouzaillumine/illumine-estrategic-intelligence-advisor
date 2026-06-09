# Institutional Observability Model

Este documento define a fundação estrita de rastreabilidade institucional da plataforma Illumine Governance™.
Cada decisão executiva deve contar sua própria história causal (Lineage + Decision Chain).

## Componentes da Estrutura de Trace

### 1. `CorrelationContext`
Rastreia a solicitação em todo o ciclo de vida.
- `correlationId`: ID primário (Root ID).
- `tenantId`, `userId`, `role`: Fronteiras institucionais.

### 2. `RuntimeLineage`
Rastreia a procedência (provenance) dos inputs utilizados.
- `lineageId`: ID do pacote de dados (ex: importação de banco, premissa digitada).
- `sourceType`: `USER_INPUT`, `SYSTEM_GENERATED`, `EXTERNAL_INTEGRATION`.

### 3. `DecisionChain`
Rastreia as bifurcações de engines.
- `decisionChainId`: O encadeamento de transformações.
- `engineId`: O ator do processamento (ex: ESGIM, Scenario).

### 4. `InstitutionalTrace`
O objeto unificador que encapsula os contextos de correlação, execução e linhagem para anexar no relatório final.

## O Evento: `InstitutionalAuditEvent`
Todos os saltos lógicos são gravados sob um contrato fiduciário de evento contendo:
- Metadados (`severity`, `timestamp`)
- Origem (`tenantId`, `userId`)
- Rastreio (`correlationId`, `lineageId`, `decisionChainId`)
- Motor (`engineId`, `runtimeAuthority`)
