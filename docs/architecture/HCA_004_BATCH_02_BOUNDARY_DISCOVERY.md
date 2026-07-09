# HCA-004 Batch 2: Boundary Reduction Program (Discovery)

## 1. Topologia das Violações (Total: 297)

### Por Capability
- **modals**: 31 violações
- **ClientExecutiveWorkspace.tsx**: 15 violações
- **governance**: 11 violações
- **EFOSPage.tsx**: 6 violações
- **advisor**: 5 violações
- **CashFlowPage.tsx**: 5 violações
- **DadosHistoricosPage.tsx**: 5 violações
- **ProfilePage.tsx**: 5 violações
- **AppSidebar.tsx**: 4 violações
- **ClientImportHistory.tsx**: 4 violações
- **memory**: 4 violações
- **AnaliseFinanceiraPage.tsx**: 4 violações
- **ControladoriaPage.tsx**: 4 violações
- **DFCPage.tsx**: 4 violações
- **DashboardPage.tsx**: 4 violações
- **GovernanceDashboardPage.tsx**: 4 violações
- **PilotExperienceDashboard.tsx**: 4 violações
- **dre**: 4 violações
- **temporal**: 4 violações
- **ClientUserManager.tsx**: 3 violações
- **EmployeeManager.tsx**: 3 violações
- **PayrollDashboard.tsx**: 3 violações
- **SalesPipelineManager.tsx**: 3 violações
- **digital-twin**: 3 violações
- **intelligence**: 3 violações
- **investigation**: 3 violações
- **AdministrativaPage.tsx**: 3 violações
- **AdvisorWorkspacePage.tsx**: 3 violações
- **AnaliseMercadoPage.tsx**: 3 violações
- **AssetManagementPage.tsx**: 3 violações
- **AvaliacaoOrganogramaPage.tsx**: 3 violações
- **AxisDashboardPage.tsx**: 3 violações
- **CleanupTool.tsx**: 3 violações
- **ConsolidatedGroupAdminPage.tsx**: 3 violações
- **EstruturaGovernancaPage.tsx**: 3 violações
- **FinancialAdminDashboard.tsx**: 3 violações
- **FinancialModelingPage.tsx**: 3 violações
- **FiscalTributarioPage.tsx**: 3 violações
- **GovernanceTimeMachinePage.tsx**: 3 violações
- **IndicatorsPage.tsx**: 3 violações
- **InstitutionalDigitalTwinPage.tsx**: 3 violações
- **InstitutionalReportsPage.tsx**: 3 violações
- **LeadershipProfilePage.tsx**: 3 violações
- **LoanInvestmentSimPage.tsx**: 3 violações
- **MaintenancePage.tsx**: 3 violações
- **MarketingComercialPage.tsx**: 3 violações
- **MeetingMinutesPage.tsx**: 3 violações
- **OperacionalPage.tsx**: 3 violações
- **OrcamentoPage.tsx**: 3 violações
- **PartnersPage.tsx**: 3 violações
- **PayablesPage.tsx**: 3 violações
- **PlanoAcaoPage.tsx**: 3 violações
- **PlanoDeContasPage.tsx**: 3 violações
- **PortfolioPage.tsx**: 3 violações
- **PremissasClientePage.tsx**: 3 violações
- **PremissasEconomicasPage.tsx**: 3 violações
- **PurchasingPage.tsx**: 3 violações
- **QuadroPessoalPage.tsx**: 3 violações
- **ReceivablesPage.tsx**: 3 violações
- **RelatorioDemonstracoes5Anos.tsx**: 3 violações
- **RelatorioExecutivoPage.tsx**: 3 violações
- **StrategicSimulatorPage.tsx**: 3 violações
- **TaxReformImpactPage.tsx**: 3 violações
- **ViabilityPage.tsx**: 3 violações
- **academy**: 3 violações
- **admin**: 3 violações
- **dlpa**: 3 violações
- **workspaces**: 3 violações
- **ExecutiveCommentary.tsx**: 2 violações
- **consolidated**: 2 violações
- **executive-delivery**: 2 violações
- **FinancialPositionPage.tsx**: 2 violações
- **SupportPage**: 2 violações
- **SupportPage.tsx**: 2 violações
- **clients**: 2 violações
- **war-room**: 2 violações
- **BalanceSheetPage.tsx**: 1 violações
- **CalibrationPlayground.tsx**: 1 violações
- **ClientsPage.tsx**: 1 violações
- **MessagesPage.tsx**: 1 violações
- **PilotMonitoringDashboard.tsx**: 1 violações
- **public**: 1 violações
- **useClientsPageViewModel.ts**: 1 violações

### Por Tipo
- **Firebase (Direct)**: 144 violações
- **Core (Direct Fiduciary)**: 76 violações
- **Firebase**: 74 violações
- **Runtime (Direct Fiduciary)**: 3 violações

## 2. Seleção de Alvos Iniciais (Batch 2B)
As 10 violações mais simples para isolamento e adaptação (Risco SAFE):

| Arquivo | Capability | Tipo | Risco | Estratégia |
| :--- | :--- | :--- | :--- | :--- |
| `AppSidebar.tsx` | AppSidebar.tsx | Firebase | SAFE | Encapsular em Adapter/ViewModel |
| `AppSidebar.tsx` | AppSidebar.tsx | Core (Direct Fiduciary) | SAFE | Encapsular em Adapter/ViewModel |
| `AppSidebar.tsx` | AppSidebar.tsx | Firebase (Direct) | SAFE | Encapsular em Adapter/ViewModel |
| `AppSidebar.tsx` | AppSidebar.tsx | Firebase (Direct) | SAFE | Encapsular em Adapter/ViewModel |
| `ClientImportHistory.tsx` | ClientImportHistory.tsx | Firebase | SAFE | Encapsular em Adapter/ViewModel |
| `ClientImportHistory.tsx` | ClientImportHistory.tsx | Firebase | SAFE | Encapsular em Adapter/ViewModel |
| `ClientImportHistory.tsx` | ClientImportHistory.tsx | Firebase (Direct) | SAFE | Encapsular em Adapter/ViewModel |
| `ClientImportHistory.tsx` | ClientImportHistory.tsx | Firebase (Direct) | SAFE | Encapsular em Adapter/ViewModel |
| `ClientUserManager.tsx` | ClientUserManager.tsx | Firebase | SAFE | Encapsular em Adapter/ViewModel |
| `ClientUserManager.tsx` | ClientUserManager.tsx | Firebase (Direct) | SAFE | Encapsular em Adapter/ViewModel |

## 3. Plano para Batch 2B
Proponho executarmos **no máximo 3 correções SAFE** deste top 10.
