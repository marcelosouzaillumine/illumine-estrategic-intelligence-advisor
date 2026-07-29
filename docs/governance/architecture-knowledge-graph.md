# AGFP-0014 — Architecture Knowledge Graph (AKG)

**RFC: Ecossistema de Grafo de Conhecimento Arquitetural da Plataforma**

---

## 1. Contexto & Objetivo
Transformar todo o framework AGF em um **grafo navegável de conhecimento**. O AKG indexa automaticamente e relaciona em tempo de build:
- Componentes, Páginas, Layouts, Tokens, Primitivas
- Regras `MUST` e `SHOULD`
- Certificações L4, Exceções Arquiteturais (`AE`)
- Propostas (`AGFP`) e Decisões (`ADR`)
- Builds, Releases e Dependências

---

## 2. Modelo de Dados (Grafo Neo4j / JSON Schema)

```text
  (Page) ──[:USES_LAYOUT]──> (EAA_Layout)
    │
    ├──[:USES_COMPONENT]──> (ExecutivePageTemplate) ──[:CONSUMES_TOKEN]──> (--color-card)
    │
    ├──[:GOVERNED_BY]──> (MUST_Rule_01) ──[:JUSTIFIED_BY]──> (ADR-0003)
    │
    └──[:HAS_CERTIFICATION]──> (L4_Manifest) ──[:PRODUCED_BY]──> (Build_532)
```

---

## 3. Esquema GraphQL (Interface de Consulta AKG)

```graphql
type ArchitectureNode {
  id: ID!
  type: NodeType! # PAGE, COMPONENT, LAYOUT, TOKEN, RULE, ADR, CERTIFICATION
  name: String!
  status: ComplianceStatus! # L0, L1, L2, L3, L4
  ahsScore: Float
  dependencies: [ArchitectureNode!]!
  governedByRules: [RuleNode!]!
  activeExceptions: [ExceptionNode!]!
}

type Query {
  pagesUsingComponent(componentName: String!): [ArchitectureNode!]!
  impactAnalysis(componentId: ID!): ImpactReport!
  nonCompliantPages(maxAHS: Float): [ArchitectureNode!]!
  adrForRule(ruleId: ID!): ADRNode
}
```

---

## 4. Exemplos de Consultas Enterprise (AKG Engine)

1. **Quais páginas usam `ExecutivePageTemplate`?**
   `query { pagesUsingComponent(componentName: "ExecutivePageTemplate") { name ahsScore } }`
2. **Quais páginas serão afetadas por uma mudança em `ExecutiveSurface`?**
   `query { impactAnalysis(componentId: "ExecutiveSurface") { affectedPages { name } breakingChangeRisk } }`
3. **Quais páginas possuem AHS inferior a 80?**
   `query { nonCompliantPages(maxAHS: 80.0) { name ahsScore activeExceptions { id } } }`
4. **Qual ADR justifica a regra `MUST` de proibir `bg-white`?**
   `query { adrForRule(ruleId: "MUST_NO_BG_WHITE") { id title decision author } }`
