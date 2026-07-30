# DATA_LINEAGE_FRAMEWORK.md — Data Lineage Governance Framework

> **Estrutura de Rastreabilidade Fiduciária End-to-End de Dados (ADR-079)**  
> *Autoridade Supreme: Architecture Review Board (ARB)*  
> *Alinhado à [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md) e ADR-079*

---

## 1. Fluxo de Rastreabilidade Canônico (`DataLineageTrace`)

Toda recomendação ou insight gerado no Executive Workspace deve obrigatoriamente expor sua trilha de origem fiduciária:

```
Data Source (ex: ERP Conta Bancária / Balancete)
     │
     ▼
Transformation (Normalização Contábil & Agregação Semântica)
     │
     ▼
Business Metric (ex: Margem EBITDA, Liquidez Corrente, FCO)
     │
     ▼
Executive Insight (ex: Compressão Operacional de -6.9 p.p.)
     │
     ▼
Executive Recommendation (ex: Reestruturação Contratual)
```

---

## 2. Garantias do Framework

1. **Inviolabilidade**: Nenhum valor pode existir sem o ID da fonte de origem e a data da carga.
2. **Auditabilidade**: Rastreabilidade auditável até o registro ou demonstrativo contábil individual.
