# EAC Component Gap Analysis

O objetivo desta auditoria é localizar as peças arquiteturais estruturantes que existem na base de código, avaliar sua maturidade em relação ao **Executive Architecture Constitution (EAC)**, e definir se o componente deve ser promovido, estendido, ou se uma lacuna real exige a criação de uma nova fundação (orquestrador).

## Inventário Estrutural Atual

### 1. Page Identity (Header)
- **Componente atual:** `PageHeader` (em `src/components/Common/Base.tsx`)
- **Status:** Legado / Parcialmente aderente
- **Função atual:** Renderiza Title, Subtitle, Ícone, Badge (singular), e Actions.
- **Análise:** O `PageHeader` mistura o `badge` com as `actions` na mesma linha de props. Não acomoda de forma estruturada múltiplos badges fiduciários (Context e Status) de forma semântica pura.
- **Veredito:** Promovível/Estensível. Não deve ser criado um *ExecutivePageHeader* do zero. O `PageHeader` pode ser refatorado para aceitar `statusSlot`, `contextSlot` em vez de apenas uma string `badge`.

### 2. Context Controls (Toolbar / Filters)
- **Componente atual:** `ControlBar` (em `src/components/Common/Base.tsx`), `BalanceSheetYearFilter` (local da BP)
- **Status:** Fragmentado
- **Função atual:** O `ControlBar` faz quase tudo: ano, mês, abas, badges e botões. Na BP, os seletores foram fragmentados para fora do `ControlBar`.
- **Análise:** Mistura Filters, Selectors e Actions no mesmo container sem distinção clara do papel cognitivo. 
- **Veredito:** Lacuna Arquitetural Média. Necessita de um container semântico puro: `<ExecutiveContextBar>` que defina slots claros para "Filtros" vs "Status".

### 3. Actions Toolbar
- **Componente atual:** `BalanceSheetActionToolbar`
- **Status:** Local (Apenas na BP)
- **Função atual:** Agrupa `ExecutiveAction`s (Lançar, Importar, Excluir).
- **Análise:** Embora use o `ExecutiveSurface`, o componente está amarrado ao domínio de BP e não impõe regras globais de *primary* vs *secondary*.
- **Veredito:** Lacuna Média. Promover o padrão para um `<ExecutiveToolbar>` genérico.

### 4. Executive Summary
- **Componente atual:** `BalanceSheetExecutiveSynthesisSection`, `BalanceSheetInstitutionalContextSection`
- **Status:** Altamente Acoplado ao Domínio (BP)
- **Análise:** A formatação da "Tese" e da "Opinião Executiva" ocorre diretamente dentro das páginas ou componentes de página específicos.
- **Veredito:** Lacuna Real. Necessita de um `<ExecutiveSummarySection>` que padronize a apresentação de diagnósticos.

### 5. KPI Grid
- **Componente atual:** `<ExecutiveExposureCard>`, antigos `KpiCard` (em Common).
- **Status:** Híbrido
- **Análise:** O `ExecutiveExposureCard` agrupa métricas bem, mas falta um grid padronizado orquestrando o bloco inteiro de KPIs superiores.
- **Veredito:** Lacuna Real. Necessidade do `<ExecutiveKPISection>`.

### 6. Technical Layer / Audit
- **Componente atual:** `BalanceSheetTechnicalLayerSection`, `BalanceSheetAuditLayerSection`
- **Status:** Implementado apenas na BP.
- **Análise:** Renderiza trace de decisão, linhagem, e logs de IA.
- **Veredito:** Lacuna Média. A estrutura interna está boa, mas o container precisa ser promovido a `<ExecutiveTechnicalSection>` para que outras páginas usem a mesma anatomia de disclosure.

## Conclusão e Próximos Passos (EAC Scanner V2)

As lacunas arquiteturais abaixo foram revistas após a calibração do Scanner V2:

- **`<ExecutiveContextBar>` (Separação de Filters, Status e Actions):**
  - **Status:** **Confirmed**
  - **Motivo:** `ControlBar` mistura conceitos. O Scanner V2 demonstrou que separar os slots aumenta a previsibilidade da auditoria.

- **`<ExecutiveSummarySection>`:**
  - **Status:** **Confirmed**
  - **Motivo:** O *BalanceSheetExecutiveSynthesisSection* existe, mas precisa de promoção genérica para que o scanner valide Sumários Executivos em páginas além de BP sem depender do Registry local.

- **`<ExecutiveKPISection>`:**
  - **Status:** **Probable**
  - **Motivo:** Componentes de Grid estão fragmentados. É provável que um container ajude, mas será verificado se a mera composição do `ExecutiveExposureCard` é suficiente.

- **`<ExecutiveToolbar>`:**
  - **Status:** **Unproven**
  - **Motivo:** Pode ser apenas um padrão composicional de `ExecutiveAction`s dentro de um `ExecutiveSurface`, não necessitando de um componente orquestrador estrito.

- **`<ExecutiveTechnicalSection>`:**
  - **Status:** **Probable**
  - **Motivo:** O Scanner detecta facilmente os blocos finais da BP, mas a generalização do container facilitará a aderência do Board Mode e Analytics.
