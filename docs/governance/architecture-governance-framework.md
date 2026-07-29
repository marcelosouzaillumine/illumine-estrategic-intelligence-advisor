# Illumine Architecture Governance Framework (AGF — v14.0 Evolution Pack)

O **Illumine AGF** é o ecossistema corporativo soberano de governança técnica, arquitetura de software e design system da plataforma Illumine OS™.

---

# Árvore Normativa Modular AGF (v14.0)

```text
docs/
├── constitution/
│   ├── executive-visual-constitution.md        # EVC: Regras Visuais, Tokens, Tipografia e Ícones
│   └── executive-architecture-constitution.md  # EAC: Regras de Software, MVVM e Limites de Código
├── governance/
│   ├── architecture-governance-framework.md    # AGF v14.0 Master Entrypoint
│   ├── architecture-knowledge-graph.md         # AGFP-0014: AKG Grafo de Conhecimento
│   ├── architecture-decision-records.md        # AGFP-0015: Sistema ADR de Decisões
│   ├── evidence-based-certification.md         # AGFP-0016: Certificação L4 baseada em Evidências
│   └── capability-maturity-model.md            # AGFP-0017: AGF-CMM Níveis de Maturidade
├── standards/
│   ├── eaa.md                                  # Executive Analytical Architecture
│   ├── efa.md                                  # Executive Functional Architecture
│   └── mvvm.md                                 # MVVM & Clean Code Standards
├── metrics/
│   └── ahs-and-gci.md                          # AHS, Domain AHS, GCI & Outcome Metrics
└── catalogs/
    └── catalogs-manifest.md                    # Primitivas, Layouts, Ref L4, Active AEs e Depreciados
```

---

# Organização da Governança AGF

- **Architecture Review Board (ARB)**: Comitê gestor do framework responsável por aprovações `MUST` e AGFPs.
- **AGFP (Architecture Governance Proposal)**: Propostas de melhoria contínua (ex.: AGFP-0014 a AGFP-0017).
- **ADR (Architecture Decision Records)**: Registro histórico de decisões de arquitetura e trade-offs.
- **AKG (Architecture Knowledge Graph)**: Grafo navegável de componentes, regras, páginas e dependências.
- **AGF-CMM**: Modelo de maturidade em 5 níveis (AGF-1 a AGF-5) baseado no CMMI e TOGAF.

---

# Versionamento & SemVer
- **Patch (v14.0.x)**: Compatível (docs, typings, testes).
- **Minor (v14.x.0)**: Compatível (novas primitivas, novas métricas, AGFPs).
- **Major (vX.0.0)**: Breaking Change (alteração em regra `MUST`, mudança de Layout Canônico).
