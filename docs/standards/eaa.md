# Executive Analytical Architecture (EAA) Standard

**Padrão Normativo de Layouts para Páginas Analíticas, Demonstrativos e Conselho**

---

## 1. Escopo de Aplicação (`MUST`)
Obrigatório para todas as telas de relatórios, DRE, Balanço Patrimonial, DFC, DLPA, Indicadores, ESGIM™, Board Pack e Inteligência Consolidada.

---

## 2. Hierarquia de Leitura C-Level
```text
  [1. Conselho (Topo)] ➔ Status de Homologação, Grau de Confiança & Narrativa Síntese
           │
  [2. Diretoria (Meio)] ➔ Grids Analíticos (2 Colunas), Topologia & Causalidade Estrutural
           │
  [3. Técnico (Base)] ➔ Lineage de Contas, Evidências Auditáveis & Ação Tática
```

---

## 3. Primitivas Obrigatórias (`MUST`)
- `ExecutivePageTemplate` (largura máxima 1440px, `animate-executive-fade`, `pb-32`)
- `PageHeader` (breadcrumbs, icon box, title, badge, actions)
- `ExecutiveSurface`
- `ExecutiveNarrative`
- `ExecutiveAccordion` (*Regra SHOULD: Toda seção secundária cuja ausência não comprometa a leitura inicial deve ser encapsulada em Accordion*)
- `ExecutiveTable`
- `ExecutiveChart`
