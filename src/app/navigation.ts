import {
  Activity,
  ArrowRightLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckSquare,
  CircleDollarSign,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  Globe,
  Landmark,
  LayoutGrid,
  Lightbulb,
  List,
  Percent,
  Scale,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
  Bell,
  LayoutDashboard,
  Compass,
  PieChart,
  LineChart,
  ClipboardList,
  Building2,
  Settings,
  History,
  HardDrive,
  FileSearch,
  Briefcase,
  Layers,
  Monitor,
  Cpu,
  Fingerprint,
  GanttChart,
  Boxes,
  Type,
  Presentation,
  Rocket,
  Megaphone,
  Calculator,
  type LucideIcon,
} from 'lucide-react';

export type Page =
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
  | 'inteligencia_sacerdotal'
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
  | 'academy_admin_course';

export interface NavigationItem {
  id: Page;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  group: string;
  icon: LucideIcon;
  items: NavigationItem[];
}

export const DEFAULT_PAGE: Page = 'portfolio';

export const DEFAULT_OPEN_SUBMENUS: Record<string, boolean> = {
  'Governança Corporativa': true,
  'Administração e Finanças': true,
  'Finanças': true,
  'Dashboard': true,
};

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    group: 'Dashboard',
    icon: LayoutGrid,
    items: [
      { id: 'portfolio', label: 'Visão Consolidada', icon: Globe },
      { id: 'dashboard', label: 'Monitoramento Estratégico', icon: LayoutDashboard },
      { id: 'indicadores', label: 'Análise de KPIs', icon: TrendingUp },
    ],
  },
  {
    group: 'Dados de Cadastro',
    icon: Database,
    items: [
      { id: 'clientes', label: 'Empresas', icon: Building2 },
      { id: 'premissas_economicas', label: 'Premissas do Sistema', icon: Settings },
    ],
  },
  {
    group: 'Governança Corporativa',
    icon: ShieldCheck,
    items: [
      { id: 'governanca_estrategica', label: 'Dashboard de Governança', icon: LayoutDashboard },
      { id: 'compliance_page', label: 'Compliance & Políticas', icon: Fingerprint },
      { id: 'advisory_insights', label: 'Conselho Estratégia CFO', icon: Presentation },
      { id: 'controladoria_estrategica', label: 'Controladoria Estratégica', icon: Scale },
      { id: 'diagnostico', label: 'Diagnóstico & IVE', icon: Activity },
      { id: 'diretrizes', label: 'Identidade & Diretrizes', icon: Compass },
      { id: 'inteligencia_sacerdotal', label: 'Inteligência Sacerdotal', icon: Cpu },
      { id: 'planejamento_estrategico', label: 'Planejamento Estratégico', icon: Globe },
      { id: 'relatorio_executivo', label: 'Relatório Executivo', icon: ClipboardList },
      { id: 'valuation', label: 'Valuation Business', icon: BarChart3 },
    ],
  },
  {
    group: 'Cultura Organizacional',
    icon: Users,
    items: [
      { id: 'dashboard_cultura', label: 'Dashboard de Cultura', icon: PieChart },
      { id: 'desenvolvimento_humano', label: 'Desenvolvimento Humano', icon: Zap },
      { id: 'quadro_pessoal', label: 'Gestão de Pessoas', icon: Users },
    ],
  },
  {
    group: 'Administração e Finanças',
    icon: Landmark,
    items: [
      { 
        id: 'adm_root' as any,
        label: 'Administração',
        icon: Briefcase,
        children: [
          { id: 'administrativa_indicadores', label: 'Indicadores Administrativos', icon: Activity },
        ]
      },
      { 
        id: 'contabil_root' as any, 
        label: 'Contabilidade', 
        icon: Calculator,
        children: [
          { id: 'bp', label: 'Balanço Patrimonial', icon: BookOpen },
          { id: 'dfc', label: 'DFC Contábil', icon: WalletCards },
          { id: 'dlpa', label: 'DLPA Contábil', icon: Scale },
          { id: 'dre', label: 'DRE Contábil', icon: FileText },
          { id: 'tax_reform_impact', label: 'Impacto Reforma Tributária', icon: Percent },
          { id: 'plano_contas', label: 'Plano Contas Contabilidade', icon: List },
        ]
      },
      { id: 'dashboard_gestao', label: 'Dashboard de Gestão', icon: LayoutDashboard },
      { 
        id: 'financeira_root' as any, 
        label: 'Finanças', 
        icon: Landmark,
        children: [
          { id: 'custos_pessoal', label: 'Análise de Custos de Pessoal', icon: Users },
          { id: 'dre_gerencial', label: 'DRE Gerencial Estratégica', icon: Activity },
          { id: 'modelagem', label: 'Engenharia Financeira', icon: LayoutGrid },
          { id: 'caixa', label: 'Fluxo de Caixa Consolidado', icon: CircleDollarSign },
          { id: 'contas_pagar', label: 'Fluxo de Contas a Pagar', icon: CreditCard },
          { id: 'ativos_financeiros', label: 'Gestão de Ativos Financeiros', icon: WalletCards, isNew: true },
          { id: 'contas_receber', label: 'Gestão de Contas a Receber', icon: ArrowUpRight },
          { id: 'emprestimos', label: 'Gestão de Passivos', icon: WalletCards },
          { id: 'analise_financeira', label: 'Inteligência de Capital', icon: Boxes },
          { id: 'plano_contas_gerencial', label: 'Plano de Contas Gerencial', icon: List },
          { id: 'posicao_financeira', label: 'Posição Financeira', icon: Landmark },
          { id: 'simulador_capital', label: 'Simulador de Captação', icon: Zap },
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
      { id: 'analise_mercado', label: 'Inteligência Competitiva', icon: TrendingUp },
      { id: 'marketing_estrategico', label: 'Marketing de Posicionamento', icon: Globe },
    ],
  },
  {
    group: 'Gestão Comercial',
    icon: ShoppingBag,
    items: [
      { id: 'dashboard_comercial', label: 'Dashboard Comercial', icon: LineChart },
      { id: 'precificacao', label: 'Precificação & Margem', icon: Percent },
      { id: 'comercial_estrategico', label: 'Vendas & Mercado', icon: ShoppingBag },
    ],
  },
  {
    group: 'Gestão Operacional',
    icon: Activity,
    items: [
      { id: 'dashboard_operacional', label: 'Dashboard Operacional', icon: HardDrive },
      { id: 'compras', label: 'Gestão de Compras', icon: ShoppingBag },
      { id: 'logistica', label: 'Eficiência em Logística', icon: Layers },
      { id: 'producao', label: 'Produção & Processos', icon: Activity },
    ],
  },
  {
    group: 'Educação',
    icon: BookOpen,
    items: [
      { id: 'academy_home', label: 'Academia da Illumine', icon: Presentation },
      { id: 'academy_admin', label: 'Gestão da Academia', icon: Settings2 },
    ],
  },
  {
    group: 'Configurações',
    icon: Settings,
    items: [
      { id: 'perfil_usuario', label: 'Gestão de Perfil', icon: Users },
      { id: 'configuracoes_sistema', label: 'Preferências do Sistema', icon: Settings },
      { id: 'mensagens', label: 'Central de Mensagens & Novidades', icon: Bell },
    ],
  },
];

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
