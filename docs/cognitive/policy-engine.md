# AGFP-0032 — Policy Engine (PE)

**RFC: Motor Corporativo de Avaliação de Políticas Organizacionais Executáveis (v17.0)**

---

## 1. Contexto & Objetivo
O **Policy Engine (PE)** transforma políticas organizacionais (LGPD, Compliance, SOX, ISO, Segregação de Funções, Limites Financeiros) em regras de avaliação executáveis em tempo real durante a execução da aplicação.

---

## 2. Exemplo de Política Executável (Policy DSL)

```json
{
  "policyId": "POL_SOX_404_SEGREGATION",
  "name": "Segregação de Funções - Aprovação de Mútuos Intercompany",
  "targetCapability": "corporate_treasury_management",
  "rules": [
    {
      "ruleId": "NO_SELF_APPROVAL",
      "condition": "creatorId == approverId",
      "action": "DENY_EXECUTION",
      "errorMessage": "Violação SOX 404: O criador do mútuo não pode ser o aprovador fiduciário."
    }
  ]
}
```
