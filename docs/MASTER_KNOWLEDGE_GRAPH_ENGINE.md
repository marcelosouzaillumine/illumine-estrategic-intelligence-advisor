# MASTER KNOWLEDGE GRAPH ENGINE

Este documento estipula a arquitetura da camada de **Institutional Knowledge Graph & Semantic Intelligence**, responsável por transformar a Illumine em uma **Institutional Cognitive Intelligence Infrastructure**. O Knowledge Graph é o "cérebro relacional" da plataforma, ligando dados financeiros, governança e workflows através de uma malha semântica restrita.

## Princípios Fiduciários do Grafo

1. **Read-Only / Append-Only Relacional**: O grafo não altera a matemática financeira (`Runtime Engine`) nem os `Advisories` e `Confidences`. Ele apenas correlaciona fatos institucionais consolidados e os registra.
2. **Lineage Obrigatório**: Nenhuma aresta (`edge`) é criada sem um rastreamento rigoroso de sua origem. O `SemanticLineageEngine` gera o `lineageHash` provando a proveniência fiduciária daquele relacionamento.
3. **Strict Tenancy Guard**: A `KnowledgeGraphGovernanceEngine` blinda travessias (traversals) de dados. É matematicamente impossível para uma query (ex: *GraphQueryEngine*) acessar acidentalmente um nó pertencente a um `tenantId` alheio.
4. **Isolamento de UI**: A View Layer (React) não calcula correlações nem constrói grafos de forma autônoma. O cliente apenas faz despachos governados (`executeQuery()`) e renderiza outputs passivos, como o `SemanticRelationshipPanel`.

## Ontologia Institucional (`InstitutionalOntologyRegistry`)
A ontologia padroniza os conceitos dentro da rede. Relacionamentos devem possuir restrições lógicas mapeadas pelo `EntityRelationshipMapper`:
- `ALERT` -> `TRIGGERED` -> `WORKFLOW`
- `WORKFLOW` -> `GENERATED` -> `DECISION`
- `DECISION` -> `APPROVED_BY` -> `USER`
- `GOVERNANCE_VIOLATION` -> `CAUSED` -> `SYSTEMIC_RISK`

## Motores Cognitivos Secundários
- **`RiskCorrelationEngine`**: Procura padrões nos grafos (ex: Alertas de Asfixia frequentemente causando Violações de Covenants).
- **`WorkflowPatternAnalyzer`**: Extrai insights comportamentais de aprovações institucionais.
- **`GovernanceRelationshipGraph`**: Foca em auditar a trilha humana ("quem aprovou o quê").

## Auditoria Ativa (`runKnowledgeGraphGovernanceAudit.ts`)
Para garantir compliance, todo artefato commitado passa pela auditoria estática do Knowledge Graph. Ela varre as telas do React procurando bibliotecas não autorizadas, lógicas destrutivas de arestas, ou tentativas de bypassar as amarras de _Tenant Isolation_. Somente quando o status for **COMPLIANT**, a inteligência semântica é considerada governada e segura.
