import {
  Activity,
  ArrowRightLeft,
  ArrowUpRight,
  BarChart2,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  Calculator,
  CalendarDays,
  ChartNoAxesCombined,
  CheckSquare,
  CircleDollarSign,
  ClipboardList,
  Coins,
  Compass,
  Cpu,
  CreditCard,
  Database,
  DatabaseBackup,
  DollarSign,
  Eye,
  Factory,
  FileSearch,
  FileText,
  Fingerprint,
  FlaskConical,
  GanttChart,
  Gauge,
  Gem,
  GitBranchPlus,
  GitGraph,
  Globe,
  GraduationCap,
  Handshake,
  HardDrive,
  HeartPulse,
  History,
  Landmark,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Lightbulb,
  LineChart,
  List,
  Magnet,
  Map,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Monitor,
  Network,
  PackageCheck,
  Percent,
  PieChart,
  PiggyBank,
  PlugZap,
  Presentation,
  Radar,
  Rocket,
  Scale,
  Settings,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Siren,
  Sparkles,
  Star,
  Tags,
  Target,
  TrendingUp,
  Type,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
  Waypoints,
  Zap,
  ArrowUpRightSquare,
  type LucideIcon
} from 'lucide-react';

export type Page =

  | 'executive_monitoring_center'
  | 'esgim_assessment'
  | 'governance_maturity_center'
  | 'fiduciary_validation_center'
  | 'economic_normalization_center'
  | 'capital_governance_center'
  | 'financial_lineage_center'
  | 'credit_committee_center'
  | 'institutional_memory_center'
  | 'leadership_dna_center'
  | 'institutional_structure_center'
  | 'risk_exposure_center'
  | 'decision_lifecycle_center'
  | 'sovereign_decision_center'
  | 'executive_execution_center'
  | 'crisis_response_center'
  | 'runtime_observability_center'
  | 'product_governance_center'
  | 'multi_tenant_governance_center'
  | 'advisor_cockpit'
  | 'tenant_governance'
  | 'runtime_performance'
  | 'institutional_copilot'
  | 'institutional_monitoring'
  | 'decision_governance'
  | 'institutional_integrations'
  | 'institutional_benchmarking'
  | 'product_governance'
  | 'institutional_knowledge_graph'
  | 'early_warning'
  | 'strategic_simulation'
  | 'governance_orchestration'
  | 'institutional_ios'
  | 'executive_command'
  | 'operational_governance'
  | 'strategic_governance'
  | 'institutional_board_pack'
  | 'institutional_continuity'
  | 'deployment_readiness'
  | 'institutional_onboarding'
  | 'enterprise_validation'
  | 'reality_validation'
  | 'institutional_reports'

  | 'partner_brand_configuration'
  | 'runtime_observability'
  | 'admin_grupos'
  | 'consolidated_executive'
  | 'board_governance'
  | 'ceo.executive-overview'
  | 'ceo.strategic-performance'
  | 'ceo.growth-governance'
  | 'ceo.risk-overview'
  | 'ceo.strategic-domains'
  | 'ceo.decision-governance'
  | 'coo.operations'
  | 'coo.supply-chain'
  | 'coo.procurement'
  | 'commercial.commercial-execution'
  | 'commercial.market-customer'
  | 'commercial.partner-ecosystem'
  | 'commercial.revenue-forecast'
  | 'commercial.decision-governance'
  | 'people.workforce'
  | 'people.culture'
  | 'people.leadership'
  | 'people.costs'
  | 'people.capability'
  | 'people.organizational-governance'
  | 'people.decision-governance'
  | 'governance.corporate-policies'
  | 'governance.decision-governance'
  | 'governance.institutional-alignment'
  | 'governance.decision-governance'
  | 'risk.enterprise-risk'
  | 'risk.compliance'
  | 'risk.internal-audit'
  | 'risk.decision-governance'
  | 'innovation.innovation-portfolio'
  | 'innovation.research-development'
  | 'innovation.digital-transformation'
  | 'innovation.knowledge-evolution'
  | 'innovation.decision-governance'
  | 'board.capital-governance'
  | 'board.institutional-governance'
  | 'board.leadership-oversight'
  | 'board.strategic-continuity'
  | 'board.fiduciary-governance'
  | 'enterprise.governance-hub'
  | 'enterprise.predictive-insights'
  | 'enterprise.governance-engines'
  | 'enterprise.risk-analytics'
  | 'enterprise.institutional-memory'
  | 'enterprise.decision-governance'
  | 'enterprise.financial-lineage'
  | 'foundation.master-data'
  | 'foundation.business-rules'
  | 'foundation.chart-accounts'
  | 'foundation.data-collection'
  | 'foundation.data-maintenance'
  | 'admin.identity'
  | 'admin.global-settings'
  | 'admin.workflows'
  | 'admin.branding'
  | 'admin.tenant-management'
  | 'admin.revenue'
  | 'admin.academy'
  | 'admin.runtime'
  | 'cfo.executive-dashboard'
  | 'cfo.financial-reporting'
  | 'cfo.treasury-liquidity'
  | 'cfo.working-capital'
  | 'cfo.capital-structure'
  | 'cfo.financial-performance'
  | 'cfo.fpa'
  | 'cfo.financial-governance'
  | 'commercial.executive-overview'
  | 'commercial.commercial-performance'
  | 'commercial.revenue-governance'
  | 'commercial.pipeline-governance'
  | 'commercial.opportunity-management'
  | 'commercial.customer-governance'
  | 'commercial.partner-revenue'
  | 'commercial.forecast-governance'
  | 'coo.executive-overview'
  | 'coo.process-execution'
  | 'coo.logistics-supply-chain'
  | 'coo.procurement-governance'
  | 'coo.operational-excellence'

  | 'revenue.command-center'
  | 'revenue.pipeline'
  | 'revenue.contracts'
  | 'revenue.subscriptions'
  | 'revenue.billing'
  | 'revenue.access'
  | 'revenue.tenants'
  | 'revenue.runtime'
  | 'revenue.governance'
  | 'revenue.partners'
  | 'revenue.advisors'
  | 'revenue.institutions'
  | 'revenue.deal-room'

  | 'people.executive-overview'
  | 'people.workforce-governance'
  | 'people.culture-engagement'
  | 'people.leadership-governance'
  | 'people.people-costs'
  | 'people.learning-development'
  | 'people.organizational-governance'
  | 'governance.executive-overview'
  | 'governance.strategic-alignment'
  | 'governance.decision-governance'
  | 'governance.board-governance'
  | 'governance.governance-maturity'
  | 'risk.executive-overview'
  | 'risk.risk-governance'
  | 'risk.enterprise-risk'
  | 'risk.compliance-governance'
  | 'risk.control-maturity'
  | 'risk.audit-governance'
  | 'risk.enterprise-resilience'
  | 'innovation.executive-overview'
  | 'innovation.innovation-governance'
  | 'innovation.innovation-portfolio'
  | 'innovation.opportunity-governance'
  | 'innovation.experiment-management'
  | 'innovation.digital-transformation'
  | 'innovation.knowledge-evolution'
  
  | 'platform.revenue-center'
  | 'platform.pipeline-governance'
  | 'platform.partner-center'
  | 'platform.customer-success'
  | 'platform.marketing'
  | 'platform.academy'
  | 'platform.billing'
  | 'platform.product-management'
  | 'platform.knowledge-center'
  | 'platform.platform-analytics'
  
  | 'governance.preview'

  | 'war_room'
  | 'admin'
  | 'workspace'
  | 'upload'
  | 'cleanup'
  | 'portfolio'
  | 'efos'
  | 'indicadores'
  | 'dre'
  | 'bp'
  | 'caixa'
  | 'viabilidade'
  | 'clientes'
  | 'premissas_cliente'
  | 'premissas_tributarias'
  | 'premissas_economicas'
  | 'emprestimos'
  | 'analise_financeira'
  | 'valuation'
  | 'modelagem'
  | 'dre_gerencial'
  | 'dlpa'
  | 'dfc'
  | 'pessoal'
  | 'contas_pagar'
  | 'contas_receber'
  | 'plano_contas'
  | 'plano_contas_gerencial'
  | 'compras'
  | 'posicao_financeira'
  | 'ativos_financeiros'
  | 'advisory_insights'
  | 'plano_acao'
  | 'tax_reform_impact'
  | 'simulador_capital'
  | 'diretrizes'
  | 'diagnostico'
  | 'okrs'
  | 'precificacao'
  | 'fiscal_tributario'
  | 'quadro_pessoal'
  | 'custos_pessoal'
  | 'marketing_estrategico'
  | 'comercial_estrategico'
  | 'logistica'
  | 'producao'
  | 'administrativa_indicadores'
  | 'controladoria_estrategica'

  | 'analise_mercado'

  | 'governanca_estrategica'
  | 'planejamento_estrategico'
  | 'relatorio_executivo'

  | 'dashboard_marketing'
  | 'dashboard_comercial'
  | 'dashboard_cultura'
  | 'dashboard_inovacao'
  | 'dashboard_operacional'
  | 'dashboard_gestao'
  | 'perfil_usuario'
  | 'configuracoes_sistema'
  | 'mensagens'
  | 'academy_home'
  | 'academy_course'
  | 'academy_player'
  | 'academy_admin'
  | 'academy_admin_course'
  | 'maintenance'
  | 'adm_root'
  | 'contabil_root'
  | 'financeira_root'

  | 'perfil_lideranca'
  | 'estrutura_governanca'
  | 'avaliacao_organograma'

  | 'atas_reuniao'
  | 'simulador_estrategico'
  | 'parceiros'
  | 'orcamento'
  | 'aprovacoes'
  | 'suporte'
  | 'dados_historicos'
  | 'gestao_usuarios'
  | 'executive_scenario_lab'
  | 'lab'
  | 'pilot_operations_center'

  | 'board_deck_center'
  | 'institutional_observability_center'
  | 'governance_structure_center'
  | 'governance_risk_heatmap'
  | 'fiduciary_governance_center'
  | 'compliance_integrity_center'
  | 'pilot_monitoring'
  | 'calibration_playground'
  | 'observability_console'
  | 'advisor_workspace'
  | 'client_workspace'
  | 'operating_pressure'
  | 'pilot_experience'
  | 'referral_program'
  | 'cfo_validation_lab';

