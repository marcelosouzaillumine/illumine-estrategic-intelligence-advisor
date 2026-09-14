# Programa de Transformação Arquitetural 2026 — Illumine Governance™

**Documento Operacional de Execução (Governado pela ARCHITECTURE_CONSTITUTION.md v5.0)**

---

## 🎯 Objetivos da Transformação 2026

1. Migração 100% canônica da camada visual (`src/components/ui/`).
2. Eliminação/redirecionamento de rotas e visões duplicadas pós-classificação.
3. Desacoplamento da camada de dados para consumir o SSOT (`useAnnualFinancialData` / `FiduciaryRuntimeAdapter`).

---

## 📊 Baseline v5.0 & Metas de KPIs Operacionais

| Indicador (KPI) | Baseline v5.0 | Meta Final | Artefato de Histórico |
| :--- | :---: | :---: | :--- |
| **Imports de `src/components/Common.tsx`** | 74 | **0** | `docs/architecture/baseline/v5.0.json` |
| **Páginas 100% Canônicas (EAA)** | 32% | **100%** | `docs/architecture/baseline/v5.0.json` |
| **Imports diretos de Firestore em Pages** | 137 | **0** | `docs/architecture/baseline/v5.0.json` |
| **Contrato de ViewModels em Conformidade** | **214/214 (100%)** | **214/214 (100%)** | `docs/architecture/baseline/v5.0.json` |

---

## 🗓️ Roadmap de Fases Operacionais

### FASE 0 — Classificação Arquitetural & Inventário Institucional
- Inventory cataloging completed.
- Status: **Concluído**.

---

### FASE 1 — Convergência do Design System Visual (Execução Imediata)
Migração atômica, página por página:

1. [MODIFY] [PayablesPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/PayablesPage.tsx)
2. [MODIFY] [ReceivablesPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/ReceivablesPage.tsx)
3. [MODIFY] [EFOSPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/EFOSPage.tsx)
4. [MODIFY] [MarketingComercialPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/MarketingComercialPage.tsx)
5. [MODIFY] [PlanoDeContasPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/PlanoDeContasPage.tsx)
6. [MODIFY] [TaxReformImpactPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/TaxReformImpactPage.tsx)
7. [MODIFY] [ViabilityPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/src/components/pages/ViabilityPage.tsx)

- **Exit Criteria**: 100% das páginas previstas migradas sem estados híbridos; redução de imports de `Common.tsx`; 0 regressões; Gates 100% verdes.

---

### FASE 2 — Matriz de Decisão Arquitetural & Resolução de Visões Concorrentes
- Matriz: `| Página | Engine | Persistência | ViewModel | Evidência Técnica | Decisão Final |`.

---

### FASE 3 — Consolidação do SSOT, Motores e Adaptadores
- Sequência: `Pipeline (SSOT) → Normalizador → Motores → Adapters → Pages`.

---

### FASE 4 — Enforcement & Guardrails Automatizados
- Ativação de bloqueio estrito no CI/CD.

---

### FASE 5 — Observabilidade, KPIs & Níveis de Certificação
- Auditoria final e emissão da Certificação de Arquitetura.
