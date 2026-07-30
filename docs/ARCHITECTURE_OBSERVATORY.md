# ARCHITECTURE_OBSERVATORY.md — Architecture Observatory (AOB v1.0)

> **Manual e Especificação do Observatório Arquitetural da IERA v1.0**  
> *Horizonte Temporal de Estabilidade: 10+ Anos (2026 – 2036+)*  
> *Documentos Complementares: [`docs/ARCHITECTURE_CERTIFICATION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/ARCHITECTURE_CERTIFICATION.md) | [`CERTIFICATION_BASELINE.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/CERTIFICATION_BASELINE.md)*  
> *Status: Homologado & Ativo*

---

## 1. Visão Geral e Propósito

O **Architecture Observatory (AOB v1.0)** é o subsistema de observabilidade, telemetria visual e inteligência de grafos arquiteturais do Illumine OS™.

Com o observatório, a arquitetura deixa de ser apenas validada e passa a ser **completamente visualizada, auditável e navegável**, gerando relatórios automáticos a cada ciclo de release.

---

## 2. Estrutura do Subsistema

```
packages/tooling/architecture-observatory/
├── index.cjs                  # Engine principal do Observatório & Exporter
├── dashboards/
│   ├── dependency-graph.cjs   # Dashboard 1: Grafo de Dependências de Pacotes
│   ├── experience-map.cjs     # Dashboard 2: Mapa de Workspaces, Experiências e Páginas
│   ├── capability-map.cjs     # Dashboard 3: Mapa de Capabilities, Contratos e KPIs
│   ├── knowledge-graph.cjs    # Dashboard 4: Grafo de Decisão Causal Corporativo
│   ├── architecture-coverage.cjs # Dashboard 5: Indicadores de Cobertura de Certificação
│   └── architecture-health.cjs# Dashboard 6: Indicadores de Saúde e Integridade
└── reports/                   # Diretório de geração automática (HTML, MD, JSON)
```

---

## 3. Os 6 Dashboards de Observabilidade

### Dashboard 1 — Dependency Graph
* **Fluxo**: `Packages` $\rightarrow$ `Imports` $\rightarrow$ `Acoplamentos` $\rightarrow$ `Dependências`
* **Descrição**: Mapeia visualmente todas as conexões entre pacotes monorepo, sinalizando isolamento de camadas.

### Dashboard 2 — Experience Map
* **Fluxo**: `Workspace` $\rightarrow$ `Experience` $\rightarrow$ `Pages` $\rightarrow$ `Components`
* **Descrição**: Exibe a distribuição das superfícies pelos 4 Workspaces e suas categorias de *Experience*.

### Dashboard 3 — Capability Map
* **Fluxo**: `Capability` $\rightarrow$ `Contracts` $\rightarrow$ `KPIs` $\rightarrow$ `Pages` $\rightarrow$ `Experiences`
* **Descrição**: Demonstra como as capacidades cognitivas alimentam os contratos de domínio e as visões de página.

### Dashboard 4 — Knowledge Graph
* **Fluxo**: `Business Question` $\rightarrow$ `Executive Decision` $\rightarrow$ `KPIs` $\rightarrow$ `Evidence` $\rightarrow$ `Capabilities` $\rightarrow$ `Pages` $\rightarrow$ `Components`
* **Descrição**: Rastreabilidade causal ponta a ponta da pergunta de negócio até o componente de UI.

### Dashboard 5 — Architecture Coverage
* **Métricas**:
  * Páginas Certificadas vs. Sem Classificação (100% Certificadas)
  * Cobertura de Cartórios Normativos (100%)
  * Componentes Homologados vs. Experimentais

### Dashboard 6 — Architecture Health
* **Métricas**:
  * Índice de Saúde Arquitetural (100/100)
  * Violações de Layer (0)
  * Páginas Órfãs ou Registries Inconsistentes (0)

---

## 4. Exportação Multiformato e CI/CD

O Observatório permite a geração automática de relatórios em três formatos:
* **HTML**: Dashboard interativo navegável.
* **Markdown**: Relatório para documentação e versionamento no Git (`docs/reports/`).
* **JSON**: Telemetria para ingestão em pipelines de observabilidade.

Ao término de cada release, o CI/CD gera automaticamente o snapshot: `Architecture Report`, `Experience Coverage`, `Dependency Map`, `Certification Report` e `Observatory Snapshot`.
