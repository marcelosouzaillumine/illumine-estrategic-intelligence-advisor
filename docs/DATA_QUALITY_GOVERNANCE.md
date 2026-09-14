# DATA_QUALITY_GOVERNANCE.md — Data Quality & Governance Framework

> **Estrutura de Monitoramento de Qualidade Operacional de Dados**  
> *Autoridade Supreme: Architecture Review Board (ARB)*  
> *Alinhado à [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/ARCHITECTURE_CONSTITUTION.md) e ADR-077*

---

## 1. Métricas de Qualidade de Dados (`DataQualityReport`)

A saúde operacional dos dados alimentadores é auditada continuamente no **Platform Workspace** com base em 5 dimensões:

1. **Cobertura de Dados**: Percentual das contas contábeis e métricas operacionais mapeadas.
2. **Inconsistências**: Quantidade de conflitos ou discrepâncias entre fontes distintas.
3. **Freshness (Atualização)**: Idade dos dados em relação ao último fechamento fiscal.
4. **Confiabilidade**: Nível de confiança calculado ($\ge 95.0\%$).
5. **Completude**: Ausência de campos nulos em registros obrigatórios.
