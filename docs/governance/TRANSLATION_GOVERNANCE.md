# Translation Governance Registry

## Princípios de Internacionalização (i18n) na Illumine Executive Governance Platform™

1. **A Inteligência Amplia. A Decisão Permanece Humana.**
   A internacionalização não é apenas traduzir a interface, mas adaptar o tom executivo e os conceitos estratégicos a cada idioma e contexto cultural.
2. **Separação de Idioma e Região**
   O idioma da interface não dita a formatação regional. Um usuário pode operar em Português formatando dados em Dólares (USD).
3. **Namespaces e Escalabilidade**
   Não deve haver dicionários monolíticos. Cada área da plataforma ou domínio deve ter seu próprio namespace JSON (ex: `dashboard`, `financial`, `reports`).

## Regras Arquiteturais
- **PROIBIDO:** Textos hardcoded na interface, como `<h1>Dashboard</h1>`.
- **PERMITIDO:** Utilização de `t("dashboard:title")` usando o hook oficial `useTranslation` do `react-i18next` ou o Compatibility Adapter (`useLanguage` -> `t`).
- Todo módulo novo público deve nascer internacionalizado (Namespace criado em `src/core/internationalization/locales/`).

## Glossário Oficial

Este glossário define como termos *premium* da Illumine devem ser traduzidos consistentemente pela plataforma e pelos Agentes IA.

| Português (PT) | English (EN) | Español (ES) |
|---|---|---|
| Inteligência Executiva | Executive Governance | Inteligencia Ejecutiva |
| Governança | Governance | Gobernanza |
| Conselho | Board | Consejo |
| Insight Executivo | Executive Insight | Insight Ejecutivo |
| Board Pack | Board Pack | Board Pack |
| Ciclo Institucional de Aprendizado | Institutional Learning Loop | Ciclo Institucional de Aprendizaje |
| Nível de Confiança | Confidence Level | Nivel de Confianza |
| Linhagem Fiduciária | Fiduciary Lineage | Linaje Fiduciario |
| Posicionamento Estratégico | Strategic Positioning | Posicionamiento Estratégico |
| Roadmap de Execução | Execution Roadmap | Hoja de Ruta de Ejecución |
| Capital de Giro | Working Capital | Capital de Trabajo |

Este documento atua como constituição e "Single Source of Truth" (SSOT) para tradução de todos os componentes futuros.
