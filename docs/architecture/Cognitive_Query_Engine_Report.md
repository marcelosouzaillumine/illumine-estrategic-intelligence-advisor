# Cognitive Query Engine Report

A camada determinística de travessia do *Institutional Knowledge Graph* foi implementada com sucesso.

### Consultas Suportadas (Determinísticas)
1. **findRootCauses(nodeId)**: Retrocede arestas (`CAUSES`, `INFLUENCES`) para encontrar as origens de um evento ou restrição.
2. **findImpactPath(nodeId)**: Avança na cadeia para entender o Efeito Dominó (`AGGRAVATES`, `BLOCKS`) de um choque até Decisões e Objetivos Estratégicos.
3. **traceEvidence(nodeId)**: Varre o grafo em busca da fundação empírica (`SUPPORTS`) atrelada a uma conclusão institucional.
4. **traceDecision(nodeId)**: Identifica todos os nós (riscos, axiomas, cenários) que participaram da matriz de aprovação de uma deliberação do conselho.
5. **findRiskCluster(nodeId)**: Mapeia zonas de concentração de risco bidirecionais.
6. **findCausalPath(A, B)**: Calcula via BFS o caminho determinístico inquestionável que conecta a causa A à consequência B.

### Limitações e Contenção Cognitiva
- O motor não possui interpretação semântica profunda (não usa *embeddings* nem LLMs).
- Se a aresta não foi registrada previamente pelas engines (ESGIM, Board, Scenario, Causality, Constitutional), o caminho não existe para o grafo.
- Ausência total de inferência probabilística ("alucinações").

A plataforma extrai respostas da realidade executiva validada do grafo.
