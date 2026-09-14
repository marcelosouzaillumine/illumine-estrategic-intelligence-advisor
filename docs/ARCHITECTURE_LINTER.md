# ARCHITECTURE_LINTER.md — Architecture Linter & Compliance Engine (ALC v1.0)

> **Manual e Especificação do Linter Arquitetural da IERA v1.0**  
> *Horizonte Temporal de Estabilidade: 10+ Anos (2026 – 2036+)*  
> *Documentos Complementares: [`ARCHITECTURE_COMPLIANCE.md`](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/ARCHITECTURE_COMPLIANCE.md) | [`docs/EXPERIENCE_CERTIFICATION_FRAMEWORK.md`](file:///Users/marcelosouza/Documents/illumine-strategic-governance-advisor/docs/EXPERIENCE_CERTIFICATION_FRAMEWORK.md)*  
> *Status: Homologado & Ativo*

---

## 1. Visão Geral e Propósito

O **Architecture Linter & Compliance Engine (ALC v1.0)** é o subsistema de validação sintática e semântica de arquitetura do Illumine OS™. Ele automatiza a aplicação contínua de todas as 6 Leis Arquiteturais, dos 14 Princípios da Constituição e das regras de governança da IERA v1.0.

O Linter executa localmente via CLI e de forma compulsória no pipeline de CI/CD, bloqueando compilações em caso de violação.

---

## 2. As 6 Engines de Validação Automatizada

```
packages/tooling/architecture-linter/
├── index.cjs                  # CLI Runner principal
└── engines/
    ├── dependency-linter.cjs  # Engine 1: Dependências e Clean Architecture
    ├── experience-linter.cjs  # Engine 2: Metadados de Experience em Páginas
    ├── registry-validator.cjs # Engine 3: Validação de Cartórios e Registries
    ├── workspace-validator.cjs# Engine 4: Compatibilidade de Workspaces
    ├── render-validator.cjs   # Engine 5: Especialização de Render Protocols
    └── adr-validator.cjs      # Engine 6: Cobertura de ADRs para Experiências
```

### Engine 1: Dependency Linter
* **Função**: Detectar imports proibidos, dependências circulares e desacoplamento de camadas.
* **Regras**: Valida a matriz de dependências de `ARCHITECTURE_COMPLIANCE.md` (`core-primitives` 0 deps; `semantic-model` apenas primitives; capabilities desacopladas entre si).

### Engine 2: Experience Linter
* **Função**: Garantir a presença e integridade dos metadados de *Experience* em 100% das superfícies.
* **Invariante**: Se qualquer chave (`experience`, `workspace`, `classification`, `renderProtocol`, `cognitiveProfile`) estiver ausente, emite a falha: **`Experience Metadata Missing`**.

### Engine 3: Registry Validator
* **Função**: Validar a consistência dos cartórios normativos.
* **Invariante**: Verifica se as experiências citadas em páginas existem no `CANONICAL_EXPERIENCE_REGISTRY.md`, no `EXPERIENCE_REGISTRY.md` e na `EXPERIENCE_CLASSIFICATION_MATRIX.md`.

### Engine 4: Workspace Validator
* **Função**: Enforçar o isolamento cognitivo de Workspaces.
* **Validação**:
  * `Decision` $\rightarrow$ `Executive Workspace`
  * `Registration` $\rightarrow$ `Platform Workspace`
  * `Operational` $\rightarrow$ `Operational Workspace`
  * `Governance` $\rightarrow$ `Governance Workspace`

### Engine 5: Render Validator
* **Função**: Garantir que a árvore de componentes visuais utilize o *Render Protocol* correto.
* **Validação**: `Experience` $\rightarrow$ `Workspace` $\rightarrow$ `Render Protocol` $\rightarrow$ `Component Tree`.

### Engine 6: ADR Validator
* **Função**: Verificar se qualquer nova categoria de *Experience* ou alteração estrutural possui ADR normativo correspondente em vigor.

---

## 3. Comandos CLI Registrados

| Comando | Descrição |
| :--- | :--- |
| `npm run architecture:lint` | Executa o Linter completo (todas as 6 engines). |
| `npm run architecture:verify` | Valida dependências de pacotes e regras Clean Architecture. |
| `npm run architecture:experience` | Verifica metadados de experiência nas páginas e superfícies. |
| `npm run architecture:registry` | Valida consistência e integridade dos cartórios normativos. |

---

## 4. Integração ao Pipeline de CI/CD

O Linter é integrado como estágio obrigatório no pipeline de Release:

$$\text{Typecheck} \longrightarrow \text{Tests} \longrightarrow \text{Architecture Linter (\texttt{architecture:lint})} \longrightarrow \text{Release}$$

Caso qualquer engine identifique violações, o Linter retorna exit code `1` e interrompe o deploy.
