# Institutional Knowledge Graph Audit

**Data:** 2026-06-09T16:06:52.634Z

## Mapeamento de Nós e Relações (Estado Atual)

O `InstitutionalGraphRegistry` opera puramente em memória (In-Memory) para homologar a tipologia cognitiva institucional, atuando como um *Digital Twin* causal. 

### Tipos Existentes e Classificação
| Categoria | Tipos de Nós Suportados | Tipos de Relação Suportados |
|---|---|---|
| Causalidade | DRIVER, RISK, OPPORTUNITY | CAUSES, INFLUENCES, GENERATED_BY |
| Prova Fiduciária | EVIDENCE, INDICATOR | SUPPORTS, DERIVED_FROM |
| Executiva | DECISION, RECOMMENDATION, SCENARIO | DEPENDS_ON |
| Normativa | CONSTITUTIONAL_RULE | BLOCKS, MITIGATES, AGGRAVATES |

### Cobertura Mapeada por Engine
Nenhuma inteligência do *Runtime* foi afetada. As engines apenas fornecerão subprodutos para os Adapters (`TraceToNodeAdapter` e `TraceToRelationshipAdapter`) transformarem em arestas cognitivas. Todas as principais *engines* já possuem viabilidade para a injeção passiva de *Knowledge Nodes*.
