# Executive Workspace I18N Audit

**Objetivo:** Identificar textos hardcoded, enums visuais, labels, mensagens de erro e tooltips na área restrita (Executive Workspace) antes da migração estrutural para internacionalização. 
**Importante:** Os valores dinâmicos corporativos (como "EBITDA", "ROE", "ROI", formatados em moedas ou percentuais) não serão traduzidos para manter a fidelidade contábil e de negócios.

## 1. Estrutura de Navegação

| Área | Componentes | Status de Auditoria | Ação Recomendada |
| :--- | :--- | :--- | :--- |
| **Navegação Lateral** | `AppSidebar` | Parcialmente hardcoded | Extrair labels para `navigation.json`. Manter rotas originais (`/dashboard`). |
| **Menus Internos** | `ExecutiveNavigation` | Hardcoded (ex: "Dashboard", "Settings") | Usar `t("navigation.*")`. |
| **Mobile** | `MobileNavigation` | Hardcoded | Sincronizar com chaves de `navigation.json`. |
| **Command Menus** | Menu Executivo de Ações | Hardcoded em actions secundárias | Traduzir ações e labels. Rotas e enums de permissão (`CFO_ROLE`, `EXECUTIVE`) mantidos. |
| **Breadcrumbs** | *Breadcrumbs* variados | Hardcoded em templates | Usar `navigation.json`. |

## 2. Executive Workspace Components

| Componente | Tipo de Conteúdo Hardcoded | Ação Recomendada (Interface) | Ação Recomendada (Dados) |
| :--- | :--- | :--- | :--- |
| **`ConsolidatedExecutivePage`** | Títulos ("Dashboard Executivo"), subtítulos, tooltips de período. | Migrar para `dashboard.json`. | Manter identificadores de período (ex: "2026", "Q3") se vindos do tenant. |
| **`ExecutiveCommandCenter`** | Labels de controle, alertas estruturais ("Nenhuma anomalia"). | Migrar para `dashboard.json`. | Manter KPIs raw. |
| **`ExecutiveMetricCard`** | Labels de cards ("Receita", "Margem", "Risco"). | Migrar rótulos para `metrics.json`. | Não traduzir valores (`R$ 1.250.000`, `12%`). |
| **`ExecutiveStrategicSemanticCards`** | Labels semânticos, explicações curtas. | Migrar para `dashboard.json` ou `metrics.json`. | Manter entidades financeiras inalteradas. |
| **Widgets (Cash, Forecast)** | Eixos de gráficos, placeholders, "Carregando...". | Migrar para `dashboard.json` / `reports.json`. | Manter valores dos eixos baseados na moeda do tenant. |
| **Estados Vazios** | "Sem dados no período", "Acesso restrito". | Migrar para `dashboard.json` e `permissions.json`. | - |

## Regra de Separação (Data vs Interface)

### O que vai para `locales` (`dashboard.json`, `metrics.json`, etc):
- "Receita" -> `metrics.revenue`
- "Margem" -> `metrics.margin`
- "Risco" -> `metrics.risk`
- "Visão Executiva" -> `dashboard.executive_view`

### O que permanece INALTERADO (Dados Corporativos):
- EBITDA
- ROE
- ROI
- DRE
- Balanço Patrimonial (se oriundos da engine contábil)
- Valores Monetários e Percentuais
