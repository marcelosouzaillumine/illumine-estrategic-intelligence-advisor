# Architecture Evaluation Rule Catalog

Este catálogo define as regras de **Measurement (Medição)** da Illumine OS™. As regras abaixo orientam a coleta de fatos e a formatação de Findings, mas **não** emitem julgamento de valor, scores de risco ou ordens de bloqueio.

---

### AR-EVAL-001: Dependency Fan-Out Measurement
**Categoria:** DEPENDENCY
**Métrica:** fan-out
**Descrição:** Mede a quantidade absoluta de artefatos externos que um componente possui dependência direta.
**Fórmula:** `outgoing_edges_count`
**Threshold Indicativo:** 10 (Gera Finding, não falha)

### AR-EVAL-002: Dependency Fan-In Measurement
**Categoria:** DEPENDENCY
**Métrica:** fan-in
**Descrição:** Mede a quantidade absoluta de artefatos externos que dependem deste componente.
**Fórmula:** `incoming_edges_count`
**Threshold Indicativo:** N/A

### AR-EVAL-003: Betweenness Centrality Measurement
**Categoria:** DEPENDENCY
**Métrica:** betweenness_centrality
**Descrição:** Estima o fator ponte de um artefato na malha de relacionamento global.
**Fórmula:** `(paths crossing node) / total paths`
**Threshold Indicativo:** 0.5 (Gera Finding)

### AR-EVAL-004: Degree Centrality Measurement
**Categoria:** DEPENDENCY
**Métrica:** degree_centrality
**Descrição:** Conectividade total de um artefato (soma das arestas de entrada e saída).
**Fórmula:** `incoming_edges_count + outgoing_edges_count`

### AR-EVAL-005: Boundary External Connection Fact
**Categoria:** BOUNDARY
**Métrica:** external_connections
**Descrição:** Identifica conexões originadas dentro da capability que apontam para fora de sua boundary.
**Fórmula:** `count(edges where source in boundary AND target NOT in boundary)`
