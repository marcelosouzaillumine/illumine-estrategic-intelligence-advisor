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
  items: NavigationItem[];
}

export const DEFAULT_PAGE: Page = 'portfolio';

export const DEFAULT_OPEN_SUBMENUS: Record<string, boolean> = {
  'Gestão Financeira': true,
  'Dados de Cadastro': true,
  'Conselho & Estratégia CFO': true,
};

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    group: 'Visão Consolidada',
    items: [
      { id: 'portfolio', label: 'Gestão de Portfólio', icon: Activity, isNew: true },
    ],
  },
  {
    group: 'Dashboard',
    items: [
      { id: 'dashboard', label: 'Monitoramento Geral', icon: LayoutGrid },
      { id: 'indicadores', label: 'KPIs e Métricas', icon: TrendingUp },
    ],
  },
  {
    group: 'Dados de Cadastro',
    items: [
      { 
        id: 'clientes_root' as any, 
        label: 'Empresas', 
        icon: Users,
        children: [
          { id: 'clientes', label: 'Dados Cadastrais', icon: FileText },
          { id: 'dados_historicos', label: 'Dados Históricos', icon: Database },
          { id: 'plano_contas', label: 'Plano de Contas Contábil', icon: List },
          { id: 'plano_contas_gerencial', label: 'Plano de Contas Gerencial', icon: List, isNew: true },
          { id: 'premissas_cliente', label: 'Premissas', icon: Settings2 },
          { id: 'quadro_pessoal', label: 'Quadro de Pessoal', icon: Users },
          { id: 'fiscal_tributario', label: 'Fiscal & Tributário', icon: ShieldCheck },
        ]
      },
      { id: 'premissas_economicas', label: 'Premissas Econômicas', icon: Globe },
      { id: 'premissas_tributarias', label: 'Premissas Tributárias', icon: Landmark },
    ],
  },
  {
    group: 'Demonstrações Contábeis',
    items: [
      { id: 'dre', label: 'DRE', icon: FileText },
      { id: 'bp', label: 'Balanço Patrimonial', icon: BookOpen },
      { id: 'dlpa', label: 'DLPA', icon: Scale },
      { id: 'dfc', label: 'DFC (Contábil)', icon: WalletCards },
    ],
  },
  {
    group: 'Estratégia & Direção',
    items: [
      { id: 'diretrizes', label: 'Diretrizes (MVV)', icon: Target, isNew: true },
      { id: 'diagnostico', label: 'Diagnóstico (IVE)', icon: ShieldCheck, isNew: true },
      { id: 'okrs', label: 'OKRs & Metas', icon: TrendingUp, isNew: true },
    ],
  },
  {
    group: 'Gestão Financeira',
    items: [
      { id: 'precificacao', label: 'Precificação & Margem', icon: DollarSign, isNew: true },
      { id: 'dre_gerencial', label: 'DRE Gerencial', icon: Activity },
      { id: 'caixa', label: 'Fluxo de Caixa', icon: CircleDollarSign },
      { id: 'posicao_financeira', label: 'Posição Financeira', icon: Landmark },
      { id: 'contas_pagar', label: 'Contas a Pagar', icon: CreditCard },
      { id: 'contas_receber', label: 'Contas a Receber', icon: ArrowUpRight },
      { id: 'compras', label: 'Gestão de Compras', icon: ShoppingBag },
      { id: 'custos_pessoal', label: 'Custos com Pessoal', icon: Users },
      { id: 'emprestimos', label: 'Empréstimos', icon: WalletCards },
    ],
  },
  {
    group: 'Conselho & Estratégia CFO',
    items: [
      { id: 'advisory_insights', label: 'Dashboard de Advisory', icon: Lightbulb, isNew: true },
      { id: 'relatorio_executivo', label: 'Relatório Executivo', icon: FileText, isNew: true },
      { id: 'plano_acao', label: 'Roadmap Estratégico', icon: CheckSquare, isNew: true },
      { id: 'simulador_capital', label: 'Simulador Captação/Alocação', icon: ArrowRightLeft, isNew: true },
      { id: 'tax_reform_impact', label: 'Simualdor Reforma Tributária', icon: Percent, isNew: true },
      { id: 'modelagem', label: 'Modelagem Financeira', icon: LayoutGrid, isNew: true },
      { id: 'analise_financeira', label: 'Análise Estratégica CFO', icon: ShieldCheck },
      { id: 'valuation', label: 'Valuation & M&A', icon: Zap },
      { id: 'viabilidade', label: 'Viabilidade de Projetos', icon: BarChart3 },
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
