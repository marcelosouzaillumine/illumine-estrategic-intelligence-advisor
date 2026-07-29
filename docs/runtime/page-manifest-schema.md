# AGFP-0019 — Page Manifest Schema (PMS)

**RFC: Contrato Declarativo de Páginas Sem Código Manual (v15.0)**

---

## 1. Contexto & Objetivo
O **Page Manifest Schema (PMS)** define a estrutura declarativa completa de uma página. Nenhuma página em react/tsx é escrita do zero; a tela inteira é gerada a partir de um arquivo `.page.manifest.yml`.

---

## 2. Exemplo de Manifesto Canônico PMS (`.page.manifest.yml`)

```yaml
# consolidated-executive.page.manifest.yml
$schema: "https://illumine.os/schemas/v15/pms.json"
manifestVersion: "15.0.0"
page:
  id: "consolidated_executive"
  route: "/dashboard/consolidated_executive"
  titleKey: "navigation.page.consolidated_executive"
  architecture: "EAA" # Executive Analytical Architecture
  audience: "Board"
  header:
    icon: "Globe"
    title: "Inteligência Consolidada do Grupo Econômico"
    description: "Consolidação patrimonial intercompany, dependências estruturais e propagação de risco sistêmico."
    badgeStatus: "Verde"
    actions:
      - type: "ConfidenceBadge"
        source: "report.finalConfidence"
  sections:
    - id: "executive_summary"
      type: "ExecutiveSummarySection"
      order: 1
      props:
        title: "Síntese Fiduciária do Grupo"
    - id: "alerts_and_risks"
      type: "AnalyticalGrid"
      order: 2
      layout: "grid-cols-1 lg:grid-cols-2 gap-8"
      widgets:
        - component: "StrategicGroupAlertsPanel"
        - component: "SystemicRisksPanel"
    - id: "dependency_and_causality"
      type: "AnalyticalGrid"
      order: 3
      layout: "grid-cols-1 lg:grid-cols-2 gap-8"
      widgets:
        - component: "IntercompanyDependencyMap"
        - component: "RiskPropagationPanel"
    - id: "role_interpretation"
      type: "ExecutiveAccordion"
      order: 4
      title: "Matriz de Papéis Institucionais Inferidos"
      isSecondary: true
      widgets:
        - component: "EntityRoleInterpretationTable"
    - id: "lineage_and_audit"
      type: "ExecutiveAccordion"
      order: 5
      title: "Lineage Contábil & Rastreabilidade de Origem"
      isSecondary: true
      widgets:
        - component: "ConsolidatedLineagePanel"
        - component: "GovernanceViolationsPanel"
```

---

## 3. JSON Schema do PMS

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PageManifestSchema",
  "type": "object",
  "required": ["manifestVersion", "page"],
  "properties": {
    "manifestVersion": { "type": "string" },
    "page": {
      "type": "object",
      "required": ["id", "route", "architecture", "sections"],
      "properties": {
        "id": { "type": "string" },
        "route": { "type": "string" },
        "architecture": { "type": "string", "enum": ["EAA", "EFA"] },
        "header": { "type": "object" },
        "sections": { "type": "array" }
      }
    }
  }
}
```
