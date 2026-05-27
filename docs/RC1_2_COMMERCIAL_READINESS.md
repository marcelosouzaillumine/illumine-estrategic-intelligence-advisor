# Commercial Readiness & Enterprise Operationalization (RC-1.2) 🏛️

Esta documentação define a arquitetura comercial, empacotamento corporativo, governança de inquilinos (Tenant Sovereignty), limites de cotas de processamento e regras éticas de assessores (Advisors) na plataforma Illumine.

---

## 1. Diretriz de Subordinação Governamental

Sob nenhuma circunstância regras de empacotamento comercial, tiers de faturamento ou marcas (white-label) podem flexibilizar ou atenuar a governança fiduciária institucional do runtime.

A hierarquia absoluta de precedência é:
1. **Runtime Compliance** (Regras Fiduciárias Estáticas)
2. **Tenant Sovereignty** (Isolamento de Dados)
3. **Disclosure Enforcement** (Exibição obrigatória de termos)
4. **Lineage Integrity** (Rastreabilidade criptográfica)
5. **Confidence Integrity** (Imutabilidade de estados de confiança)
6. **Violation Visibility** (Proibição de ocultação de riscos)
7. **Advisor Ethical Boundaries** (Anonimização de benchmarks)
8. **Commercial Plan Rules** (Cotas e limites comerciais)
9. **Branding / White-label** (Ajuste visual do cliente)
10. **UI Preferences** (Preferências de exibição)

---

## 2. Capability Matrix & Tiers

A plataforma opera sobre quatro planos comerciais com limitações fiduciárias rígidas:

| Plan | Base Price | Core Feature | Execution Limit | Topology Limit | Advisory Quota | Allowed Deployment Levels |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BASIC** | $2,000 | Fiduciary Core, Basic Indicators | 500ms | Depth 1 (Single) | 5 | SHARED_SAAS |
| **CORPORATE** | $8,000 | Multi-Entity Light, Board Experience | 2,000ms | Depth 3 | 30 | SHARED_SAAS, DEDICATED_TENANT |
| **ENTERPRISE**| $20,000| Consolidated Runtime, Guided Journeys | 10,000ms | Depth 10 | 200 | SHARED_SAAS, DEDICATED_TENANT, DEDICATED_INFRA |
| **ADVISOR** | $35,000| Multi-tenant switching, Ethical guardrails| 15,000ms | Depth 15 | 500 | SHARED_SAAS, DEDICATED_TENANT, DEDICATED_INFRA |

---

## 3. Advisor Operating Framework & Ethical Limits

O perfil **ADVISOR** permite a supervisão de múltiplos clientes preservando isolamento absoluto:

1. **Context Clean**: Ao chavear entre clientes (`switchTenantContext`), a memória local e dados de linhagem anteriores são imediatamente expurgados.
2. **Advisor Ethical Boundaries**:
   * **Anonymization Mandatory**: Qualquer comparação ou relatório consolidado de mercado deve anonimizar completamente a identificação das empresas inquilinas (`isAnonymized = true`).
   * **No Cross-Export**: É bloqueado o compartilhamento ou exportação de árvores causais e caminhos de linhagem reais entre bases concorrentes.

---

## 4. Quota Forensics & Usage Limits

O módulo [RuntimeUsageGovernance](file:///src/core/runtime/commercial-readiness/RuntimeUsageGovernance.ts) monitora em tempo de execução:
* **Execution Budget**: Limite total de tempo gasto por inquilino.
* **Topology Depth**: Limite na quantidade de níveis e entidades monitoradas.
* **Advisory Quotas**: Quantidade de playbooks gerados.

As ocorrências de consumo são arquivadas de forma auditável e assinada no [RuntimeQuotaAuditTrail](file:///src/core/runtime/commercial-readiness/RuntimeQuotaAuditTrail.ts), permitindo auditorias forenses contra tentativas de abuso de recursos ou bypass de plano.

---

## 5. White-Label Limitations

Clientes enterprise e holdings podem customizar a identidade visual de sua área exclusiva (logotipos, domínios e paletas de cores secundárias), mas são impedidos de:
* Remover ou mascarar o `RuntimeDisclosureBanner`.
* Ocultar violações ativas (`activeViolations`) de conformidade regulatória.
* Esconder avisos de integridade ou atenuar o estado real de confiança (`confidenceState`).
* Modificar ou omitir hashes de linhagem.
