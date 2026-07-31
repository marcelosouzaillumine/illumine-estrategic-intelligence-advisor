# Executive Analytics Discovery Report

Este relatório documenta a auditoria completa da plataforma (Phase 0), mapeando a dívida técnica atual relacionada ao acoplamento analítico na UI, uso de mocks e fallbacks sem governança. 

## 1. Mapeamento de Mocks Visuais
Identificamos componentes que utilizam dados simulados para contornar a ausência de informações e apresentar visuais "premium".
* **PilotExperienceDashboard.tsx:** 
  - Utiliza `MOCK_DATA` e um trigger para injetar dados ricos se o tenant estiver vazio, burlando a realidade factual do cliente.
* **CalibrationPlayground.tsx:**
  - Ambiente fiduciário injetando `MOCK_SANDBOX_DATA` no motor de geração de relatório, e forçando o `ActorId` para 'AUDITOR-MOCK'.

## 2. Hardcoded Tenants & Contextos
Em páginas institucionais, o contexto do Tenant e Workspace foi fixado no código, impedindo isolamento analítico correto.
* **GovernanceOrchestrationPage.tsx:**
  - `const tenantId = 'TENANT-HQ'; // Mock MVP Tenant`
* **InstitutionalIntegrationsPage.tsx:**
  - Contextos fixos (`TENANT-HQ`, `WS-1`, `USER-1`) vazando para logs e importações.

## 3. Fallbacks Metodológicos e Lógicas Fixas na UI
Páginas que estão tomando a liberdade de interpretar indicadores ou usar valores fixos (fallbacks) quando a informação correta falta, ao invés de usar o Calculation Engine.
* **StrategicSimulatorPage.tsx:**
  - O churn rate possui um fallback hardcoded de 5% (`getIndicatorValue('Churn Rate', 5)`). A UI decide a taxa padrão.
* **ControladoriaPage.tsx:**
  - Mesma estrutura de fallback em caso de ausência de indicador (`fallback: number = 0`).

## 4. Análise Interpretativa na Camada de UI
Apresentação de narrativas e rótulos analíticos embutidos nos componentes visuais.
* **BalanceSheetTechnicalLayerSection.tsx / AuditLayerSection.tsx:**
  - O componente embute explicações e textos fixos sobre o Índice Patrimonial e Observações Metodológicas, impossibilitando internacionalização e auditoria dinâmica da narrativa.
* **DLPAPage.tsx:**
  - Narrativas como *"Todo lucro futuro deverá ser destinado prioritariamente à absorção dos prejuízos acumulados..."* estão escritas diretamente em Markdown no React.
* **EFOSPage.tsx:**
  - Mantém uma lógica complexa de `isMockData` ou `forceFallback` baseada em Query Params (`forceFallback=true`) para exibir visualizações institucionais forçadas. Ele sobrescreve o resultado da Auditoria Semântica para exibir a mensagem fixa de "Fallback Institutional View".

## Conclusão da Fase 0
A plataforma possui focos significativos de inteligência fixada no frontend. A UI toma decisões de preenchimento de vazios e carrega explicações de negócio que deveriam vir de um motor narrativo agnóstico. 
A erradicação total destas práticas é indispensável para o cumprimento dos critérios da Wave BI-001.
