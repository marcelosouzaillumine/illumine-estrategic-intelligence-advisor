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
  type LucideIcon
} from 'lucide-react';

export type Page =
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
  | 'enterprise_validation'
  | 'reality_validation'
  | 'institutional_reports'
  | 'scenario_lab'
  | 'runtime_observability'
  | 'admin_grupos'
  | 'consolidated_executive'
  | 'cleanup'
  | 'portfolio'
  | 'dashboard'
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
  | 'strategic_intelligence_center'
  | 'board_deck_center'
  | 'institutional_observability_center'
  | 'governance_structure_center'
  | 'governance_risk_heatmap'
  | 'fiduciary_governance_center'
  | 'compliance_integrity_center'
  | 'pilot_monitoring'
  | 'calibration_playground'
  | 'observability_console';

export interface NavigationItem {
  id: Page;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
  masterOnly?: boolean;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  group: string;
  icon: LucideIcon;
  items: NavigationItem[];
}

export const DEFAULT_PAGE: Page = 'consolidated_executive';

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

      const isADashboard = a.label.toLowerCase().includes('dashboard');
      const isBDashboard = b.label.toLowerCase().includes('dashboard');

      if (isADashboard && !isBDashboard) return -1;
      if (!isADashboard && isBDashboard) return 1;

      return a.label.localeCompare(b.label, 'pt-BR');
    });
};

