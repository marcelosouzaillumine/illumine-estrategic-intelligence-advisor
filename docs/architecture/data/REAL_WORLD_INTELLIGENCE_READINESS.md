# REAL_WORLD_INTELLIGENCE_READINESS.md — Prontidão para Integração de Dados Reais (Wave 17 Fase 7)

> **Manual de Integração com Sistemas Empresariais Externos (ADR-054)**

---

## 1. Mapeamento de Fontes de Dados Empresariais Reais

```
External Data Sources (ERP, CRM, BI, Docs, APIs, Planilhas, Bancos SQL)
                               │
                               ▼
              Enterprise Knowledge Fabric (@illumine/enterprise-knowledge-fabric)
                               │
                               ▼
              Intelligence Engines (12 Executive Agents)
                               │
                               ▼
              Executive Decision System (EDOS)
```

| Fonte Empresarial | Conector / Formato | Mapeamento no Knowledge Fabric | Frequência de Ingestão |
| :--- | :--- | :--- | :--- |
| **ERP (SAP, TOTVS)** | REST API / JDBC | `EnterpriseContext` (DRE, DFC, Balanço) | Diária / Horária |
| **CRM (Salesforce, Hubspot)** | GraphQL / Webhook | `CommercialContext` (Pipeline, Churn) | Tempo Real |
| **BI (PowerBI, Tableau)** | Datamart Export | `BusinessUnitContext` (KPIs Operacionais) | Diária |
| **Documentos / Atas** | PDF / OCR / Text | `DecisionRecord` (Decisões de Conselho) | Eventual |

---

## 2. Garantias de Qualidade e Governança na Ingestão

- **Sanitização Semântica**: Validação no `EnterpriseSemanticModel` antes de persistência.
- **Rastreabilidade por Linhagem**: Todo fato gera um `lineageHash` SHA-256 no `EvidenceBundle`.
