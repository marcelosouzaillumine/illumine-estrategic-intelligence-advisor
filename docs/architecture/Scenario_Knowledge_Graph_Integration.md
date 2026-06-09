# Scenario Knowledge Graph Integration

## Relatório de Integração Passiva

A primeira carga cognitiva no `Institutional Knowledge Graph v1.0` foi acoplada ao domínio **Scenario Runtime**. 

### Nós e Relações Estabelecidas
1. **SCENARIO Node**: Representa o objeto do teste de stress (`result.scenarioId`).
2. **DRIVER Node**: Representa as premissas (choques) aplicados (ex: `REVENUE_DROP`).
   - Relação: `SCENARIO DEPENDS_ON DRIVER`
3. **RISK Node**: Representa as `keyVulnerabilities` expostas pela simulação.
   - Relação: `SCENARIO GENERATES RISK`
4. **INDICATOR Node**: Representa o impacto consolidado (ex: `groupSolvencyStatus`).
   - Relação: `SCENARIO INFLUENCES INDICATOR`

### Consultas Suportadas (Query Engine)
O `InstitutionalGraphQueryEngine` agora é capaz de processar as seguintes consultas de forma determinística:
- `findDependencies(scenarioNodeId)` -> Retorna os `DRIVER`s exatos (choques) que estruturaram o teste.
- `findConnectedRisks(scenarioNodeId)` -> Retorna as vulnerabilidades institucionais geradas.
- `findRelationships(scenarioNodeId)` -> Traz a árvore completa de impacto fiduciário.

### Próximos Domínios Recomendados
Conforme o roteiro estratégico estabelecido, o próximo domínio a receber *Nodes* e *Relationships* será o **Constitutional Runtime**, que gerará nós de `CONSTITUTIONAL_RULE` interligados com `BLOCKS`, fortalecendo o caráter de defesa executiva.
