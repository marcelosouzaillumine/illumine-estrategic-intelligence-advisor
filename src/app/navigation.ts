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
  | 'strategic_war_room'
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
  | 'strategic_intelligence'
  | 'institutional_board_pack'
  | 'institutional_continuity'
  | 'demo_continuity'
  | 'deployment_readiness'
  | 'institutional_onboarding'
  | 'enterprise_validation'
  | 'reality_validation'
  | 'institutional_reports'
  | 'scenario_lab'
  | 'runtime_observability'
  | 'admin_grupos'
  | 'consolidated_executive'
  | 'board_governance'
  | 'strategic_war_room'
  | 'war_room'
  | 'admin'
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
  | 'desenvolvimento_humano'
  | 'analise_mercado'
  | 'compliance_page'
  | 'governanca_estrategica'
  | 'planejamento_estrategico'
  | 'relatorio_executivo'
  | 'inteligencia_governanca'
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
  | 'inteligencia_sistemica'
  | 'perfil_lideranca'
  | 'estrutura_governanca'
  | 'avaliacao_organograma'
  | 'cultura_feedback'
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
  | 'strategic_intelligence_center'
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
  | 'referral_program';

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

export const DEFAULT_OPEN_SUBMENUS: Record<string, boolean> = {
  'Governança Corporativa': true,
  'Administração e Finanças': true,
  'Finanças': true,
  'Cockpit de Gestão': true,
};

const sortNavItems = (items: NavigationItem[]): NavigationItem[] => {
  return [...items]
    .map(item => ({
      ...item,
      children: item.children ? sortNavItems(item.children) : undefined
    }))
    .sort((a, b) => {
      // "Inteligência Consolidada" (consolidated_executive) always first if it exists in the group
      if (a.id === 'consolidated_executive') return -1;
      if (b.id === 'consolidated_executive') return 1;

      const labelA = a.label || a.labelKey;
      const labelB = b.label || b.labelKey;

      const isADashboard = labelA.toLowerCase().includes('dashboard');
      const isBDashboard = labelB.toLowerCase().includes('dashboard');

      if (isADashboard && !isBDashboard) return -1;
      if (!isADashboard && isBDashboard) return 1;

      return labelA.localeCompare(labelB, 'pt-BR');
    });
};

