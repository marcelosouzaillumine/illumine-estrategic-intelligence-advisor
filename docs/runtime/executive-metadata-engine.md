# AGFP-0018 — Executive Metadata Engine (EME)

**RFC: Fonte Única de Verdade Declarativa da Plataforma Illumine OS™ (v15.0)**

---

## 1. Contexto & Objetivo
O **Executive Metadata Engine (EME)** é o motor central de metadados da plataforma. Ele elimina a necessidade de codificar manualmente tabelas, formulários, rotas e KPIs. Toda a estrutura corporativa é descrita através de esquemas declarativos imutáveis.

---

## 2. Modelo de Dados do EME (Entities, Fields, KPIs, Workflows, Permissions)

```yaml
# Example: entity-group-consolidation.metadata.yml
metadataVersion: "15.0.0"
entity:
  id: "economic_group_consolidation"
  name: "Consolidação de Grupo Econômico"
  domain: "FinancialGovernance"
  audience: "BoardAndCSuite"
  architecture: "EAA"
  ebilScope:
    brandingToken: "brand-primary"
    logoConstraint: "max-h-8"
  fields:
    - id: "holdingEntityId"
      labelKey: "entity.holding.id"
      type: "string"
      required: true
    - id: "intercompanyLoanVolume"
      labelKey: "entity.holding.intercompany_volume"
      type: "currency"
      format: "BRL"
  kpis:
    - id: "systemic_risk_index"
      label: "Índice de Risco Sistêmico"
      type: "score"
      formula: "SUM(intercompanyLoanVolume) / totalAssets"
      thresholds:
        healthy: "< 0.15"
        warning: "0.15 - 0.30"
        critical: "> 0.30"
  workflows:
    - id: "fiduciary_approval"
      trigger: "LOW_CONFIDENCE"
      actions: ["BLOCK_EMISSION", "NOTIFY_AUDIT_BOARD"]
  permissions:
    rolesAllowed: ["BOARD_MEMBER", "CFO", "LEAD_AUDITOR"]
```

---

## 3. Interfaces TypeScript do EME

```typescript
export interface EMEMetadataRegistry {
  metadataVersion: string;
  entity: EMEEntityDefinition;
  fields: EMEFieldDefinition[];
  kpis: EMEKPIDefinition[];
  workflows: EMEWorkflowDefinition[];
  permissions: EMEPermissionPolicy;
  ebilConfig: EMEEBILConfig;
}

export interface EMEEntityDefinition {
  id: string;
  name: string;
  domain: 'Financial' | 'Governance' | 'Operations';
  architecture: 'EAA' | 'EFA';
}
```

---

## 4. Diagrama ASCII de Fluxo do EME

```text
  [YAML / JSON Declarativo] ➔ [EME Parser & Schema Validator] ➔ [AST Metadata Engine]
                                                                        │
  [Runtime & Compiler] ◄── [SDK Metadata Registry] ◄── [Cached Immutable Graph]
```
