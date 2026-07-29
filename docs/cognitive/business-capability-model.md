# AGFP-0031 — Business Capability Model (BCM)

**RFC: Mapeamento de Capacidades Corporativas da Empresa (v17.0)**

---

## 1. Contexto & Objetivo
O **Business Capability Model (BCM)** representa a organização através de um mapa de capacidades corporativas (Financeiro, Fiscal, Compras, CRM, RH, Governança, Compliance, Operações), vinculando cada capacidade a KPIs, workflows, entidades e permissões.

---

## 2. Mapa de Capacidades (BCM Map)

```yaml
capability:
  id: "corporate_treasury_management"
  name: "Gestão de Tesouraria Corporativa"
  domain: "FinancialGovernance"
  kpis: ["systemic_risk_index", "intercompany_loan_volume"]
  workflows: ["fiduciary_approval"]
  architecturePattern: "EAA"
  layoutPattern: "ConsolidatedLineagePanel"
  permissions: ["CFO", "BOARD_MEMBER"]
```