const RAW_NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    group: 'Cockpit de Gestão', groupKey: 'navigation.group.management_cockpit',
    icon: LayoutGrid,
    items: [
      { id: 'consolidated_executive', label: 'Inteligência Consolidada', labelKey: 'navigation.page.consolidated_executive', icon: Globe },
      { id: 'portfolio', label: 'Portfólio', labelKey: 'navigation.page.portfolio', icon: Briefcase },
      { id: 'inteligencia_sistemica', label: 'Inteligência Sistêmica', labelKey: 'navigation.page.systemic_intelligence', icon: Cpu },
      { id: 'efos', label: 'EFOS', labelKey: 'navigation.page.efos', icon: LayoutDashboard },
      { id: 'lab', label: 'Executive Scenario Lab', labelKey: 'navigation.page.lab', icon: FlaskConical },
      { id: 'indicadores', label: 'Análise de KPIs', labelKey: 'navigation.page.indicadores', icon: TrendingUp },
      { id: 'aprovacoes', label: 'Aprovações de Documentos', labelKey: 'navigation.page.aprovacoes', icon: CheckSquare, masterOnly: true },
      { id: 'plano_acao', label: 'Roadmap de Execução', labelKey: 'navigation.page.plano_acao', icon: Rocket },
    ],
  },
  {
    group: 'Dados de Cadastro', groupKey: 'navigation.group.registration_data',
    icon: Database,
    items: [
      { id: 'clientes', label: 'Empresas', labelKey: 'navigation.page.clientes', icon: Building2 },
      { id: 'parceiros', label: 'Parceiros Estratégicos', labelKey: 'navigation.page.parceiros', icon: Handshake, masterOnly: true },
      { id: 'premissas_economicas', label: 'Premissas do Sistema', labelKey: 'navigation.page.premissas_economicas', icon: Settings2 },
      { id: 'gestao_usuarios', label: 'Usuários', labelKey: 'navigation.page.gestao_usuarios', icon: UserPlus, masterOnly: true },
      { id: 'dados_historicos', label: 'Central de Coleta de Dados', labelKey: 'navigation.page.dados_historicos', icon: Database },
    ],
  },
  {
    group: 'Governança Corporativa', groupKey: 'navigation.group.corporate_governance',
    icon: Network,
    items: [
      { id: 'executive_monitoring_center', label: 'Executive Monitoring Center', labelKey: 'navigation.page.executive_monitoring_center', icon: Target },
      { id: 'esgim_assessment', label: 'Avaliação ESGIM™', labelKey: 'navigation.page.esgim_assessment', icon: Brain },
      { id: 'governance_maturity_center', label: 'Governance Maturity Center', labelKey: 'navigation.page.governance_maturity_center', icon: Target },
      { id: 'leadership_dna_center', label: 'Leadership DNA Center', labelKey: 'navigation.page.leadership_dna_center', icon: Users },
      { id: 'institutional_structure_center', label: 'Institutional Structure Center', labelKey: 'navigation.page.institutional_structure_center', icon: Users },
      { id: 'board_deck_center', label: 'Board Deck Center', labelKey: 'navigation.page.board_deck_center', icon: Presentation },
      { id: 'fiduciary_validation_center', label: 'Fiduciary Validation Center', labelKey: 'navigation.page.fiduciary_validation_center', icon: Scale },
      { id: 'economic_normalization_center', label: 'Economic Normalization Center', labelKey: 'navigation.page.economic_normalization_center', icon: Scale },
      { id: 'capital_governance_center', label: 'Capital Governance Center', labelKey: 'navigation.page.capital_governance_center', icon: Scale },
      { id: 'financial_lineage_center', label: 'Linhagem Fiduciária', labelKey: 'navigation.page.financial_lineage_center', icon: GitBranchPlus },
      { id: 'credit_committee_center', label: 'Credit Committee Simulator', labelKey: 'navigation.page.credit_committee_center', icon: Landmark },
      { id: 'institutional_memory_center', label: 'Institutional Memory Center', labelKey: 'navigation.page.institutional_memory_center', icon: History },
      { id: 'risk_exposure_center', label: 'Risk Exposure Center', labelKey: 'navigation.page.risk_exposure_center', icon: ShieldAlert },
      { id: 'decision_lifecycle_center', label: 'Decision Lifecycle Center', labelKey: 'navigation.page.decision_lifecycle_center', icon: GitBranchPlus, masterOnly: false },
      { id: 'sovereign_decision_center', label: 'Sovereign Decision Center', labelKey: 'navigation.page.sovereign_decision_center', icon: Activity, masterOnly: false },
      { id: 'executive_execution_center', label: 'Executive Execution Center', labelKey: 'navigation.page.executive_execution_center', icon: Activity, masterOnly: false },
      
      // Adjacent governance module.
      // Not part of GOVERNANCE_DOMAIN_BOUNDARIES.md core module registry.
      // Pending future migration to Integrity & Compliance axis.
      { id: 'compliance_integrity_center', label: 'Integridade & Compliance', labelKey: 'navigation.page.compliance_integrity_center', icon: ShieldCheck },
      { id: 'operating_pressure', label: 'Pressão Operacional Institucional', labelKey: 'navigation.page.operating_pressure', icon: Activity },
      { id: 'institutional_continuity', label: 'Institutional Continuity Cockpit', labelKey: 'navigation.page.institutional_continuity', icon: HeartPulse },
      { id: 'operational_governance', label: 'Operational Governance Center', labelKey: 'navigation.page.operational_governance', icon: ShieldCheck },
      { id: 'strategic_intelligence', label: 'Strategic Intelligence Center', labelKey: 'navigation.page.strategic_intelligence', icon: Compass },
      { id: 'institutional_board_pack', label: 'Board Pack Institucional', labelKey: 'navigation.page.institutional_board_pack', icon: FileText },

      // Restricted Modules
      // TODO: migrar crisis_response_center para restrictedRoles (C-Level/Board) em vez de masterOnly total.
      { id: 'institutional_onboarding', label: 'Institutional Onboarding', labelKey: 'navigation.page.institutional_onboarding', icon: Building2, masterOnly: true },
      { id: 'deployment_readiness', label: 'Deployment Readiness Layer', labelKey: 'navigation.page.deployment_readiness', icon: ShieldCheck, masterOnly: true },
      { id: 'demo_continuity', label: 'Cockpit de Continuidade (Demo)', labelKey: 'navigation.page.demo_continuity', icon: HeartPulse, masterOnly: true },
      { id: 'crisis_response_center', label: 'Crisis Response Center', labelKey: 'navigation.page.crisis_response_center', icon: Siren, masterOnly: true },
      { id: 'runtime_observability_center', label: 'Runtime Observability Center', labelKey: 'navigation.page.runtime_observability_center', icon: Activity, masterOnly: true },
      { id: 'product_governance_center', label: 'Product Governance Center', labelKey: 'navigation.page.product_governance_center', icon: PackageCheck, masterOnly: true },
      { id: 'multi_tenant_governance_center', label: 'Multi-Tenant Governance Center', labelKey: 'navigation.page.multi_tenant_governance_center', icon: ShieldCheck, masterOnly: true },

      // Legacy Hubs Temporários (Mantidos ocultos ou para backward compatibility)
      { id: 'governance_orchestration', label: 'Governance Orchestration', labelKey: 'navigation.page.governance_orchestration', icon: ArrowUpRightSquare, masterOnly: true },
      { id: 'executive_command', label: 'Executive Command Center', labelKey: 'navigation.page.executive_command', icon: Target, masterOnly: true },
      { id: 'institutional_ios', label: 'Institutional iOS', labelKey: 'navigation.page.institutional_ios', icon: Scale, masterOnly: true },
      { id: 'pilot_monitoring', label: 'Painel Operacional Piloto', labelKey: 'navigation.page.pilot_monitoring', icon: Activity, masterOnly: true },
      { id: 'calibration_playground', label: 'Calibration Playground', labelKey: 'navigation.page.calibration_playground', icon: Sparkles, masterOnly: true },
      { id: 'advisor_workspace', label: 'Advisor Workspace', labelKey: 'navigation.page.advisor_workspace', icon: Briefcase, masterOnly: true },
      { id: 'client_workspace', label: 'Client Executive Workspace', labelKey: 'navigation.page.client_workspace', icon: LayoutDashboard, masterOnly: false },
      { id: 'pilot_experience', label: 'Pilot Experience Dashboard', labelKey: 'navigation.page.pilot_experience', icon: BarChart3, masterOnly: true },
      { id: 'pilot_operations_center', label: 'Pilot Operations Center', labelKey: 'navigation.page.pilot_operations_center', icon: ShieldCheck, masterOnly: true },
    ],
  },
  {
    group: 'Cultura Organizacional', groupKey: 'navigation.group.organizational_culture',
    icon: Users,
    items: [
      { id: 'dashboard_cultura', label: 'Dashboard de Cultura', labelKey: 'navigation.page.dashboard_cultura', icon: PieChart },
      { id: 'desenvolvimento_humano', label: 'Desenvolvimento Humano', labelKey: 'navigation.page.desenvolvimento_humano', icon: GraduationCap },
      { id: 'perfil_lideranca', label: 'Perfil de Liderança', labelKey: 'navigation.page.perfil_lideranca', icon: Star },
      { id: 'quadro_pessoal', label: 'Gestão de Pessoas', labelKey: 'navigation.page.quadro_pessoal', icon: Users },
      { id: 'avaliacao_organograma', label: 'Avaliação de Organograma', labelKey: 'navigation.page.avaliacao_organograma', icon: Boxes },
      { id: 'cultura_feedback', label: 'Cultura de Feedback', labelKey: 'navigation.page.cultura_feedback', icon: MessageCircle },
    ],
  },
  {
    group: 'Administração e Finanças', groupKey: 'navigation.group.administration_finance',
    icon: Landmark,
    items: [
      { id: 'dashboard_gestao', label: 'Dashboard Adm Fin', labelKey: 'navigation.page.dashboard_gestao', icon: LayoutDashboard },
      { 
        id: 'adm_root' as any,
        label: 'Administração', labelKey: 'navigation.page.adm_root',
        icon: Briefcase,
        children: [
          { id: 'administrativa_indicadores', label: 'Indicadores Administrativos', labelKey: 'navigation.page.administrativa_indicadores', icon: BarChart2 },
        ]
      },
      { 
        id: 'contabil_root' as any, 
        label: 'Contabilidade', labelKey: 'navigation.page.contabil_root', 
        icon: Calculator,
        children: [
          { id: 'bp', label: 'Balanço Patrimonial', labelKey: 'navigation.page.bp', icon: BookOpen },
          { id: 'dfc', label: 'DFC Contábil', labelKey: 'navigation.page.dfc', icon: ArrowRightLeft },
          { id: 'dlpa', label: 'DLPA Contábil', labelKey: 'navigation.page.dlpa', icon: BookOpen },
          { id: 'dre', label: 'DRE Contábil', labelKey: 'navigation.page.dre', icon: FileText },
          { id: 'plano_contas', label: 'Plano Contas Contabilidade', labelKey: 'navigation.page.plano_contas', icon: List },
        ]
      },
      { 
        id: 'financeira_root' as any, 
        label: 'Finanças', labelKey: 'navigation.page.financeira_root', 
        icon: Landmark,
        children: [
          { id: 'custos_pessoal', label: 'Análise de Custos de Pessoal', labelKey: 'navigation.page.custos_pessoal', icon: CircleDollarSign },
          { id: 'dre_gerencial', label: 'DRE Gerencial Estratégica', labelKey: 'navigation.page.dre_gerencial', icon: LineChart },
          { id: 'modelagem', label: 'Engenharia Financeira', labelKey: 'navigation.page.modelagem', icon: LayoutGrid },
          { id: 'caixa', label: 'Fluxo de Caixa Consolidado', labelKey: 'navigation.page.caixa', icon: CircleDollarSign },
          { id: 'contas_pagar', label: 'Fluxo de Contas a Pagar', labelKey: 'navigation.page.contas_pagar', icon: CreditCard },
          { id: 'tax_reform_impact', label: 'Simulador de Impacto Tributário', labelKey: 'navigation.page.tax_reform_impact', icon: Percent },
          { id: 'ativos_financeiros', label: 'Gestão de Ativos Financeiros', labelKey: 'navigation.page.ativos_financeiros', icon: WalletCards },
          { id: 'contas_receber', label: 'Gestão de Contas a Receber', labelKey: 'navigation.page.contas_receber', icon: ArrowUpRight },
          { id: 'emprestimos', label: 'Gestão de Passivos', labelKey: 'navigation.page.emprestimos', icon: CreditCard },
          { id: 'analise_financeira', label: 'Inteligência de Capital', labelKey: 'navigation.page.analise_financeira', icon: Coins },
          { id: 'plano_contas_gerencial', label: 'Plano de Contas Gerencial', labelKey: 'navigation.page.plano_contas_gerencial', icon: List },
          { id: 'posicao_financeira', label: 'Posição Financeira', labelKey: 'navigation.page.posicao_financeira', icon: Landmark },
          { id: 'simulador_capital', label: 'Simulador de Captação', labelKey: 'navigation.page.simulador_capital', icon: Magnet },
          { id: 'orcamento', label: 'Orçamento & Budget', labelKey: 'navigation.page.orcamento', icon: PiggyBank },
        ]
      },
    ],
  },
  {
    group: 'Gestão de Inovação', groupKey: 'navigation.group.innovation_management',
    icon: Lightbulb,
    items: [
      { id: 'dashboard_inovacao', label: 'Dashboard de Inovação', labelKey: 'navigation.page.dashboard_inovacao', icon: Zap },
      { id: 'viabilidade', label: 'Projetos de Inovação', labelKey: 'navigation.page.viabilidade', icon: Rocket },
    ],
  },
  {
    group: 'Gestão de Marketing', groupKey: 'navigation.group.marketing_management',
    icon: Bell,
    items: [
      { id: 'dashboard_marketing', label: 'Dashboard de Marketing', labelKey: 'navigation.page.dashboard_marketing', icon: LayoutDashboard },
      { id: 'analise_mercado', label: 'Inteligência Competitiva', labelKey: 'navigation.page.analise_mercado', icon: Target },
      { id: 'marketing_estrategico', label: 'Marketing de Posicionamento', labelKey: 'navigation.page.marketing_estrategico', icon: Megaphone },
    ],
  },
  {
    group: 'Gestão Comercial', groupKey: 'navigation.group.sales_management',
    icon: ShoppingBag,
    items: [
      { id: 'dashboard_comercial', label: 'Dashboard Comercial', labelKey: 'navigation.page.dashboard_comercial', icon: LineChart },
      { id: 'precificacao', label: 'Precificação & Margem', labelKey: 'navigation.page.precificacao', icon: Tags },
      { id: 'comercial_estrategico', label: 'Vendas & Mercado', labelKey: 'navigation.page.comercial_estrategico', icon: ShoppingCart },
    ],
  },
  {
    group: 'Gestão Operacional', groupKey: 'navigation.group.operational_management',
    icon: Activity,
    items: [
      { id: 'dashboard_operacional', label: 'Dashboard Operacional', labelKey: 'navigation.page.dashboard_operacional', icon: HardDrive },
      { id: 'compras', label: 'Gestão de Compras', labelKey: 'navigation.page.compras', icon: ShoppingBag },
      { id: 'logistica', label: 'Eficiência em Logística', labelKey: 'navigation.page.logistica', icon: Layers },
      { id: 'producao', label: 'Produção & Processos', labelKey: 'navigation.page.producao', icon: Factory },
    ],
  },
  {
    group: 'Academia da Illumine', groupKey: 'navigation.group.illumine_academy',
    icon: BookOpen,
    items: [
      { id: 'academy_home', label: 'Trilha do Conhecimento', labelKey: 'navigation.page.academy_home', icon: Presentation },
      { id: 'academy_admin', label: 'Gestão da Academia', labelKey: 'navigation.page.academy_admin', icon: Settings2, masterOnly: true },
    ],
  },
  {
    group: 'Configurações', groupKey: 'navigation.group.settings',
    icon: Settings,
    items: [
      { id: 'suporte', label: 'Suporte', labelKey: 'navigation.page.suporte', icon: LifeBuoy },
      { id: 'mensagens', label: 'Mensagens e Comunicados', labelKey: 'navigation.page.mensagens', icon: Bell },
      { id: 'perfil_usuario', label: 'Gestão de Perfil', labelKey: 'navigation.page.perfil_usuario', icon: UserCog },
      { id: 'maintenance', label: 'Manutenção de Dados', labelKey: 'navigation.page.maintenance', icon: DatabaseBackup },
      { id: 'configuracoes_sistema', label: 'Preferências do Sistema', labelKey: 'navigation.page.configuracoes_sistema', icon: Settings },
    ],
  },
];

export const NAVIGATION_GROUPS: NavigationGroup[] = RAW_NAVIGATION_GROUPS.map(group => ({
  ...group,
  items: sortNavItems(group.items)
}));

const flattenItems = (items: NavigationItem[]): NavigationItem[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenItems(item.children));
    }
    return acc;
  }, [] as NavigationItem[]);
};

export const FLAT_NAV_ITEMS = flattenItems(NAVIGATION_GROUPS.flatMap(group => group.items));
