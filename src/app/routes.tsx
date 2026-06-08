import type { User } from 'firebase/auth';
import { DashboardPage } from '../components/pages/DashboardPage';
import { IndicatorsPage } from '../components/pages/IndicatorsPage';
import { DREPage } from '../components/pages/DREPage';
import { BalanceSheetPage } from '../components/pages/BalanceSheetPage';
import { CashFlowPage } from '../components/pages/CashFlowPage';
import { PremissasClientePage } from '../components/pages/PremissasClientePage';
import { PremissasTributariasPage } from '../components/pages/PremissasTributariasPage';
import { PremissasEconomicasPage } from '../components/pages/PremissasEconomicasPage';
import { TaxReformImpactPage } from '../components/pages/TaxReformImpactPage';
import { PlanoDeContasPage } from '../components/pages/PlanoDeContasPage';
import { ViabilityPage } from '../components/pages/ViabilityPage';
import { LoansPage } from '../components/pages/LoansPage';
import { ClientsPage } from '../components/pages/ClientsPage';
import { FiscalTributarioPage } from '../components/pages/FiscalTributarioPage';
import { QuadroPessoalPage } from '../components/pages/QuadroPessoalPage';
import { ValuationPage } from '../components/pages/ValuationPage';
import { AdvisoryInsightsPage } from '../components/pages/AdvisoryInsightsPage';
import { PlanoAcaoPage } from '../components/pages/PlanoAcaoPage';
import { AnaliseFinanceiraPage } from '../components/pages/AnaliseFinanceiraPage';
import { DLPAPage } from '../components/pages/DLPAPage';
import { DFCPage } from '../components/pages/DFCPage';
import { EFOSPage } from '../components/pages/EFOSPage';
import { DreGerencialPage } from '../components/pages/DreGerencialPage';
import { FinancialModelingPage } from '../components/pages/FinancialModelingPage';
import { PayablesPage } from '../components/pages/PayablesPage';
import { FinancialPositionPage } from '../components/pages/FinancialPositionPage';
import { PurchasingPage } from '../components/pages/PurchasingPage';
import { ReceivablesPage } from '../components/pages/ReceivablesPage';
import { PortfolioPage } from '../components/pages/PortfolioPage';
import { LoanInvestmentSimPage } from '../components/pages/LoanInvestmentSimPage';
import { AssetManagementPage } from '../components/pages/AssetManagementPage';
import { DiretrizesPage } from '../components/pages/DiretrizesPage';
import { DiagnosticoPage } from '../components/pages/DiagnosticoPage';
import { OKRsPage } from '../components/pages/OKRsPage';
import { PrecificacaoPage } from '../components/pages/PrecificacaoPage';
import { RelatorioExecutivoPage } from '../components/pages/RelatorioExecutivoPage';
import { StrategicSimulatorPage } from '../components/pages/StrategicSimulatorPage';
import PayrollDashboard from '../components/PayrollDashboard';
import { GovernanceDashboardPage } from '../components/pages/GovernanceDashboardPage';
import { MarketingComercialPage } from '../components/pages/MarketingComercialPage';
import { OperacionalPage } from '../components/pages/OperacionalPage';
import { AdministrativaPage } from '../components/pages/AdministrativaPage';
import { ControladoriaPage } from '../components/pages/ControladoriaPage';
import { FinancialAdminDashboard } from '../components/pages/FinancialAdminDashboard';
import { DesenvolvimentoHumanoPage } from '../components/pages/DesenvolvimentoHumanoPage';
import { PlanoEstrategicoGlobalPage } from '../components/pages/PlanoEstrategicoGlobalPage';
import { CompliancePage } from '../components/pages/CompliancePage';
import { AnaliseMercadoPage } from '../components/pages/AnaliseMercadoPage';
import { InteligenciaGovernancaPage } from '../components/pages/InteligenciaGovernancaPage';
import { AxisDashboardPage } from '../components/pages/AxisDashboardPage';
import { ProfilePage } from '../components/pages/ProfilePage';
import { PreferencesPage } from '../components/pages/PreferencesPage';
import { MessagesPage } from '../components/pages/MessagesPage';
import { AcademyHomePage } from '../components/pages/academy/AcademyHomePage';
import { CourseDetailsPage } from '../components/pages/academy/CourseDetailsPage';
import { LessonPlayerPage } from '../components/pages/academy/LessonPlayerPage';
import { AdminAcademyDashboard } from '../components/pages/academy/AdminAcademyDashboard';
import { AcademyAdminCoursePage } from '../components/pages/academy/AcademyAdminCoursePage';
import { EstruturaGovernancaPage } from '../components/pages/EstruturaGovernancaPage';
import { LeadershipProfilePage } from '../components/pages/LeadershipProfilePage';
import { MaintenancePage } from '../components/pages/MaintenancePage';
import { SystemicIntelligencePage } from '../components/pages/SystemicIntelligencePage';
import { MeetingMinutesPage } from '../components/pages/MeetingMinutesPage';
import { AvaliacaoOrganogramaPage } from '../components/pages/AvaliacaoOrganogramaPage';
import { CulturaFeedbackPage } from '../components/pages/CulturaFeedbackPage';
import { PartnersPage } from '../components/pages/PartnersPage';
import { ReferralProgramPage } from '../components/pages/public/ReferralProgramPage';
import { OrcamentoPage } from '../components/pages/OrcamentoPage';
import { DadosHistoricosPage } from '../components/pages/DadosHistoricosPage';
import { SupportPage } from '../components/pages/SupportPage';
import { CleanupTool } from '../components/pages/CleanupTool';
import { GestaoUsuariosPage } from '../components/pages/admin/GestaoUsuariosPage';
import { ExecutiveScenarioLabPage } from '../components/pages/ExecutiveScenarioLabPage';
import { ConsolidatedGroupAdminPage } from '../components/pages/ConsolidatedGroupAdminPage';
import { RuntimeObservabilityPage } from '../components/pages/RuntimeObservabilityPage';
import { ScenarioLabPage } from '../components/pages/ScenarioLabPage';
import { InstitutionalReportsPage } from '../components/pages/InstitutionalReportsPage';
import { AdvisorCockpitPage } from '../components/pages/AdvisorCockpitPage';
import { TenantGovernancePage } from '../components/pages/TenantGovernancePage';
import { RuntimePerformancePage } from '../components/pages/RuntimePerformancePage';
import { InstitutionalCopilotPage } from '../components/pages/InstitutionalCopilotPage';
import { InstitutionalMonitoringPage } from '../components/pages/InstitutionalMonitoringPage';
import { DecisionGovernancePage } from '../components/pages/DecisionGovernancePage';
import { InstitutionalIntegrationsPage } from '../components/pages/InstitutionalIntegrationsPage';
import { InstitutionalBenchmarkingPage } from '../components/pages/InstitutionalBenchmarkingPage';
import { ProductGovernancePage } from '../components/pages/ProductGovernancePage';
import { InstitutionalKnowledgeGraphPage } from '../components/pages/InstitutionalKnowledgeGraphPage';
import { EarlyWarningPage } from '../components/pages/EarlyWarningPage';
import { ConsolidatedExecutivePage } from '../components/pages/ConsolidatedExecutivePage';
import { ConsolidatedExecutiveProvider } from '../context/ConsolidatedExecutiveContext';
import { StrategicIntelligenceCenter } from '../components/pages/mock/StrategicIntelligenceCenter';
import { StrategicSimulationPage } from '../components/pages/StrategicSimulationPage';
import { BoardDeckCenter } from '../components/pages/governance/BoardDeckCenter';
import { InstitutionalObservabilityCenter } from '../components/pages/governance/InstitutionalObservabilityCenter';

