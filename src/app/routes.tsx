import type { User } from 'firebase/auth';
import { DashboardPage } from '../components/pages/DashboardPage';
import { IndicatorsPage } from '../components/pages/IndicatorsPage';
import { DREPage } from '../components/pages/DREPage';
import { BalanceSheetPage } from '../components/pages/BalanceSheetPage';
import { CashFlowPage } from '../components/pages/CashFlowPage';
import { DadosHistoricosPage } from '../components/pages/DadosHistoricosPage';
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
import { DreGerencialPage } from '../components/pages/DreGerencialPage';
import { FinancialModelingPage } from '../components/pages/FinancialModelingPage';
import { PayablesPage } from '../components/pages/PayablesPage';
import { FinancialPositionPage } from '../components/pages/FinancialPositionPage';
import { PurchasingPage } from '../components/pages/PurchasingPage';
import { ReceivablesPage } from '../components/pages/ReceivablesPage';
import { PortfolioPage } from '../components/pages/PortfolioPage';
import { LoanInvestmentSimPage } from '../components/pages/LoanInvestmentSimPage';
import { DiretrizesPage } from '../components/pages/DiretrizesPage';
import { DiagnosticoPage } from '../components/pages/DiagnosticoPage';
import { OKRsPage } from '../components/pages/OKRsPage';
import { PrecificacaoPage } from '../components/pages/PrecificacaoPage';
import { RelatorioExecutivoPage } from '../components/pages/RelatorioExecutivoPage';
import PayrollDashboard from '../components/PayrollDashboard';
import { GovernanceDashboardPage } from '../components/pages/GovernanceDashboardPage';
import { MarketingComercialPage } from '../components/pages/MarketingComercialPage';
import { OperacionalPage } from '../components/pages/OperacionalPage';
import { AdministrativaPage } from '../components/pages/AdministrativaPage';
import { ControladoriaPage } from '../components/pages/ControladoriaPage';
import { DesenvolvimentoHumanoPage } from '../components/pages/DesenvolvimentoHumanoPage';
import { PlanoEstrategicoGlobalPage } from '../components/pages/PlanoEstrategicoGlobalPage';
import { CompliancePage } from '../components/pages/CompliancePage';
import { AnaliseMercadoPage } from '../components/pages/AnaliseMercadoPage';
import { InteligenciaSacerdotalPage } from '../components/pages/InteligenciaSacerdotalPage';
import { AxisDashboardPage } from '../components/pages/AxisDashboardPage';
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
  } = ctx;

  if (currentPage === 'portfolio') {
    return (
      <PortfolioPage
        clients={clients}
        onSelectClient={(id: string, targetPage: Page = 'dashboard') => {
          setSelectedClient(id);
          setCurrentPage(targetPage);
        }}
      />
    );
  }
  if (currentPage === 'dashboard') {
    return <DashboardPage clients={clients} selectedClient={selectedClient} setSelectedClient={setSelectedClient} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />;
  }
  if (currentPage === 'indicadores') {
    return <IndicatorsPage clients={clients} selectedClient={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
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
  if (currentPage === 'contas_pagar') {
    return <PayablesPage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'contas_receber') {
    return <ReceivablesPage clients={clients} selectedClient={selectedClient} />;
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
    return <GovernanceDashboardPage clientId={selectedClient} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'diretrizes') {
    return <DiretrizesPage clientId={selectedClient} />;
  }
  if (currentPage === 'diagnostico') {
    return <DiagnosticoPage clientId={selectedClient} />;
  }
  if (currentPage === 'okrs') {
    return <OKRsPage clientId={selectedClient} />;
  }
  if (currentPage === 'precificacao') {
    return <PrecificacaoPage clientId={selectedClient} />;
  }
  if (currentPage === 'relatorio_executivo') {
    return <RelatorioExecutivoPage clientId={selectedClient} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
  }
  if (currentPage === 'plano_acao') {
    return <PlanoAcaoPage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'tax_reform_impact') {
    return <TaxReformImpactPage clients={clients} selectedClient={selectedClient} />;
  }
  if (currentPage === 'simulador_capital') {
    return <LoanInvestmentSimPage clientId={selectedClient} />;
  }
  if (currentPage === 'viabilidade') {
    return <ViabilityPage selectedClient={selectedClient} clients={clients} />;
  }
  if (currentPage === 'emprestimos') {
    return <LoansPage clients={clients} selectedClient={selectedClient} />;
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
  if (currentPage === 'dados_historicos') {
    return <DadosHistoricosPage clients={clients} user={user} selectedClient={selectedClient} setSelectedClient={setSelectedClient} />;
  }
  if (currentPage === 'clientes' || (currentPage as string) === 'clientes_root') {
    return <ClientsPage clients={clients} setClients={setClients} setSelectedClient={setSelectedClient} />;
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
  if (currentPage === 'plano_estrategico_global') {
    return <PlanoEstrategicoGlobalPage clientId={selectedClient} />;
  }
  if (currentPage === 'compliance_page') {
    return <CompliancePage clientId={selectedClient} />;
  }
  if (currentPage === 'analise_mercado') {
    return <AnaliseMercadoPage clientId={selectedClient} />;
  }
  if (currentPage === 'inteligencia_sacerdotal') {
    return <InteligenciaSacerdotalPage clientId={selectedClient} />;
  }
  if (currentPage === 'dashboard_marketing') {
    return <AxisDashboardPage axis="Marketing" clientId={selectedClient} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'dashboard_comercial') {
    return <AxisDashboardPage axis="Comercial" clientId={selectedClient} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'dashboard_cultura') {
    return <AxisDashboardPage axis="Cultura" clientId={selectedClient} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'dashboard_inovacao') {
    return <AxisDashboardPage axis="Inovação" clientId={selectedClient} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'dashboard_operacional') {
    return <AxisDashboardPage axis="Operacional" clientId={selectedClient} onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'dashboard_gestao') {
    return <AxisDashboardPage axis="Gestão" clientId={selectedClient} onNavigate={setCurrentPage} />;
  }

  return null;
}
