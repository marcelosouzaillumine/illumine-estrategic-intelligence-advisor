# Secure AI Design Rules™

Codificação prática dos Principles and Patterns da Illumine OS™.

## Regra 1: Injeção de Contexto
Nenhuma classe, função ou módulo cognitivo pode instanciar um `TenantIsolationContext`. Ele deve ser obrigatoriamente injetado pela camada superior (`Authentication/Authorization Layer`).

## Regra 2: Proibição de Bypass Vetorial
Qualquer acesso a banco de dados de vetores ou embeddings deve herdar e repassar o `tenantId` no objeto de metadata de filtro. É estritamente proibido realizar queries abertas.

## Regra 3: Tratamento de Alucinação Cross-Tenant
Se a saída de um modelo generativo contiver informações que pertençam logicamente a outro tenant (detectado via Pattern Matching ou Contamination Detector), a resposta deve ser aniquilada e um Security Event emitido. Não é permitido mascarar ou censurar o dado; a operação deve falhar.

## Regra 4: Criptografia da Memória Base
Memórias persistentes utilizadas em RAG não devem apenas ser marcadas com um ID, mas idealmente isoladas lógicamente, garantindo que exploits de "Prompt Injection" não possam pedir dados que o motor de Retrieval não esteja autorizado a carregar no prompt.
