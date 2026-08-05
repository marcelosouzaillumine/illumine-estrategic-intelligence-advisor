# Localization Architecture Baseline
**Document Status**: BASELINE V1
**Data**: 04 de Agosto de 2026

## 1. Visão Geral
Este documento estabelece a fundação arquitetural para o sistema de Internacionalização (i18n) e Localização (l10n) do Illumine Executive Workspace, após a conclusão da Wave 2B.5.

## 2. Dynamic Data Boundary (Fronteira de Dados Dinâmicos)
- **Definição**: A separação absoluta entre dados brutos providos pela Data Layer (Backend/Firebase) e sua representação visual na Experience Layer (React/UI).
- **Regra**: Todo e qualquer componente visual está bloqueado de chamar funções nativas de formatação (Ex: `.toLocaleString()`, `.toLocaleDateString()`, `Intl.*`).
- **Implementação**: Uso obrigatório do hook `useExecutiveFormatter()`.

## 3. Translation Boundary (Fronteira de Tradução)
- **Definição**: O desacoplamento de strings semânticas humanas do código fonte do componente.
- **Regra**: Nenhuma string de domínio (Ex: "Saudável", "Crítico", "Otimizado") pode residir solta na UI.
- **Implementação**:
  - Uso do namespace `executive.json` (Ex: `t('executive:status.healthy')`).
  - Uso do namespace `advisory.json` (Ex: `t('advisory:insights.title')`).
  - Uso de `useTranslation()` do pacote `react-i18next`.

## 4. Glossário Corporativo (Executive Taxonomy)
Toda a taxonomia deve estar mapeada nos JSONs de locale (`pt-BR`, `en-US`, `es-ES`).
O domínio semântico executivo está dividido logicamente em:
- **Status**: Representam estados operacionais mecânicos (`critical`, `attention`, `healthy`, `optimized`, `neutral`, `alert`, `pending`, `efficient`).
- **Decision**: Representam interpretações fiduciárias e cognitivas (`recommendation`, `opportunity`, `risk`, `impact`).

## 5. Multi-Tenant Locale Strategy
- Cada sessão (Session) pode pertencer a um Tenant específico.
- A resolução de locale obedece à matriz:
  1. Forçamento por Query Param ou URL.
  2. Forçamento por LocalStorage (Preferência do Usuário).
  3. Default do Tenant (Configurado via App).
  4. Detecção via Browser (`navigator.language`).

## 6. Governança de Componentes
Os componentes de Design System (Ex: `ExecutiveMetricCard`, `ExecutiveStrategicSemanticCards`, `ExecutiveTypography`) assumem um papel neutro, sem hardcodes linguísticos, exigindo que o chamador forneça a string traduzida, ou traduzindo chaves padronizadas internas no próprio componente com fallback para o dicionário padrão.

*Este Baseline é o documento normativo principal para auditabilidade e PR Reviews em evoluções futuras da arquitetura.*
