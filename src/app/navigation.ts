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
  | 'dados_historicos'
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
  | 'plano_estrategico_global'
  | 'relatorio_executivo';

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
  'Governança': true,
  'Gestão': true,
  'Finanças': true,
  'Dashboard': true,
};

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    group: 'Dashboard',
    icon: LayoutGrid,
    items: [
      { id: 'portfolio', label: 'Visão Consolidada', icon: Globe },
      { id: 'dashboard', label: 'Monitoramento Geral', icon: LayoutGrid },
      { id: 'indicadores', label: 'KPIs e Métricas', icon: TrendingUp },
    ],
  },
  {
    group: 'Dados de Cadastro',
    icon: Database,
    items: [
      { id: 'clientes', label: 'Empresas', icon: Users },
      { id: 'dados_historicos', label: 'Dados Históricos', icon: Database },
      { id: 'premissas_economicas', label: 'Premissas', icon: Settings2 },
    ],
  },
  {
    group: 'Governança',
    icon: ShieldCheck,
    items: [
      { id: 'governanca_estrategica', label: 'Dashboard de Governança', icon: LayoutGrid, isNew: true },
      { id: 'diretrizes', label: 'Diretrizes (MVV)', icon: Target },
      { id: 'plano_estrategico_global', label: 'Plano Estratégico Global', icon: LayoutGrid, isNew: true },
      { id: 'okrs', label: 'Planejamento Estratégico', icon: TrendingUp },
      { id: 'relatorio_executivo', label: 'Relatório Executivo', icon: FileText },
      { id: 'compliance_page', label: 'Compliance & Políticas', icon: ShieldCheck, isNew: true },
      { id: 'controladoria_estrategica', label: 'Controladoria Estratégica', icon: Scale },
      { id: 'diagnostico', label: 'Diagnóstico & IVE', icon: Activity },
      { id: 'advisory_insights', label: 'Conselho Estratégia CFO', icon: Zap },
      { id: 'valuation', label: 'Valuation & Estratégia', icon: BarChart3 },
    ],
  },
  {
    group: 'Marketing',
    icon: Globe,
    items: [
      { id: 'marketing_estrategico', label: 'Marketing Estratégico', icon: Globe },
      { id: 'analise_mercado', label: 'Análise de Mercado', icon: TrendingUp, isNew: true },
    ],
  },
  {
    group: 'Comercial',
    icon: ShoppingBag,
    items: [
      { id: 'comercial_estrategico', label: 'Vendas & Mercado', icon: ShoppingBag },
      { id: 'precificacao', label: 'Precificação & Margem', icon: Percent },
    ],
  },
  {
    group: 'Cultura',
    icon: Users,
    items: [
      { id: 'quadro_pessoal', label: 'Gestão de Pessoas', icon: Users },
      { id: 'desenvolvimento_humano', label: 'Desenvolvimento Humano', icon: Activity },
    ],
  },
  {
    group: 'Inovação',
    icon: Lightbulb,
    items: [
      { id: 'viabilidade', label: 'Projetos de Inovação', icon: Lightbulb },
      { id: 'simulador_capital', label: 'Captação & Alocação', icon: ArrowUpRight },
    ],
  },
  {
    group: 'Operacional',
    icon: Activity,
    items: [
      { id: 'compras', label: 'Compras', icon: ShoppingBag },
      { id: 'logistica', label: 'Logística', icon: Database },
      { id: 'producao', label: 'Produção', icon: Activity },
    ],
  },
  {
    group: 'Gestão',
    icon: Landmark,
    items: [
      { 
        id: 'financeira_root' as any, 
        label: 'Finanças', 
        icon: Landmark,
        children: [
          { id: 'dre_gerencial', label: 'DRE Gerencial', icon: Activity },
          { id: 'caixa', label: 'Fluxo de Caixa', icon: CircleDollarSign },
          { id: 'posicao_financeira', label: 'Posição Financeira', icon: Landmark },
          { id: 'contas_pagar', label: 'Contas a Pagar', icon: CreditCard },
          { id: 'contas_receber', label: 'Contas a Receber', icon: ArrowUpRight },
          { id: 'emprestimos', label: 'Empréstimos', icon: WalletCards },
          { id: 'plano_contas_gerencial', label: 'Plano Contas Gerencial', icon: List },
          { id: 'custos_pessoal', label: 'Custos com Pessoal', icon: Users },
          { id: 'modelagem', label: 'Modelagem Financeira', icon: LayoutGrid },
        ]
      },
      { 
        id: 'contabil_root' as any, 
        label: 'Contábil', 
        icon: FileText,
        children: [
          { id: 'plano_contas', label: 'Plano Contas Contábil', icon: List },
          { id: 'dre', label: 'DRE Contábil', icon: FileText },
          { id: 'bp', label: 'Balanço Patrimonial', icon: BookOpen },
          { id: 'dfc', label: 'DFC Contábil', icon: WalletCards },
          { id: 'dlpa', label: 'DLPA', icon: Scale },
        ]
      },
      { 
        id: 'adm_root' as any,
        label: 'Administrativa',
        icon: FileText,
        children: [
          { id: 'administrativa_indicadores', label: 'Indicadores Administrativos', icon: Activity },
        ]
      }
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
