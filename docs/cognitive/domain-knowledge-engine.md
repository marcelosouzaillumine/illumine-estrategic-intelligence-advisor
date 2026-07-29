# AGFP-0030 — Domain Knowledge Engine (DKE)

**RFC: Motor de Conhecimento de Domínio de Negócio e Ontologias Corporativas (v17.0)**

---

## 1. Contexto & Objetivo
O **Domain Knowledge Engine (DKE)** permite que a plataforma compreenda o domínio de negócio de qualquer organização (setores, entidades, bounded contexts, eventos, regras e riscos), conectando a ontologia corporativa ao Grafo de Conhecimento AKG.

---

## 2. Modelo de Dados Ontológico (DKE Schema)

```json
{
  "$schema": "https://illumine.os/schemas/v17/dke-ontology.json",
  "domainId": "FinancialGovernance",
  "boundedContext": "IntercompanyTreasury",
  "entities": ["Holding", "OperationalSubsidiary", "SPE"],
  "aggregates": ["TreasuryPool"],
  "businessRules": [
    {
      "id": "RULE_TREASURY_PARASITISM",
      "condition": "subsidiaryDebtToHolding > 0.40",
      "severity": "CRITICAL",
      "riskType": "TREASURY_CONTAMINATION"
    }
  ]
}
```

---

## 3. Fluxo de Ingestão e Inferência DKE

```text
  [Ontology Definition (YAML)] ➔ [DKE Parser & Validator] ➔ [Domain Graph (Neo4j)] ➔ [Recommendation Engine]
```
