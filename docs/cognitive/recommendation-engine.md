# AGFP-0035 — Recommendation Engine (RE)

**RFC: Motor de Inferência e Recomendações Arquiteturais e de Negócio (v17.0)**

---

## 1. Contexto & Objetivo
O **Recommendation Engine (RE)** analisa métricas (AHS, GCI, Runtime, Knowledge Graph, Capabilities, Policies e Performance) para emitir recomendações ordenadas com nível de confiança (*Confidence Score*).

---

## 2. Exemplo de Saída do Motor de Recomendação

```json
{
  "recommendationId": "REC_EFA_MIGRATION_CLIENTS",
  "target": "ClientsPage.tsx",
  "type": "ARCHITECTURAL_REFRACTORING",
  "confidenceScore": 0.98,
  "rationale": "Arquivo ultrapassa 3.100 linhas (View Limit: 500). Migração para EFA MasterDetailLayout recomendada.",
  "expectedImpact": { "ahsIncrease": +18.5, "gciIncrease": +12.0 }
}
```
