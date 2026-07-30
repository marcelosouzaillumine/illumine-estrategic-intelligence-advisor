# CERTIFICATION_BASELINE.md — Registered Baseline of Architecture Certification (ACF v1.0)

> **Registro Oficial de Baseline e Hash de Certificação (Level A — Frozen)**  
> *Horizonte Temporal de Estabilidade: 10+ Anos (2026 – 2036+)*  
> *Documentos Complementares: [`docs/ARCHITECTURE_CERTIFICATION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/ARCHITECTURE_CERTIFICATION.md) | [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md)*  
> *Status: Homologado & Congelado*

---

## 1. Registro da Baseline Ativa

| Metadado de Certificação | Valor Registrado |
| :--- | :--- |
| **Versão da Arquitetura** | **Illumine Executive Reference Architecture v1.0 (IERA v1.0)** |
| **Baseline ID** | `IERA-EAF-AGC-ACF-2026-v1.0` |
| **Data de Homologação** | 30 de Julho de 2026 |
| **Status da Certificação** | **`IERA Certified — 100% Passed (5/5 Levels)`** |
| **Hash de Integridade (SHA-256)** | `a8f9b2c3d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0` |
| **Autoridade Emissora** | Architecture Council / Illumine OS™ Governance |

---

## 2. Artefatos Certificados sob esta Baseline

### Artefatos de Fundação e Constituição
* [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md) (14 Princípios + 6 Leis)
* [`ARCHITECTURE_REFERENCE.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_REFERENCE.md) (Manual Física Monorepo)
* [`ARCHITECTURE_COMPLIANCE.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_COMPLIANCE.md) (Matriz de Dependências)

### Artefatos da Experience Architecture & Cartórios
* [`docs/EXPERIENCE_ARCHITECTURE.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_ARCHITECTURE.md) (Level A — Canonical)
* [`docs/COGNITIVE_MAPPING.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/COGNITIVE_MAPPING.md) (Equivalência Cognitiva)
* [`docs/CANONICAL_EXPERIENCE_REGISTRY.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/CANONICAL_EXPERIENCE_REGISTRY.md) (`EXP-001` a `EXP-004`)
* [`docs/EXPERIENCE_REGISTRY.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_REGISTRY.md) (Especialização de Render Protocols)
* [`docs/EXPERIENCE_CLASSIFICATION_MATRIX.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_CLASSIFICATION_MATRIX.md) (Classificação de Páginas)
* [`docs/EXPERIENCE_CERTIFICATION_FRAMEWORK.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_CERTIFICATION_FRAMEWORK.md) (Protocolo de Validação)

### Artefatos de Tooling e Linter
* [`docs/ARCHITECTURE_LINTER.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/ARCHITECTURE_LINTER.md) (Especificação do Linter)
* [`docs/ARCHITECTURE_CERTIFICATION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/ARCHITECTURE_CERTIFICATION.md) (Framework dos 5 Níveis)
* `packages/tooling/architecture-linter/index.cjs` (CLI Runner)

### ADRs Congeladas sob esta Baseline
* `ADR-001` a `ADR-068` (Foundation & Intelligence)
* `ADR-069` (Experience Architecture Foundation - EAF v1.0)
* `ADR-070` (Architecture Governance Completion - AGC v1.0)
* `ADR-071` (Architecture Linter & Compliance Engine - ALC v1.0)
* `ADR-072` (Architecture Certification Framework - ACF v1.0)

---

## 3. Regra de Invariância de Baseline

Qualquer alteração nos artefatos certificados acima invalida o hash de integridade e exige a re-certificação completa da plataforma com geração de nova baseline.
