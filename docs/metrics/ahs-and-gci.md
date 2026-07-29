# AHS, Domain AHS, GCI & Outcome Metrics

**Sistema Integrado de Métricas de Engenharia e Governança do Illumine OS™**

---

## 1. Architectural Health Score (AHS) — Qualidade do Código
$$\text{AHS} = (0.25 \times \text{EVC}) + (0.25 \times \text{Componentes}) + (0.20 \times \text{EFA/EAA}) + (0.20 \times \text{MVVM}) + (0.10 \times \text{Perf})$$

---

## 2. Domain AHS — Saúde Arquitetural por Domínio
Mede o AHS consolidado por área funcional do sistema:
- **`DomainAHS_Financial`**: Demonstrativos contábeis (BP, DRE, DFC, DLPA). Target: $> 95.0$.
- **`DomainAHS_Governance`**: Conselho, Board Pack, AGF e Atas. Target: $> 95.0$.
- **`DomainAHS_Operations`**: Cadastros de clientes, parceiros, histórico. Target: $> 85.0$.

---

## 3. Governance Compliance Index (GCI) — Maturidade do Processo
$$\text{GCI} = (0.30 \times \% \text{ Páginas L4}) + (0.25 \times \text{Sem Exceções Vencidas}) + (0.20 \times \text{Cobertura Gates}) + (0.15 \times \text{Cobertura Testes}) + (0.10 \times \text{Aderência Pipeline})$$

---

## 4. Outcome Metrics — Impacto Concreto no Negócio
- **Lead Time de Entrega de Módulos**
- **Taxa de Regressões Pós-Release**
- **Reutilização Efetiva de Primitivas** ($\ge 85\%$)
- **Tempo Médio de Review Arquitetural**
