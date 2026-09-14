# I18n Migration Registry

Este registro de governança controla a migração da arquitetura monolítica (legada) para os namespaces do i18next baseados em domínio.

> **Regra Arquitetural**: Nenhum componente recém-criado pode possuir estado próprio para controle de idioma (`useContext`). Tudo deve utilizar a biblioteca `react-i18next` através de `useTranslation` ou do hook unificado `useLocale`. Todos os novos componentes de UI voltados para uso público ou corporativo devem nascer internacionalizados, vinculados ao seu respectivo namespace.

## Wave 2A: Public Experience Migration
Foco na Área Pública (SEO, Institucional, Parcerias, Preços).

| Componente/Página | Status | Namespace Alvo | Responsável/Wave |
|---|---|---|---|
| `HomePage` (`/`) | Migrada | `institutional` | Wave 2A.1 |
| `InstitutionalHomePage` | Migrada | `institutional` | Wave 2A.1 |
| `EmpresasPage` | Pendente | `solutions` | Wave 2A |
| `PartnerSalesPage` | Pendente | `partners` | Wave 2A |
| `ExecutiveAdvisorNetworkLandingPage` | Pendente | `partners` | Wave 2A |
| `InstitutionalPlatformPage` | Pendente | `public` | Wave 2A |
| `InstitutionalManifestoPage` | Migrada | `institutional` | Wave 2A.1 |
| `InstitutionalWhyPage` | Pendente | `public` | Wave 2A |
| `InstitutionalDomainsPage` | Pendente | `public` | Wave 2A |
| `InstitutionalGovernancePage` | Pendente | `governance` | Wave 2A |
| `PricingPage` (Se existir) | Pendente | `pricing` | Wave 2A |

## Wave 2B: Executive Workspace
Foco no dashboard principal, menus laterais (sidebar) e workspaces dos usuários autenticados.

| Componente/Página | Status | Namespace Alvo | Responsável/Wave |
|---|---|---|---|
| `AppSidebar` | Pendente | `navigation` | Wave 2B |
| `ConsolidatedExecutivePage` | Pendente | `dashboard` | Wave 2B |
| `AccountModal` (Settings) | Pendente | `common` | Wave 2B |
| *Outros Dashboards e Tabelas* | Pendente | `reports` / `metrics` | Wave 2B |

## Wave 2C: Governance Localization
Foco nos modelos cognitivos, prompts de IA generativa, insights executivos e narrativas.

| Módulo IA | Status | Namespace Alvo | Responsável/Wave |
|---|---|---|---|
| `ExecutiveCognitiveProvider` | Pendente | `ai` / `executive` | Wave 2C |
| `ExecutiveInteractionProvider` | Pendente | `ai` | Wave 2C |
| *Narrative Generation* | Pendente | `ai` | Wave 2C |

---
**Status Permitidos:** Pendente, Em Progresso, Migrada.
