# AGFP-0017 — AGF Capability Maturity Model (AGF-CMM)

**RFC: Modelo de Maturidade para Governança Arquitetural Corporativa baseada em CMMI, TOGAF e ISO 42010**

---

## 1. Níveis de Maturidade AGF-CMM

| Nível de Maturidade | Nome do Nível | Característica Principal | Ferramentas & Automação |
| :--- | :--- | :--- | :--- |
| **AGF-1** | **Inicial** | Arquitetura ad-hoc, despadronização visual e presença de monólitos. | Linters básicos |
| **AGF-2** | **Gerenciado** | Constituição EVC/EAC em vigor, uso de `ExecutivePageTemplate` e `PageHeader`. | CI Typecheck & AST Static Audit |
| **AGF-3** | **Definido** | Matriz EAA/EFA consolidada, padronização MVVM ($\le 500$ linhas) e AHS $> 80$. | Staged Architecture Pipeline (Stages 1-6) |
| **AGF-4** | **Medido** | AKG navegável, métricas de resultado (Lead Time, Reuso), Certificação L4 por evidências. | Neo4j AKG + Signed Evidence Bundles |
| **AGF-5** | **Otimizado** | Governança preditiva, auto-refatoração por IA e GCI $> 95$ contínuo. | AI Architecture Auditor + Auto-fixers |

---

## 2. Roadmap de Evolução AGF-CMM da Plataforma Illumine OS™
- **Sprint Atual**: Atingimento do Nível **AGF-3 (Definido)** com a consolidação da versão v14.0.
- **Próximo Marco**: Transição para o Nível **AGF-4 (Medido)** com a implementação completa do Grafo AKG e Certificação L4 Automatizada.
