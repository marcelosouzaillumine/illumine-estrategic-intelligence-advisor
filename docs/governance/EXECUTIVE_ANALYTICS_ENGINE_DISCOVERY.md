# Executive Analytics Engine Discovery

Este relatório (Phase 1 / BI-002) documenta a descoberta e classificação da lógica analítica existente no atual ecossistema da Illumine, categorizando o nível de acoplamento técnico.

## Classificação Analítica Atual

A lógica de inteligência financeira e de negócios hoje se encontra fracionada, classificada nas seguintes categorias de dívida técnica:

### T0 - Duplicação (Regras idênticas em múltiplos lugares)
Regras de cálculo sendo refeitas sob demanda em vez de injetadas.
* **ControladoriaPage.tsx** e **StrategicSimulatorPage.tsx**:
  Ambos implementam lógicas isoladas (`getIndicatorValue`) para tratar nulos, em vez de o motor já fornecer o indicador seguro ou o erro apropriado.

### T1 - Análise Local na UI (Inteligência in-component)
Componentes React decidindo lógicas de negócio.
* **EFOSPage.tsx**:
  Decide quando é "MockData" cruzando arrays de propriedades (`bpEntries.length === 0 && dreEntries.length === 0`). A UI decide a integridade semântica da empresa.
* **DLPAPage.tsx**:
  Faz o julgamento de absorção de prejuízos internamente no frontend.

### T2 - Narrativa Duplicada (Textos fixos ou dinâmicos repetidos)
Textos interpretativos gerados sem o uso de um motor de narrativas.
* **DashboardPage.tsx**:
  Mensagens da IA como "mock_correlation" vs "mock_require_data" tratadas no componente de UI em vez de delegadas ao modelo narrativo.
* Componentes Base (ex: `BalanceSheetTechnicalLayerSection.tsx`):
  Textos de metodologias e ressalvas escritos manualmente no JSX.

### T3 - Engine Paralelo
Módulos isolados que executam análises locais (ex: planilhas embutidas ou serviços órfãos) que bypassam o pipeline padrão.
* **CalibrationPlayground.tsx**:
  Bypassa as proteções institucionais normais e roda num contexto fiduciário próprio usando mocks explícitos.
* **PilotExperienceDashboard.tsx**:
  Decide que o tenant está vazio e roda uma ramificação inteira para entregar uma experiência "Mock", atuando como um Engine de demonstração acoplado à visão de produção.

## Resumo e Meta
Atualmente, as decisões sobre o que mostrar e como explicar os números estão descentralizadas. A transição para o **Canonical Analytics Engine** abolirá os níveis T0 a T3 transferindo 100% da responsabilidade de interpretação para os `Capabilities` oficiais e a responsabilidade de formatação textual para o `Narrative Engine`.