const RAW_NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    group: 'Cockpit de Gestão',
    icon: LayoutGrid,
    items: [
      { id: 'consolidated_executive', label: 'Inteligência Consolidada', icon: Globe },
      { id: 'portfolio', label: 'Portfólio', icon: Briefcase },
      { id: 'inteligencia_sistemica', label: 'Inteligência Sistêmica', icon: Cpu },
      { id: 'dashboard', label: 'Monitoramento Estratégico', icon: LayoutDashboard },
      { id: 'lab', label: 'Executive Scenario Lab', icon: FlaskConical },
      { id: 'indicadores', label: 'Análise de KPIs', icon: TrendingUp },
      { id: 'aprovacoes', label: 'Aprovações de Documentos', icon: CheckSquare, masterOnly: true },
      { id: 'plano_acao', label: 'Roadmap de Execução', icon: Rocket },
    ],
  },
  {
    group: 'Dados de Cadastro',
    icon: Database,
    items: [
      { id: 'clientes', label: 'Empresas', icon: Building2 },
      { id: 'parceiros', label: 'Parceiros Estratégicos', icon: Handshake, masterOnly: true },
      { id: 'premissas_economicas', label: 'Premissas do Sistema', icon: Settings2 },
      { id: 'gestao_usuarios', label: 'Usuários', icon: UserPlus, masterOnly: true },
      { id: 'dados_historicos', label: 'Central de Coleta de Dados', icon: Database },
    ],
  },
  {
    group: 'Governança Corporativa',
    icon: Network,
    items: [
      // --- Hubs Consolidados (FASE 1, 3 e 4) ---
      { id: 'strategic_intelligence_center', label: 'Governance Center', icon: Target },
      { id: 'governance_risk_heatmap', label: 'Enterprise Risk Heatmap', icon: ShieldAlert },
      { id: 'fiduciary_governance_center', label: 'Governança Fiduciária', icon: Scale },
      { id: 'compliance_integrity_center', label: 'Integridade & Compliance', icon: ShieldCheck },
      { id: 'board_deck_center', label: 'Central de Relatórios do Conselho', icon: Presentation },
      { id: 'institutional_observability_center', label: 'Saúde e Continuidade Institucional', icon: Activity },
      { id: 'governance_structure_center', label: 'Estrutura Institucional', icon: Users },
      { id: 'decision_governance', label: 'Governança de Decisão', icon: GitBranchPlus },
      { id: 'pilot_monitoring', label: 'Painel Operacional Piloto', icon: Activity, masterOnly: true },
      { id: 'calibration_playground', label: 'Calibration Playground', icon: Sparkles, masterOnly: true },
      { id: 'observability_console', label: 'Console de Observabilidade', icon: Eye },
      
      // --- Legacy & Master Only Routes (Preservados internamente) ---
      { id: 'advisor_cockpit', label: 'Advisor Cockpit', icon: BriefcaseBusiness, masterOnly: true },
      { id: 'tenant_governance', label: 'Governança Multi-Tenant', icon: ShieldCheck, masterOnly: true },
      { id: 'admin_grupos', label: 'Gestão de Grupos Econômicos', icon: Building, masterOnly: true },
      { id: 'product_governance', label: 'Governança de Produto', icon: PackageCheck, masterOnly: true },
      { id: 'institutional_knowledge_graph', label: 'Knowledge Graph', icon: GitGraph, masterOnly: true },
      { id: 'early_warning', label: 'Early Warning System', icon: Siren, masterOnly: true },
      { id: 'strategic_simulation', label: 'Strategic Simulation', icon: Landmark, masterOnly: true },
      { id: 'governance_orchestration', label: 'Governance Orchestration', icon: ArrowRightLeft, masterOnly: true },
      { id: 'institutional_ios', label: 'Institutional Operating System', icon: Cpu, masterOnly: true },
      { id: 'enterprise_validation', label: 'Enterprise Validation', icon: ShieldCheck, masterOnly: true },
      { id: 'reality_validation', label: 'Reality Validation Center', icon: Radar, masterOnly: true },
      { id: 'institutional_copilot', label: 'Copiloto Institucional', icon: Bot, masterOnly: false },
      { id: 'institutional_integrations', label: 'Integrações Institucionais', icon: PlugZap, masterOnly: false },
      
      // As demais páginas antigas (advisory_insights, relatorio_executivo, etc) 
      // continuam existindo no Page type para não quebrar links diretos.
    ],
  },
  {
    group: 'Cultura Organizacional',
    icon: Users,
    items: [
      { id: 'dashboard_cultura', label: 'Dashboard de Cultura', icon: PieChart },
      { id: 'desenvolvimento_humano', label: 'Desenvolvimento Humano', icon: GraduationCap },
      { id: 'perfil_lideranca', label: 'Perfil de Liderança', icon: Star },
      { id: 'quadro_pessoal', label: 'Gestão de Pessoas', icon: Users },
      { id: 'avaliacao_organograma', label: 'Avaliação de Organograma', icon: Boxes },
      { id: 'cultura_feedback', label: 'Cultura de Feedback', icon: MessageCircle },
    ],
  },
  {
    group: 'Administração e Finanças',
    icon: Landmark,
    items: [
      { id: 'dashboard_gestao', label: 'Dashboard Adm Fin', icon: LayoutDashboard },
      { 
        id: 'adm_root' as any,
        label: 'Administração',
        icon: Briefcase,
        children: [
          { id: 'administrativa_indicadores', label: 'Indicadores Administrativos', icon: BarChart2 },
        ]
      },
      { 
        id: 'contabil_root' as any, 
        label: 'Contabilidade', 
        icon: Calculator,
        children: [
          { id: 'bp', label: 'Balanço Patrimonial', icon: BookOpen },
          { id: 'dfc', label: 'DFC Contábil', icon: ArrowRightLeft },
          { id: 'dlpa', label: 'DLPA Contábil', icon: BookOpen },
          { id: 'dre', label: 'DRE Contábil', icon: FileText },
          { id: 'plano_contas', label: 'Plano Contas Contabilidade', icon: List },
        ]
      },
      { 
        id: 'financeira_root' as any, 
        label: 'Finanças', 
        icon: Landmark,
        children: [
          { id: 'custos_pessoal', label: 'Análise de Custos de Pessoal', icon: CircleDollarSign },
          { id: 'dre_gerencial', label: 'DRE Gerencial Estratégica', icon: LineChart },
          { id: 'modelagem', label: 'Engenharia Financeira', icon: LayoutGrid },
          { id: 'caixa', label: 'Fluxo de Caixa Consolidado', icon: CircleDollarSign },
          { id: 'contas_pagar', label: 'Fluxo de Contas a Pagar', icon: CreditCard },
          { id: 'tax_reform_impact', label: 'Simulador de Impacto Tributário', icon: Percent },
          { id: 'ativos_financeiros', label: 'Gestão de Ativos Financeiros', icon: WalletCards },
          { id: 'contas_receber', label: 'Gestão de Contas a Receber', icon: ArrowUpRight },
          { id: 'emprestimos', label: 'Gestão de Passivos', icon: CreditCard },
          { id: 'analise_financeira', label: 'Inteligência de Capital', icon: Coins },
          { id: 'plano_contas_gerencial', label: 'Plano de Contas Gerencial', icon: List },
          { id: 'posicao_financeira', label: 'Posição Financeira', icon: Landmark },
          { id: 'simulador_capital', label: 'Simulador de Captação', icon: Magnet },
          { id: 'orcamento', label: 'Orçamento & Budget', icon: PiggyBank },
        ]
      },
    ],
  },
  {
    group: 'Gestão de Inovação',
    icon: Lightbulb,
    items: [
      { id: 'dashboard_inovacao', label: 'Dashboard de Inovação', icon: Zap },
      { id: 'viabilidade', label: 'Projetos de Inovação', icon: Rocket },
    ],
  },
  {
    group: 'Gestão de Marketing',
    icon: Bell,
    items: [
      { id: 'dashboard_marketing', label: 'Dashboard de Marketing', icon: LayoutDashboard },
      { id: 'analise_mercado', label: 'Inteligência Competitiva', icon: Target },
      { id: 'marketing_estrategico', label: 'Marketing de Posicionamento', icon: Megaphone },
    ],
  },
  {
    group: 'Gestão Comercial',
    icon: ShoppingBag,
    items: [
      { id: 'dashboard_comercial', label: 'Dashboard Comercial', icon: LineChart },
      { id: 'precificacao', label: 'Precificação & Margem', icon: Tags },
      { id: 'comercial_estrategico', label: 'Vendas & Mercado', icon: ShoppingCart },
    ],
  },
  {
    group: 'Gestão Operacional',
    icon: Activity,
    items: [
      { id: 'dashboard_operacional', label: 'Dashboard Operacional', icon: HardDrive },
      { id: 'compras', label: 'Gestão de Compras', icon: ShoppingBag },
      { id: 'logistica', label: 'Eficiência em Logística', icon: Layers },
      { id: 'producao', label: 'Produção & Processos', icon: Factory },
    ],
  },
  {
    group: 'Academia da Illumine',
    icon: BookOpen,
    items: [
      { id: 'academy_home', label: 'Trilha do Conhecimento', icon: Presentation },
      { id: 'academy_admin', label: 'Gestão da Academia', icon: Settings2, masterOnly: true },
    ],
  },
  {
    group: 'Configurações',
    icon: Settings,
    items: [
      { id: 'suporte', label: 'Suporte', icon: LifeBuoy },
      { id: 'mensagens', label: 'Mensagens e Comunicados', icon: Bell },
      { id: 'perfil_usuario', label: 'Gestão de Perfil', icon: UserCog },
      { id: 'maintenance', label: 'Manutenção de Dados', icon: DatabaseBackup },
      { id: 'configuracoes_sistema', label: 'Preferências do Sistema', icon: Settings },
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
