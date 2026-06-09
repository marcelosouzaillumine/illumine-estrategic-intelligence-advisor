# Constitutional Knowledge Graph Integration

## Relatório de Integração Passiva

A segunda carga cognitiva no `Institutional Knowledge Graph v1.0` conectou a camada de poder normativo e vetos fiduciários: o **Constitutional Runtime**.

### Nós e Relações Estabelecidas
A lógica extraída do `ExecutiveConstitutionalRuntime` gerou a seguinte ontologia no grafo:
1. **DECISION Node**: O pedido de aprovação sendo julgado (usando `executionId`).
2. **CONSTITUTIONAL_RULE Node**:
   - Em caso de bloqueio: o `Axiom Violation` que acionou a quarentena fiduciária.
   - Em caso de aprovação: o selo de suporte da `Doctrine` atual.
   - Relações: `CONSTITUTIONAL_RULE BLOCKS DECISION` ou `CONSTITUTIONAL_RULE SUPPORTS DECISION`.
3. **EVENT Node**: Registra o acontecimento da violação no tempo e espaço do tenant.
   - Relação: `EVENT GENERATED_BY DECISION`.
4. **RISK Node**: Casos em que foram detectados conflitos constitucionais (`detectedConflicts`).
   - Relação: `RISK AGGRAVATES DECISION`.

### Consultas Suportadas
O `InstitutionalGraphQueryEngine` passa a decifrar a jurisprudência fiduciária da plataforma:
- `Quais axiomas bloquearam esta decisão?` -> `findDependencies` filtrando por `BLOCKS`.
- `Quais decisões foram bloqueadas por determinada regra?` -> `findRelationships` focando em nós `CONSTITUTIONAL_RULE`.
- `Quais riscos agravaram determinada violação?` -> Mapeamento reverso a partir de `EVENT` nodes em cruzamento com `RISK`.

A ponte entre *cenário simulado* (Sprint anterior) e *bloqueio institucional* (Esta sprint) passa a ser navegável.