import { GovernanceRiskHeatmap } from '../components/pages/governance/GovernanceRiskHeatmap';
import { FiduciaryGovernanceCenter } from '../components/pages/governance/FiduciaryGovernanceCenter';
import { ComplianceIntegrityCenter } from '../components/pages/governance/ComplianceIntegrityCenter';
import { GovernanceOrchestrationPage } from '../components/pages/GovernanceOrchestrationPage';
import { InstitutionalIOSPage } from '../components/pages/InstitutionalIOSPage';
import { StrategicWarRoomPage } from '../components/pages/StrategicWarRoomPage';
import { EnterpriseValidationPage } from '../components/pages/EnterpriseValidationPage';
import { RealityValidationPage } from '../components/pages/RealityValidationPage';
import { PilotMonitoringDashboard } from '../components/pages/PilotMonitoringDashboard';
import { PilotOperationsCenter } from '../components/pilot-operations/PilotOperationsCenter';
import { PilotOperationsProvider } from '../context/pilot-operations/PilotOperationsProvider';
import { CalibrationPlayground } from '../components/pages/CalibrationPlayground';
import { AdvisorWorkspacePage } from '../components/pages/AdvisorWorkspacePage';
import { ClientExecutiveWorkspace } from '../components/pages/ClientExecutiveWorkspace';
import { PilotExperienceDashboard } from '../components/pages/PilotExperienceDashboard';
// Removed missing ObservabilityConsolePage import
import { ExecutiveMonitoringCenter } from '../components/pages/governance/ExecutiveMonitoringCenter';
import { GovernanceMaturityCenter } from '../components/pages/governance/GovernanceMaturityCenter';
import { ESGIMAssessmentPage } from '../components/pages/governance/ESGIMAssessmentPage';
import { FiduciaryValidationCenter } from '../components/pages/governance/FiduciaryValidationCenter';
import { EconomicNormalizationCenter } from '../components/pages/governance/EconomicNormalizationCenter';
import { CapitalGovernanceCenter } from '../components/pages/governance/CapitalGovernanceCenter';
import { FinancialLineageCenter } from '../components/pages/governance/FinancialLineageCenter';
import { CreditCommitteeCenter } from '../components/pages/governance/CreditCommitteeCenter';
import { InstitutionalMemoryCenter } from '../components/pages/governance/InstitutionalMemoryCenter';
import { LeadershipDNACenter } from '../components/pages/governance/LeadershipDNACenter';
import { InstitutionalStructureCenter } from '../components/pages/governance/InstitutionalStructureCenter';
import { RiskExposureCenter } from '../components/pages/governance/RiskExposureCenter';
import { DecisionLifecycleCenter } from '../components/pages/governance/DecisionLifecycleCenter';
import { SovereignDecisionCenter } from '../components/pages/governance/SovereignDecisionCenter';
import { ExecutiveExecutionCenter } from '../components/pages/governance/ExecutiveExecutionCenter';
import { CrisisResponseCenter } from '../components/pages/governance/CrisisResponseCenter';
import { MultiTenantGovernanceCenter } from '../components/pages/governance/MultiTenantGovernanceCenter';
import { InstitutionalWarRoomPage } from '../components/war-gaming/InstitutionalWarRoomPage';
import { InstitutionalPressureDashboard } from '../components/operating-pressure/InstitutionalPressureDashboard';
import { InstitutionalContinuityCockpitPage } from '../components/pages/InstitutionalContinuityCockpitPage';
import { InstitutionalDeploymentReadinessPage } from '../components/pages/InstitutionalDeploymentReadinessPage';
import { DemoContinuityCockpitPage } from '../demo-runtime/DemoContinuityCockpitPage';
import { DemoScenarioProvider } from '../demo-runtime/DemoScenarioProvider';
import { InstitutionalExecutiveCommandCenter } from '../components/executive-command/InstitutionalExecutiveCommandCenter';
import { InstitutionalOnboardingControlCenterPage } from '../components/pages/InstitutionalOnboardingControlCenterPage';
import { InstitutionalStrategicIntelligencePage } from '../components/pages/InstitutionalStrategicIntelligencePage';
import { InstitutionalBoardPackPage } from '../components/pages/InstitutionalBoardPackPage';

