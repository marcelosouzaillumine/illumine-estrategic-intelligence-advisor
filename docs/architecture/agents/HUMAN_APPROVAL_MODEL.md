# HUMAN_APPROVAL_MODEL.md — Modelo de Governança Humana e Gateway de Aprovação

> **Documento de Governança Humana e Trava Fiduciária (Wave 15B)**

---

## 1. Níveis de Risco e Regras de Aprovação Humana

```
Recomendação Executiva Emitida
             │
   ┌─────────┴─────────┐
   │ Classificar Risco │
   └─────────┬─────────┘
             │
 ┌───────────┼───────────┐
 ▼           ▼           ▼
LOW       MEDIUM       HIGH
 │           │           │
(Informa) (Recomenda) (Exige Aprovação Humana Compulsória)
```

| Nível de Risco | Descrição | Ação da Plataforma | Exige Aprovação Humana? |
| :--- | :--- | :--- | :---: |
| **`LOW`** | Alertas operacionais, variação orçamentária irrelevante, lembretes de compliance. | Notifica o usuário no Dashboard. | Não |
| **`MEDIUM`** | Pareceres estratégicos, sugestões de realocação de despesas, otimização de estoque. | Submete parecer para avaliação da diretoria. | Opcional |
| **`HIGH`** | Reestruturações de dívida, M&A, alteração de apetite a risco, emissão de debêntures. | Bloqueia no estado `WAIT_HUMAN_APPROVAL` até assinar ata de deliberação. | **SIM (COMPULSÓRIO)** |