export interface NavigationItem {
  id: Page;
  label?: string; // deprecated: developer reference only
  labelKey: string;
  icon: LucideIcon;
  isNew?: boolean;
  masterOnly?: boolean;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  group?: string; // deprecated: developer reference only
  groupKey: string;
  icon: LucideIcon;
  items: NavigationItem[];
}

export const DEFAULT_PAGE: Page = 'institutional_continuity';

export const EXECUTIVE_NAVIGATION_SCHEMA = 'v2.0';

export const LEGACY_ROUTE_MAP: Record<string, Page> = {
  // Legacy paths that might be bookmarked -> Canonical paths
  'dashboard': 'efos',
  'home': 'efos',
  'cockpit': 'efos',
  'executive-home': 'efos',
  'consolidated-executive': 'consolidated_executive',
  'dre_gerencial': 'dre',
  'bp': 'cfo.financial-governance', // Balance Sheet Intelligence
};

export const DEFAULT_OPEN_SUBMENUS: Record<string, boolean> = {
  'Governança Corporativa': true,
  'Administração e Finanças': true,
  'Finanças': true,
  'Cockpit de Gestão': true,
};

import { NAVIGATION_GROUPS } from '../core/navigation/navigation.registry';
export { NAVIGATION_GROUPS };


const flattenItems = (items: any[]): any[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenItems(item.children));
    }
    return acc;
  }, [] as any[]);
};

export const FLAT_NAV_ITEMS = flattenItems(NAVIGATION_GROUPS.flatMap(group => group.items));