import type { Page } from './navigation';

interface RouteRenderContext {
  currentPage: Page;
  clients: any[];
  selectedClient: string;
  setSelectedClient: (id: string) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  user: User | null;
  setCurrentPage: (page: Page) => void;
  setClients: (clients: any[]) => void;
  academyCourseId: string;
  setAcademyCourseId: (id: string) => void;
  isPartner?: boolean;
  isMaster?: boolean;
  userPartnerIds?: string[];
}

export function renderCurrentPage(ctx: RouteRenderContext) {
  const {
    currentPage,
    clients,
    selectedClient,
    setSelectedClient,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    user,
    setCurrentPage,
    setClients,
    academyCourseId,
    setAcademyCourseId,
    isPartner,
    isMaster,
    userPartnerIds,
  } = ctx;

  if (currentPage === 'portfolio') {
    return (
      <PortfolioPage
        clients={clients}
        isPartner={isPartner}
        userPartnerIds={userPartnerIds}
        onSelectClient={(id: string, targetPage: Page = 'efos') => {
          setSelectedClient(id);
          setCurrentPage(targetPage);
        }}
      />
    );
  }
  if (currentPage === 'consolidated_executive') {
    return (
      <ConsolidatedExecutiveProvider>
        <div className="bg-background min-h-screen">
          <ConsolidatedExecutivePage />
        </div>
      </ConsolidatedExecutiveProvider>
    );
  }
  if (currentPage === 'efos') {
    return (
      <EFOSPage 
        clients={clients}
        selectedClient={selectedClient} 
        setSelectedClient={setSelectedClient} 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
        selectedYear={selectedYear} 
        setSelectedYear={setSelectedYear}
        onNavigate={setCurrentPage}
      />
    );
  }
  if (currentPage === 'indicadores') {
    return <IndicatorsPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'dados_historicos') {
    return (
      <DadosHistoricosPage 
        clients={clients} 
        user={user} 
        selectedClient={selectedClient} 
        setSelectedClient={setSelectedClient} 
      />
    );
  }
  if (currentPage === 'aprovacoes') {
    return (
      <DadosHistoricosPage 
        clients={clients} 
        user={user} 
        selectedClient={selectedClient} 
        setSelectedClient={setSelectedClient}
        isApprovalMode={true}
      />
    );
  }
  if (currentPage === 'dre') {
    return <DREPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'dre_gerencial') {
    return <DreGerencialPage selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'bp') {
    return <BalanceSheetPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'dlpa') {
    return <DLPAPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'caixa') {
    return <CashFlowPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'posicao_financeira') {
    return <FinancialPositionPage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'ativos_financeiros') {
    return <AssetManagementPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'contas_pagar') {
    return <PayablesPage clients={clients} selectedClient={selectedClient} isMaster={isMaster} />;
  }
  if (currentPage === 'contas_receber') {
    return <ReceivablesPage clients={clients} selectedClient={selectedClient} isMaster={isMaster} />;
  }
  if (currentPage === 'compras') {
    return <PurchasingPage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'dfc') {
    return <DFCPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'advisory_insights') {
    return <AdvisoryInsightsPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'governanca_estrategica') {
    return <GovernanceDashboardPage clientId={selectedClient} onNavigate={setCurrentPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'diretrizes') {
    return <DiretrizesPage clientId={selectedClient} />;
  }
  if (currentPage === 'diagnostico') {
    return <DiagnosticoPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'planejamento_estrategico') {
    return <PlanoEstrategicoGlobalPage clientId={selectedClient} />;
  }
  if (currentPage === 'precificacao') {
    return <PrecificacaoPage clientId={selectedClient} />;
  }
  if (currentPage === 'relatorio_executivo') {
    return <RelatorioExecutivoPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'estrutura_governanca') {
    return <EstruturaGovernancaPage clientId={selectedClient} />;
  }
  if (currentPage === 'plano_acao') {
    return <PlanoAcaoPage clientId={selectedClient} />;
  }
  if (currentPage === 'tax_reform_impact') {
    return <TaxReformImpactPage clientId={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'simulador_capital') {
    return <LoanInvestmentSimPage clientId={selectedClient} />;
  }
  if (currentPage === 'simulador_estrategico') {
    return <StrategicSimulatorPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'viabilidade') {
    return <ViabilityPage selectedClient={selectedClient} clients={clients} />;
  }
  if (currentPage === 'emprestimos') {
    return <LoansPage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'orcamento') {
    return <OrcamentoPage selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'analise_financeira') {
    return <AnaliseFinanceiraPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'valuation') {
    return <ValuationPage clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'modelagem') {
    return <FinancialModelingPage clients={clients} selectedClient={selectedClient} setSelectedClient={setSelectedClient} />;
  }
  if (currentPage === 'clientes' || (currentPage as string) === 'clientes_root') {
    return (
      <ClientsPage 
        clients={clients} 
        setClients={setClients} 
        setSelectedClient={setSelectedClient} 
        isMaster={isMaster} 
        isPartner={isPartner}
        userPartnerIds={userPartnerIds}
      />
    );
  }
  if (currentPage === 'parceiros') {
    return (
      <PartnersPage 
        clients={clients} 
        setClients={setClients} 
        setSelectedClient={setSelectedClient}
        isMaster={isMaster}
      />
    );
  }
  if (currentPage === 'plano_contas') {
    return <PlanoDeContasPage clients={clients} selectedClient={selectedClient} planType="accounting" />;
  }
  if (currentPage === 'plano_contas_gerencial') {
    return <PlanoDeContasPage clients={clients} selectedClient={selectedClient} planType="managerial" />;
  }
  if (currentPage === 'premissas_cliente') {
    return <PremissasClientePage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'premissas_tributarias') {
    return <PremissasTributariasPage clients={clients} />;
  }
  if (currentPage === 'premissas_economicas') {
    return <PremissasEconomicasPage />;
  }
  if (currentPage === 'fiscal_tributario') {
    return <FiscalTributarioPage clientId={selectedClient} />;
  }
  if (currentPage === 'quadro_pessoal') {
    return <QuadroPessoalPage clientId={selectedClient} />;
  }
  if (currentPage === 'custos_pessoal' || currentPage === 'pessoal') {
    return <PayrollDashboard clientId={selectedClient} />;
  }
  if (currentPage === 'marketing_estrategico') {
    return <MarketingComercialPage type="marketing" clientId={selectedClient} />;
  }
  if (currentPage === 'comercial_estrategico') {
    return <MarketingComercialPage type="comercial" clientId={selectedClient} />;
  }
  if (currentPage === 'logistica') {
    return <OperacionalPage type="logistica" clientId={selectedClient} />;
  }
  if (currentPage === 'producao') {
    return <OperacionalPage type="producao" clientId={selectedClient} />;
  }
  if (currentPage === 'administrativa_indicadores') {
    return <AdministrativaPage clientId={selectedClient} />;
  }
  if (currentPage === 'controladoria_estrategica') {
    return <ControladoriaPage clientId={selectedClient} />;
  }
  if (currentPage === 'desenvolvimento_humano') {
    return <DesenvolvimentoHumanoPage clientId={selectedClient} />;
  }
  if (currentPage === 'perfil_lideranca') {
    return <LeadershipProfilePage clientId={selectedClient} />;
  }
  if (currentPage === 'avaliacao_organograma') {
    return <AvaliacaoOrganogramaPage clientId={selectedClient} />;
  }
  if (currentPage === 'cultura_feedback') {
    return <CulturaFeedbackPage clientId={selectedClient} />;
  }

  if (currentPage === 'compliance_page') {
    return <CompliancePage clientId={selectedClient} />;
  }
  if (currentPage === 'analise_mercado') {
    return <AnaliseMercadoPage clientId={selectedClient} />;
  }
  if (currentPage === 'inteligencia_governanca') {
    return <InteligenciaGovernancaPage clientId={selectedClient} />;
  }
  if (currentPage === 'inteligencia_sistemica') {
    return <SystemicIntelligencePage clientId={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'atas_reuniao') {
    return <MeetingMinutesPage clientId={selectedClient} />;
  }
  if (currentPage === 'dashboard_marketing') {
    return <AxisDashboardPage axis="Gestão de Marketing" clientId={selectedClient} onNavigate={setCurrentPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'dashboard_comercial') {
    return <AxisDashboardPage axis="Gestão Comercial" clientId={selectedClient} onNavigate={setCurrentPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'dashboard_cultura') {
    return <AxisDashboardPage axis="Cultura Organizacional" clientId={selectedClient} onNavigate={setCurrentPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'dashboard_inovacao') {
    return <AxisDashboardPage axis="Gestão de Inovação" clientId={selectedClient} onNavigate={setCurrentPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'dashboard_operacional') {
    return (
      <AxisDashboardPage 
        axis="Gestão Operacional" 
        clientId={selectedClient} 
        onNavigate={setCurrentPage}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    );
  }
  if (currentPage === 'dashboard_gestao') {
    return (
      <FinancialAdminDashboard 
        clientId={selectedClient} 
        onNavigate={setCurrentPage} 
        selectedMonth={selectedMonth} 
        setSelectedMonth={setSelectedMonth} 
        selectedYear={selectedYear} 
        setSelectedYear={setSelectedYear} 
      />
    );
  }
  if (currentPage === 'perfil_usuario') {
    return <ProfilePage user={user} clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'gestao_usuarios') {
    return <GestaoUsuariosPage setSelectedClient={setSelectedClient} setCurrentPage={setCurrentPage} />;
  }
  if (currentPage === 'configuracoes_sistema') {
    return <PreferencesPage />;
  }
  if (currentPage === 'mensagens') {
    return <MessagesPage />;
  }
  if (currentPage === 'suporte') {
    return <SupportPage selectedClient={selectedClient} isMaster={isMaster} user={user} />;
  }
  if (currentPage === 'academy_home') {
    return <AcademyHomePage onNavigate={(page, params) => {
      if (params?.courseId) {
        setAcademyCourseId(params.courseId);
      }
      setCurrentPage(page);
    }} />;
  }
  if (currentPage === 'academy_course') {
    return <CourseDetailsPage 
      courseId={academyCourseId} 
      onBack={() => setCurrentPage('academy_home')}
      onStart={(id) => {
        setAcademyCourseId(id);
        setCurrentPage('academy_player');
      }}
    />;
  }
  if (currentPage === 'academy_player') {
    return <LessonPlayerPage 
      courseId={academyCourseId} 
      userId={user?.uid || ''}
      clientId={selectedClient}
      onBack={() => setCurrentPage('academy_home')}
    />;
  }
  if (currentPage === 'academy_admin') {
    return <AdminAcademyDashboard 
      onCreateCourse={() => {
        setAcademyCourseId('');
        setCurrentPage('academy_admin_course');
      }}
      onEditCourse={(id) => {
        setAcademyCourseId(id);
        setCurrentPage('academy_admin_course');
      }}
    />;
  }
  if (currentPage === 'academy_admin_course') {
    return <AcademyAdminCoursePage 
      courseId={academyCourseId} 
      onBack={() => setCurrentPage('academy_admin')}
    />;
  }
  if (currentPage === 'maintenance') {
    return <MaintenancePage clients={clients} />;
  }
  if (currentPage === 'cleanup') {
    return <CleanupTool />;
  }
  if (currentPage === 'executive_scenario_lab' || currentPage === 'lab') {
    return <ExecutiveScenarioLabPage />;
  }
  if (currentPage === 'admin_grupos' && isMaster) {
    return <ConsolidatedGroupAdminPage />;
  }
  if (currentPage === 'runtime_observability' && isMaster) {
    return <RuntimeObservabilityPage />;
  }
  if (currentPage === 'scenario_lab' && isMaster) {
    return <ScenarioLabPage />;
  }
  if (currentPage === 'institutional_reports' && isMaster) {
    return <InstitutionalReportsPage />;
  }
  if (currentPage === 'advisor_cockpit' && isMaster) {
    return <AdvisorCockpitPage />;
  }
  if (currentPage === 'tenant_governance' && isMaster) {
    return <TenantGovernancePage />;
  }
  if (currentPage === 'runtime_performance' && isMaster) {
    return <RuntimePerformancePage />;
  }
  if (currentPage === 'institutional_copilot' && isMaster) {
    return <InstitutionalCopilotPage />;
  }
  if (currentPage === 'institutional_monitoring' && isMaster) {
    return <InstitutionalMonitoringPage />;
  }
  if (currentPage === 'decision_governance' && isMaster) {
    return <DecisionGovernancePage />;
  }
  if (currentPage === 'institutional_integrations' && isMaster) {
    return <InstitutionalIntegrationsPage />;
  }
  if (currentPage === 'institutional_benchmarking' && isMaster) {
    return <InstitutionalBenchmarkingPage />;
  }
  if (currentPage === 'product_governance' && isMaster) {
    return <ProductGovernancePage />;
  }
  if (currentPage === 'institutional_knowledge_graph' && isMaster) {
    return <InstitutionalKnowledgeGraphPage />;
  }
  if (currentPage === 'early_warning' && isMaster) {
    return <EarlyWarningPage />;
  }
  if (currentPage === 'strategic_simulation' && isMaster) {
    return <StrategicSimulationPage />;
  }
  if (currentPage === 'governance_orchestration' && isMaster) {
    return <GovernanceOrchestrationPage />;
  }
  if (currentPage === 'institutional_ios' && isMaster) {
    return <InstitutionalIOSPage />;
  }
  if (currentPage === 'enterprise_validation' && isMaster) {
    return <EnterpriseValidationPage />;
  }
  if (currentPage === 'reality_validation' && isMaster) {
    return <RealityValidationPage />;
  }
  if (currentPage === 'strategic_intelligence_center') {
    return <StrategicIntelligenceCenter />;
  }
  if (currentPage === 'strategic_war_room') {
    return <StrategicWarRoomPage selectedClient={selectedClient} contextData={{}} />;
  }
  if (currentPage === 'board_deck_center') {
    return <BoardDeckCenter onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'institutional_observability_center') {
    return <InstitutionalObservabilityCenter />;
  }

  if (currentPage === 'governance_risk_heatmap') {
    return <GovernanceRiskHeatmap />;
  }
  if (currentPage === 'fiduciary_governance_center') {
    return <FiduciaryGovernanceCenter />;
  }
  if (currentPage === 'compliance_integrity_center') {
    return <ComplianceIntegrityCenter />;
  }
  if (currentPage === 'operating_pressure') {
    return <InstitutionalPressureDashboard clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'executive_command') {
    return <InstitutionalExecutiveCommandCenter clientId={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'institutional_continuity') {
    return <InstitutionalContinuityCockpitPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'demo_continuity') {
    return (
      <DemoScenarioProvider>
        <DemoContinuityCockpitPage />
      </DemoScenarioProvider>
    );
  }
  if (currentPage === 'deployment_readiness') {
    return <InstitutionalDeploymentReadinessPage />;
  }
  if (currentPage === 'institutional_onboarding') {
    return <InstitutionalOnboardingControlCenterPage />;
  }
  if (currentPage === 'strategic_intelligence') {
    return <InstitutionalStrategicIntelligencePage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'institutional_board_pack') {
    return <InstitutionalBoardPackPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }
  if (currentPage === 'pilot_monitoring') {
    return <PilotMonitoringDashboard />;
  }
  if (currentPage === 'pilot_operations_center' && isMaster) {
    return (
      <PilotOperationsProvider>
        <PilotOperationsCenter />
      </PilotOperationsProvider>
    );
  }
  if (currentPage === 'calibration_playground') {
    return <CalibrationPlayground />;
  }
  if (currentPage === 'observability_console') {
    return <RuntimeObservabilityPage />;
  }
  if (currentPage === 'advisor_workspace') {
    return <AdvisorWorkspacePage selectedClient={selectedClient} />;
  }
  if (currentPage === 'client_workspace') {
    return <ClientExecutiveWorkspace selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'pilot_experience') {
    return <PilotExperienceDashboard selectedClient={selectedClient} />;
  }

  
  if (currentPage === 'executive_monitoring_center') {
    return <ExecutiveMonitoringCenter clientId={selectedClient} onNavigate={setCurrentPage} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'esgim_assessment') {
    return <ESGIMAssessmentPage clientId={selectedClient} />;
  }
  if (currentPage === 'governance_maturity_center') {
    return <GovernanceMaturityCenter clientId={selectedClient} />;
  }
  if (currentPage === 'capital_governance_center') {
    return <CapitalGovernanceCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'fiduciary_validation_center') {
    return <FiduciaryValidationCenter />;
  }
  if (currentPage === 'economic_normalization_center') {
    return <EconomicNormalizationCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'credit_committee_center') {
    return <CreditCommitteeCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'institutional_memory_center') {
    return <InstitutionalMemoryCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'leadership_dna_center') {
    return <LeadershipDNACenter clientId={selectedClient} />;
  }
  if (currentPage === 'institutional_structure_center') {
    return <InstitutionalStructureCenter />;
  }
  if (currentPage === 'risk_exposure_center') {
    return <RiskExposureCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'decision_lifecycle_center') {
    return <DecisionLifecycleCenter />;
  }
  if (currentPage === 'sovereign_decision_center') {
    return <SovereignDecisionCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'financial_lineage_center') {
    return <FinancialLineageCenter selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'executive_execution_center') {
    return <ExecutiveExecutionCenter clients={clients} selectedClient={selectedClient} selectedYear={selectedYear} />;
  }
  if (currentPage === 'crisis_response_center' && isMaster) {
    return <CrisisResponseCenter />;
  }

  if (currentPage === 'multi_tenant_governance_center' && isMaster) {
    return <MultiTenantGovernanceCenter />;
  }

  if ((currentPage as string) === 'referral_program') {
    return <ReferralProgramPage />;
  }

  return null;
}
