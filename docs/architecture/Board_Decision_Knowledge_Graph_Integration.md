# Board Decision Knowledge Graph Integration

## Relatório de Integração Passiva

A terceira carga cognitiva no `Institutional Knowledge Graph v1.0` integrou a camada final da Governança Executiva: o **Board Decision Engine**.
Aqui, premissas (Cenários) e bloqueios (Constitucionais) se consolidam em Diretrizes Fiduciárias e Planos de Ação, transformados agora em Grafos.

### Nós e Relações Estabelecidas
1. **DECISION Node**: Representa as `Top 3 Board Decisions`.
2. **RECOMMENDATION Node**: Representa as `Top 5 Executive Actions`.
   - Relação: `RECOMMENDATION SUPPORTS DECISION`
3. **RISK Node**: Extraído do Risco Dominante projetado pela Tese.
   - Relação: `RISK INFLUENCES DECISION`
4. **STRATEGIC_OBJECTIVE Node**: O Vetor Estratégico principal ditado ao Conselho.
   - Relação: `DECISION INFLUENCES STRATEGIC_OBJECTIVE`
5. **CONSTITUTIONAL_RULE Node**: Herdado de bloqueios ou `Governance Locks` do Report.
   - Relação: `CONSTITUTIONAL_RULE BLOCKS DECISION`

### Consultas Suportadas
O `InstitutionalGraphQueryEngine` agora possui malha suficiente para fechar a trilha do Board:
- `Quais riscos influenciaram esta decisão?` -> Busca por arestas `INFLUENCES` apontando para o `DECISION`.
- `Quais regras bloquearam esta decisão?` -> Filtra arestas `BLOCKS` para este `DECISION`.
- `Quais objetivos estratégicos são impactados?` -> Rastreia a jusante de `DECISION` para `STRATEGIC_OBJECTIVE`.
- `Quais recomendações suportaram esta decisão?` -> Encontra os nós tipo `RECOMMENDATION` com `SUPPORTS`.

A arquitetura de Inteligência de Conselho passa a ser totalmente auditável via travessia de nós (Graph Traversal).
