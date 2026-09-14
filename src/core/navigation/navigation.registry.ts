import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  ArrowUpRight,
  BarChart2,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  BrainCircuit,
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
  FileCheck,
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
  Lock,
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

import { WorkspaceNavigationGroup, WorkspaceNavigationItem } from './navigation.types';
import { Page } from '../../app/navigation';

const sortNavItems = (items: WorkspaceNavigationItem[]): WorkspaceNavigationItem[] => {
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

export const RAW_NAVIGATION_GROUPS: WorkspaceNavigationGroup[] = [
  // --- COMMAND LAYER ---
  {
    group: 'Executive Command Center', groupKey: 'navigation.group.executive_command_center', officeId: 'command-center', category: 'command',
    icon: Target,
    items: [
      { id: 'executive_command', label: 'Executive Command Center', labelKey: 'navigation.page.executive_command', icon: Target, masterOnly: true }
    ]
  },

  // --- EXECUTION LAYER (Executive Offices) ---
  {
    group: 'CEO Office', groupKey: 'navigation.group.ceo_office', officeId: 'ceo-office', category: 'executive-office',
    icon: Globe,
    items: [
      { id: 'ceo.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.executive_overview', icon: LayoutDashboard },
      { 
        id: 'ceo.strategic-domains', label: 'Corporate Strategy', labelKey: 'navigation.group.ceo.strategy', icon: Target,
        children: [
          { id: 'ceo.strategic-performance', label: 'Strategic Performance', labelKey: 'navigation.page.strategic_performance', icon: Target },
          { id: 'ceo.growth-governance', label: 'Growth Governance', labelKey: 'navigation.page.growth_governance', icon: TrendingUp },
          { id: 'ceo.risk-overview', label: 'Risk & Opportunities', labelKey: 'navigation.page.risk_overview', icon: ShieldAlert }
        ]
      },
      { 
        id: 'ceo.decision-governance', label: 'Decision Governance', labelKey: 'navigation.group.ceo.decision', icon: Brain,
        children: [
          { id: 'institutional_ios', label: 'Institutional iOS', labelKey: 'navigation.page.institutional_ios', icon: Scale, masterOnly: true }
        ]
      }
    ]
  },
  {
    group: 'CFO Office', groupKey: 'navigation.group.cfo_office', officeId: 'cfo-office', category: 'executive-office',
    icon: Landmark,
    items: [
      {
        id: 'cfo.executive-dashboard', label: 'Executive Dashboard', labelKey: 'navigation.group.cfo.dashboard', icon: LayoutDashboard,
        children: [
          { id: 'dashboard_gestao', label: 'Dashboard Adm Fin', labelKey: 'navigation.page.dashboard_gestao', icon: LayoutDashboard }
        ]
      },
      {
        id: 'cfo.financial-reporting', label: 'Financial Reporting', labelKey: 'navigation.group.cfo.reporting', icon: FileText,
        children: [
          { id: 'dre', label: 'DRE Contábil', labelKey: 'navigation.page.dre', icon: FileText },
          { id: 'dre_gerencial', label: 'DRE Gerencial Estratégica', labelKey: 'navigation.page.dre_gerencial', icon: LineChart },
          { id: 'bp', label: 'Balanço Patrimonial', labelKey: 'navigation.page.bp', icon: BookOpen },
          { id: 'dfc', label: 'DFC Contábil', labelKey: 'navigation.page.dfc', icon: ArrowRightLeft },
          { id: 'dlpa', label: 'DLPA Contábil', labelKey: 'navigation.page.dlpa', icon: BookOpen }
        ]
      },
      {
        id: 'cfo.treasury-liquidity', label: 'Treasury & Liquidity', labelKey: 'navigation.group.cfo.treasury', icon: CircleDollarSign,
        children: [
          { id: 'caixa', label: 'Fluxo de Caixa Consolidado', labelKey: 'navigation.page.caixa', icon: CircleDollarSign },
          { id: 'contas_receber', label: 'Gestão de Contas a Receber', labelKey: 'navigation.page.contas_receber', icon: ArrowUpRight },
          { id: 'contas_pagar', label: 'Fluxo de Contas a Pagar', labelKey: 'navigation.page.contas_pagar', icon: CreditCard },
          { id: 'ativos_financeiros', label: 'Gestão de Ativos Financeiros', labelKey: 'navigation.page.ativos_financeiros', icon: WalletCards }
        ]
      },
      {
        id: 'cfo.capital-structure', label: 'Capital Structure', labelKey: 'navigation.group.cfo.capital_structure', icon: Landmark,
        children: [
          { id: 'emprestimos', label: 'Gestão de Passivos', labelKey: 'navigation.page.emprestimos', icon: CreditCard },
          { id: 'posicao_financeira', label: 'Posição Financeira', labelKey: 'navigation.page.posicao_financeira', icon: Landmark }
        ]
      },
      {
        id: 'cfo.financial-performance', label: 'Financial Performance', labelKey: 'navigation.group.cfo.performance', icon: TrendingUp,
        children: [
          { id: 'analise_financeira', label: 'Financial Performance Governance', labelKey: 'navigation.page.financial_performance_governance', icon: Coins }
        ]
      },
      {
        id: 'cfo.fpa', label: 'FP&A', labelKey: 'navigation.group.cfo.fpa', icon: Brain,
        children: [
          { id: 'orcamento', label: 'Orçamento & Budget', labelKey: 'navigation.page.orcamento', icon: PiggyBank },
          { id: 'modelagem', label: 'Engenharia Financeira', labelKey: 'navigation.page.modelagem', icon: LayoutGrid },
          { id: 'simulador_capital', label: 'Simulador de Captação', labelKey: 'navigation.page.simulador_capital', icon: Magnet },
          { id: 'tax_reform_impact', label: 'Simulador de Impacto Tributário', labelKey: 'navigation.page.tax_reform_impact', icon: Percent }
        ]
      }
    ]
  },
  {
    group: 'COO Office', groupKey: 'navigation.group.coo_office', officeId: 'coo-office', category: 'executive-office',
    icon: HardDrive,
    items: [
      { id: 'coo.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.coo.executive-overview', icon: HardDrive },
      {
        id: 'coo.operations', label: 'Operations', labelKey: 'navigation.group.coo.operations', icon: Factory,
        children: [
          { id: 'coo.process-execution', label: 'Process & Execution', labelKey: 'navigation.page.coo.process-execution', icon: Factory },
          { id: 'coo.operational-excellence', label: 'Operational Excellence', labelKey: 'navigation.page.coo.operational-excellence', icon: Activity }
        ]
      },
      {
        id: 'coo.supply-chain', label: 'Supply Chain', labelKey: 'navigation.group.coo.supply', icon: Layers,
        children: [
          { id: 'coo.logistics-supply-chain', label: 'Logistics & Supply Chain', labelKey: 'navigation.page.coo.logistics-supply-chain', icon: Layers }
        ]
      },
      {
        id: 'coo.procurement', label: 'Procurement', labelKey: 'navigation.group.coo.procurement', icon: ShoppingBag,
        children: [
          { id: 'coo.procurement-governance', label: 'Procurement Governance', labelKey: 'navigation.page.coo.procurement-governance', icon: ShoppingBag }
        ]
      }
    ]
  },
  {
    group: 'Commercial Office', groupKey: 'navigation.group.commercial_office', officeId: 'commercial-office', category: 'executive-office',
    icon: ShoppingBag,
    items: [
      { id: 'commercial.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.commercial_overview', icon: LayoutDashboard },
      { id: 'commercial.revenue-governance', label: 'Revenue Governance', labelKey: 'navigation.page.revenue_governance', icon: TrendingUp },
      { 
        id: 'commercial.commercial-execution', label: 'Commercial Execution', labelKey: 'navigation.group.commercial.execution', icon: Target,
        children: [
          { id: 'commercial.pipeline-governance', label: 'Pipeline Governance', labelKey: 'navigation.page.pipeline_governance', icon: Target },
          { id: 'commercial.opportunity-management', label: 'Opportunity Management', labelKey: 'navigation.page.opportunity_management', icon: Briefcase }
        ]
      },
      { 
        id: 'commercial.market-customer', label: 'Market & Customer Governance', labelKey: 'navigation.group.commercial.customer', icon: Users,
        children: [
          { id: 'commercial.customer-governance', label: 'Customer Governance', labelKey: 'navigation.page.customer_governance', icon: Users }
        ]
      },
      { 
        id: 'commercial.partner-ecosystem', label: 'Partner Ecosystem', labelKey: 'navigation.group.commercial.partner', icon: Handshake,
        children: [
          { id: 'commercial.partner-revenue', label: 'Partner Revenue', labelKey: 'navigation.page.partner_revenue', icon: Handshake }
        ]
      },
      { 
        id: 'commercial.revenue-forecast', label: 'Revenue Forecast', labelKey: 'navigation.group.commercial.forecast', icon: LineChart,
        children: [
          { id: 'commercial.forecast-governance', label: 'Forecast Governance', labelKey: 'navigation.page.forecast_governance', icon: LineChart }
        ]
      }
    ]
  },
  {
    group: 'People Office', groupKey: 'navigation.group.people_office', officeId: 'people-office', category: 'executive-office',
    icon: Users,
    items: [
      { id: 'people.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.people.executive-overview', icon: Users },
      { 
        id: 'people.workforce', label: 'Workforce', labelKey: 'navigation.group.people.workforce', icon: Boxes,
        children: [
          { id: 'people.workforce-governance', label: 'Workforce & Capacity', labelKey: 'navigation.page.people.workforce', icon: Boxes }
        ]
      },
      { 
        id: 'people.culture', label: 'Culture & Engagement', labelKey: 'navigation.group.people.culture', icon: PieChart,
        children: [
          { id: 'people.culture-engagement', label: 'Organizational Culture', labelKey: 'navigation.page.people.culture', icon: PieChart }
        ]
      },
      { 
        id: 'people.leadership', label: 'Leadership', labelKey: 'navigation.group.people.leadership', icon: Star,
        children: [
          { id: 'people.leadership-governance', label: 'Leadership Governance', labelKey: 'navigation.page.people.leadership', icon: Star }
        ]
      },
      { 
        id: 'people.costs', label: 'People Costs', labelKey: 'navigation.group.people.costs', icon: CircleDollarSign,
        children: [
          { id: 'people.people-costs', label: 'People Financial Impact', labelKey: 'navigation.page.people.costs', icon: CircleDollarSign }
        ]
      },
      { 
        id: 'people.capability', label: 'Capability Development', labelKey: 'navigation.group.people.learning', icon: Presentation,
        children: [
          { id: 'people.learning-development', label: 'Capability Development', labelKey: 'navigation.page.people.learning', icon: Presentation }
        ]
      },
      { 
        id: 'people.organizational-governance', label: 'Organizational Governance', labelKey: 'navigation.group.people.org', icon: Network,
        children: [
          { id: 'people.organizational-governance', label: 'Organizational Governance', labelKey: 'navigation.page.people.org', icon: Network }
        ]
      }
    ]
  },
  {
    group: 'Governance Office', groupKey: 'navigation.group.governance_office', officeId: 'governance-office', category: 'executive-office',
    icon: Scale,
    items: [
      { id: 'governance.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.governance.executive-overview', icon: Scale },
      { 
        id: 'governance.corporate-policies', label: 'Corporate Policies', labelKey: 'navigation.group.governance.policies', icon: Target,
        children: [
          { id: 'governance.strategic-alignment', label: 'Strategic Alignment', labelKey: 'navigation.page.governance.strategic', icon: Target }
        ]
      },
      { 
        id: 'governance.decision-governance', label: 'Decision Governance', labelKey: 'navigation.group.governance.decision', icon: BrainCircuit,
        children: [
          { id: 'governance.decision-governance', label: 'Decision Governance', labelKey: 'navigation.page.governance.decision', icon: BrainCircuit }
        ]
      },
      { 
        id: 'governance.institutional-alignment', label: 'Institutional Alignment', labelKey: 'navigation.group.governance.alignment', icon: Users,
        children: [
          { id: 'governance.board-governance', label: 'Board Governance', labelKey: 'navigation.page.governance.board', icon: Users }
        ]
      },
      { 
        id: 'governance.decision-governance', label: 'Decision Governance', labelKey: 'navigation.group.governance.governance', icon: ShieldCheck,
        children: [
          { id: 'governance.governance-maturity', label: 'Governance Maturity', labelKey: 'navigation.page.governance.maturity', icon: ShieldCheck }
        ]
      }
    ]
  },
  {
    group: 'Risk & Compliance Office', groupKey: 'navigation.group.risk_office', officeId: 'risk-office', category: 'executive-office',
    icon: ShieldAlert,
    items: [
      { id: 'risk.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.risk.executive-overview', icon: ShieldAlert },
      { 
        id: 'risk.enterprise-risk', label: 'Enterprise Risk', labelKey: 'navigation.group.risk.enterprise', icon: AlertTriangle,
        children: [
          { id: 'risk.enterprise-risk', label: 'Enterprise Risk', labelKey: 'navigation.page.risk.enterprise', icon: AlertTriangle },
          { id: 'risk.enterprise-resilience', label: 'Enterprise Resilience', labelKey: 'navigation.page.risk.resilience', icon: Activity }
        ]
      },
      { 
        id: 'risk.compliance', label: 'Compliance', labelKey: 'navigation.group.risk.compliance', icon: ShieldCheck,
        children: [
          { id: 'risk.compliance-governance', label: 'Compliance Governance', labelKey: 'navigation.page.risk.compliance', icon: ShieldCheck }
        ]
      },
      { 
        id: 'risk.internal-audit', label: 'Internal Audit', labelKey: 'navigation.group.risk.audit', icon: FileCheck,
        children: [
          { id: 'risk.audit-governance', label: 'Audit Governance', labelKey: 'navigation.page.risk.audit', icon: FileCheck }
        ]
      },
      { 
        id: 'risk.decision-governance', label: 'Decision Governance', labelKey: 'navigation.group.risk.decision', icon: Compass,
        children: [
          { id: 'risk.risk-governance', label: 'Risk Governance', labelKey: 'navigation.page.risk.governance', icon: Compass },
          { id: 'risk.control-maturity', label: 'Control Maturity', labelKey: 'navigation.page.risk.control', icon: Lock }
        ]
      }
    ]
  },
  {
    group: 'Innovation Office', groupKey: 'navigation.group.innovation_office', officeId: 'innovation-office', category: 'executive-office',
    icon: Zap,
    items: [
      { id: 'innovation.executive-overview', label: 'Executive Dashboard', labelKey: 'navigation.page.innovation.executive-overview', icon: Zap },
      { 
        id: 'innovation.innovation-portfolio', label: 'Innovation Portfolio', labelKey: 'navigation.group.innovation.portfolio', icon: Activity,
        children: [
          { id: 'innovation.innovation-portfolio', label: 'Innovation Portfolio', labelKey: 'navigation.page.innovation.portfolio', icon: Activity },
          { id: 'innovation.opportunity-governance', label: 'Opportunity Governance', labelKey: 'navigation.page.innovation.opportunity', icon: Compass }
        ]
      },
      { 
        id: 'innovation.research-development', label: 'Research & Development', labelKey: 'navigation.group.innovation.rd', icon: Settings,
        children: [
          { id: 'innovation.experiment-management', label: 'Experiment Management', labelKey: 'navigation.page.innovation.experiment', icon: Settings }
        ]
      },
      { 
        id: 'innovation.digital-transformation', label: 'Digital Transformation', labelKey: 'navigation.group.innovation.digital', icon: Lock,
        children: [
          { id: 'innovation.digital-transformation', label: 'Digital Transformation', labelKey: 'navigation.page.innovation.digital', icon: Lock }
        ]
      },
      { 
        id: 'innovation.knowledge-evolution', label: 'Knowledge Evolution', labelKey: 'navigation.group.innovation.knowledge', icon: Bookmark,
        children: [
          { id: 'innovation.knowledge-evolution', label: 'Knowledge Evolution', labelKey: 'navigation.page.innovation.knowledge', icon: Bookmark }
        ]
      },
      { 
        id: 'innovation.decision-governance', label: 'Decision Governance', labelKey: 'navigation.group.innovation.decision', icon: Compass,
        children: [
          { id: 'innovation.innovation-governance', label: 'Innovation Governance', labelKey: 'navigation.page.innovation.governance', icon: Compass }
        ]
      }
    ]
  },

  // --- GOVERNANCE LAYER (Board Independence) ---
  {
    group: 'Board Governance™', groupKey: 'navigation.group.board_governance', officeId: 'board-office', category: 'board',
    icon: Presentation,
    items: [
      { 
        id: 'board.capital-governance', label: 'Capital Governance', labelKey: 'navigation.group.board.capital', icon: Scale,
        children: [
          { id: 'capital_governance_center', label: 'Capital Governance Center', labelKey: 'navigation.page.capital_governance_center', icon: Scale }
        ]
      },
      { 
        id: 'board.institutional-governance', label: 'Institutional Governance', labelKey: 'navigation.group.board.institutional', icon: Building2,
        children: [
          { id: 'institutional_structure_center', label: 'Institutional Structure Center', labelKey: 'navigation.page.institutional_structure_center', icon: Users },
          { id: 'institutional_board_pack', label: 'Board Pack Institucional', labelKey: 'navigation.page.institutional_board_pack', icon: FileText },
          { id: 'board_deck_center', label: 'Board Deck Center', labelKey: 'navigation.page.board_deck_center', icon: Presentation },
          { id: 'sovereign_decision_center', label: 'Sovereign Decision Center', labelKey: 'navigation.page.sovereign_decision_center', icon: Activity }
        ]
      },
      { 
        id: 'board.leadership-oversight', label: 'Leadership Oversight', labelKey: 'navigation.group.board.leadership', icon: Users,
        children: [
          { id: 'leadership_dna_center', label: 'Leadership DNA Center', labelKey: 'navigation.page.leadership_dna_center', icon: Users },
          { id: 'executive_monitoring_center', label: 'Executive Monitoring Center', labelKey: 'navigation.page.executive_monitoring_center', icon: Target }
        ]
      },
      { 
        id: 'board.strategic-continuity', label: 'Strategic Continuity', labelKey: 'navigation.group.board.continuity', icon: HeartPulse,
        children: [
          { id: 'institutional_continuity', label: 'Institutional Continuity Cockpit', labelKey: 'navigation.page.institutional_continuity', icon: HeartPulse }
        ]
      },
      { 
        id: 'board.fiduciary-governance', label: 'Fiduciary Governance', labelKey: 'navigation.group.board.fiduciary', icon: ShieldAlert,
        children: [
          { id: 'risk_exposure_center', label: 'Risk Exposure Center', labelKey: 'navigation.page.risk_exposure_center', icon: ShieldAlert }
        ]
      }
    ]
  },

  // --- ECOSYSTEM LAYER (Advisor Independence) ---
  {
    group: 'Advisor Network™', groupKey: 'navigation.group.advisor_network', category: 'partner',
    icon: Briefcase,
    items: [
      { id: 'portfolio', label: 'Portfólio', labelKey: 'navigation.page.portfolio', icon: Briefcase },
      { id: 'advisor_workspace', label: 'Advisor Workspace', labelKey: 'navigation.page.advisor_workspace', icon: Briefcase, masterOnly: true },
      { id: 'client_workspace', label: 'Client Executive Workspace', labelKey: 'navigation.page.client_workspace', icon: LayoutDashboard }
    ]
  },

  // --- COGNITIVE LAYER (Enterprise Intelligence) ---
  {
    group: 'Enterprise Governance', groupKey: 'navigation.group.governance_domains', officeId: 'enterprise-governance', category: 'governance',
    icon: Network,
    items: [
      { 
        id: 'enterprise.governance-hub', label: 'Governance Hub', labelKey: 'navigation.group.enterprise.hub', icon: Network,
        children: [
          { id: 'governance.preview', label: 'Governance Preview', labelKey: 'navigation.page.governance_preview', icon: Network },
          { id: 'dashboard_inovacao', label: 'Dashboard de Inovação', labelKey: 'navigation.page.dashboard_inovacao', icon: Zap },
          { id: 'indicadores', label: 'Análise de KPIs', labelKey: 'navigation.page.indicadores', icon: TrendingUp }
        ]
      },
      { 
        id: 'enterprise.predictive-insights', label: 'Predictive Insights', labelKey: 'navigation.group.enterprise.predictive', icon: FlaskConical,
        children: [
          { id: 'lab', label: 'Executive Scenario Lab', labelKey: 'navigation.page.lab', icon: FlaskConical },
          { id: 'viabilidade', label: 'Projetos de Inovação', labelKey: 'navigation.page.viabilidade', icon: Rocket }
        ]
      },
      { 
        id: 'enterprise.governance-engines', label: 'Governance Governance Engines', labelKey: 'navigation.group.enterprise.governance', icon: Brain,
        children: [
          { id: 'governance_maturity_center', label: 'Governance Maturity Center', labelKey: 'navigation.page.governance_maturity_center', icon: Target },
          { id: 'fiduciary_validation_center', label: 'Fiduciary Validation Center', labelKey: 'navigation.page.fiduciary_validation_center', icon: Scale },
          { id: 'economic_normalization_center', label: 'Economic Normalization Center', labelKey: 'navigation.page.economic_normalization_center', icon: Scale },
          { id: 'operational_governance', label: 'Operational Governance Center', labelKey: 'navigation.page.operational_governance', icon: ShieldCheck },
          { id: 'product_governance_center', label: 'Product Governance Center', labelKey: 'navigation.page.product_governance_center', icon: PackageCheck, masterOnly: true },
          { id: 'governance_orchestration', label: 'Governance Orchestration', labelKey: 'navigation.page.governance_orchestration', icon: ArrowUpRightSquare, masterOnly: true },
          { id: 'esgim_assessment', label: 'Avaliação ESGIM™', labelKey: 'navigation.page.esgim_assessment', icon: Brain }
        ]
      },
      { 
        id: 'enterprise.risk-analytics', label: 'Risk Analytics Engine', labelKey: 'navigation.group.enterprise.risk', icon: ShieldAlert,
        children: [
          { id: 'compliance_integrity_center', label: 'Integridade & Compliance', labelKey: 'navigation.page.compliance_integrity_center', icon: ShieldCheck },
          { id: 'crisis_response_center', label: 'Crisis Response Center', labelKey: 'navigation.page.crisis_response_center', icon: Siren, masterOnly: true }
        ]
      },
      { 
        id: 'enterprise.institutional-memory', label: 'Institutional Memory', labelKey: 'navigation.group.enterprise.memory', icon: History,
        children: [
          { id: 'institutional_memory_center', label: 'Institutional Memory Center', labelKey: 'navigation.page.institutional_memory_center', icon: History }
        ]
      },
      { 
        id: 'enterprise.decision-governance', label: 'Decision Governance', labelKey: 'navigation.group.enterprise.decision', icon: GitBranchPlus,
        children: [
          { id: 'decision_lifecycle_center', label: 'Decision Lifecycle Center', labelKey: 'navigation.page.decision_lifecycle_center', icon: GitBranchPlus },
          { id: 'credit_committee_center', label: 'Credit Committee Simulator', labelKey: 'navigation.page.credit_committee_center', icon: Landmark }
        ]
      },
      { 
        id: 'enterprise.financial-lineage', label: 'Financial Lineage', labelKey: 'navigation.group.enterprise.financial', icon: GitBranchPlus,
        children: [
          { id: 'financial_lineage_center', label: 'Linhagem Fiduciária', labelKey: 'navigation.page.financial_lineage_center', icon: GitBranchPlus }
        ]
      }
    ]
  },

  // --- FOUNDATION LAYER (Enterprise Foundation) ---
  {
    group: 'Enterprise Foundation', groupKey: 'navigation.group.data_foundation', officeId: 'data-foundation', category: 'foundation',
    icon: Database,
    items: [
      { 
        id: 'foundation.master-data', label: 'Master Data', labelKey: 'navigation.group.foundation.master', icon: Building2,
        children: [
          { id: 'clientes', label: 'Empresas', labelKey: 'navigation.page.clientes', icon: Building2 },
          { id: 'parceiros', label: 'Parceiros Estratégicos', labelKey: 'navigation.page.parceiros', icon: Handshake, masterOnly: true }
        ]
      },
      { 
        id: 'foundation.business-rules', label: 'Business Rules', labelKey: 'navigation.group.foundation.rules', icon: Settings2,
        children: [
          { id: 'premissas_economicas', label: 'Premissas do Sistema', labelKey: 'navigation.page.premissas_economicas', icon: Settings2 }
        ]
      },
      { 
        id: 'foundation.chart-accounts', label: 'Chart of Accounts', labelKey: 'navigation.group.foundation.accounts', icon: List,
        children: [
          { id: 'plano_contas', label: 'Plano Contas Contabilidade', labelKey: 'navigation.page.plano_contas', icon: List },
          { id: 'plano_contas_gerencial', label: 'Plano de Contas Gerencial', labelKey: 'navigation.page.plano_contas_gerencial', icon: List }
        ]
      },
      { 
        id: 'foundation.data-collection', label: 'Data Collection', labelKey: 'navigation.group.foundation.collection', icon: Database,
        children: [
          { id: 'dados_historicos', label: 'Central de Coleta de Dados', labelKey: 'navigation.page.dados_historicos', icon: Database }
        ]
      },
      { 
        id: 'foundation.data-maintenance', label: 'Data Maintenance', labelKey: 'navigation.group.foundation.maintenance', icon: DatabaseBackup,
        children: [
          { id: 'maintenance', label: 'Manutenção de Dados', labelKey: 'navigation.page.maintenance', icon: DatabaseBackup }
        ]
      }
    ]
  },

  // --- PLATFORM LAYER (Platform Administration) ---
  {
    group: 'Platform Administration', groupKey: 'navigation.group.administration', officeId: 'administration', category: 'administration',
    icon: Settings,
    items: [
      { 
        id: 'admin.identity', label: 'Identity & Access', labelKey: 'navigation.group.admin.identity', icon: UserPlus,
        children: [
          { id: 'gestao_usuarios', label: 'Usuários', labelKey: 'navigation.page.gestao_usuarios', icon: UserPlus, masterOnly: true },
          { id: 'perfil_usuario', label: 'Gestão de Perfil', labelKey: 'navigation.page.perfil_usuario', icon: UserCog }
        ]
      },
      { 
        id: 'admin.global-settings', label: 'Global Settings', labelKey: 'navigation.group.admin.global', icon: Settings,
        children: [
          { id: 'workspace', label: 'Global Settings & Admin', labelKey: 'navigation.page.administration.workspace', icon: Settings },
          { id: 'configuracoes_sistema', label: 'Preferências do Sistema', labelKey: 'navigation.page.configuracoes_sistema', icon: Settings },
          { id: 'suporte', label: 'Suporte', labelKey: 'navigation.page.suporte', icon: LifeBuoy },
          { id: 'mensagens', label: 'Mensagens e Comunicados', labelKey: 'navigation.page.mensagens', icon: Bell }
        ]
      },
      { 
        id: 'admin.workflows', label: 'Workflows', labelKey: 'navigation.group.admin.workflows', icon: CheckSquare,
        children: [
          { id: 'aprovacoes', label: 'Aprovações de Documentos', labelKey: 'navigation.page.aprovacoes', icon: CheckSquare, masterOnly: true }
        ]
      },
      { 
        id: 'admin.branding', label: 'Branding & Identity', labelKey: 'navigation.group.admin.branding', icon: Building2,
        children: [
          { id: 'partner_brand_configuration', label: 'Identidade Institucional (EBIL)', labelKey: 'navigation.page.partner_brand_configuration', icon: Building2 }
        ]
      },
      { 
        id: 'admin.academy', label: 'Academy', labelKey: 'navigation.group.admin.academy', icon: GraduationCap,
        children: [
          { id: 'academy_admin', label: 'Gestão da Academia', labelKey: 'navigation.page.academy_admin', icon: Settings2, masterOnly: true }
        ]
      },
      { 
        id: 'admin.tenant-management', label: 'Tenant Management', labelKey: 'navigation.group.admin.tenant', icon: Database,
        children: [
          { id: 'institutional_onboarding', label: 'Institutional Onboarding', labelKey: 'navigation.page.institutional_onboarding', icon: Building2, masterOnly: true },
          { id: 'multi_tenant_governance_center', label: 'Multi-Tenant Governance Center', labelKey: 'navigation.page.multi_tenant_governance_center', icon: ShieldCheck, masterOnly: true },
          { id: 'revenue.access', label: 'License & Entitlement', labelKey: 'navigation.page.revenue_access', icon: ShieldCheck },
          { id: 'revenue.tenants', label: 'Tenant Operations', labelKey: 'navigation.page.revenue_tenants', icon: Database }
        ]
      },
      { 
        id: 'admin.revenue', label: 'Revenue Management', labelKey: 'navigation.group.admin.revenue', icon: TrendingUp,
        children: [
          { id: 'platform.revenue-center', label: 'Revenue Center', labelKey: 'navigation.page.platform_revenue', icon: TrendingUp },
          { id: 'platform.pipeline-governance', label: 'Pipeline Governance', labelKey: 'navigation.page.platform_pipeline', icon: Target },
          { id: 'platform.partner-center', label: 'Partner Center', labelKey: 'navigation.page.platform_partner', icon: Handshake },
          { id: 'revenue.command-center', label: 'Command Center', labelKey: 'navigation.page.revenue_command_center', icon: Target },
          { id: 'revenue.pipeline', label: 'Commercial Pipeline', labelKey: 'navigation.page.revenue_pipeline', icon: Briefcase },
          { id: 'revenue.deal-room', label: 'Nova Oportunidade (Deal Room)', labelKey: 'navigation.page.revenue_deal_room', icon: Target },
          { id: 'revenue.contracts', label: 'Contract Management', labelKey: 'navigation.page.revenue_contracts', icon: FileCheck },
          { id: 'revenue.subscriptions', label: 'Subscription Governance', labelKey: 'navigation.page.revenue_subscriptions', icon: CircleDollarSign },
          { id: 'revenue.billing', label: 'Billing Operations', labelKey: 'navigation.page.revenue_billing', icon: CreditCard },
          { id: 'revenue.governance', label: 'Revenue Governance', labelKey: 'navigation.page.revenue_governance', icon: Brain },
          { id: 'revenue.partners', label: 'Partner Network', labelKey: 'navigation.page.revenue_partners', icon: Handshake },
          { id: 'revenue.advisors', label: 'Certified Advisors', labelKey: 'navigation.page.revenue_advisors', icon: Users },
          { id: 'revenue.institutions', label: 'Executive Partners', labelKey: 'navigation.page.revenue_institutions', icon: Building2 }
        ]
      },
      { 
        id: 'admin.runtime', label: 'Runtime Operations', labelKey: 'navigation.group.admin.runtime', icon: Activity,
        children: [
          { id: 'deployment_readiness', label: 'Deployment Readiness Layer', labelKey: 'navigation.page.deployment_readiness', icon: ShieldCheck, masterOnly: true },
          { id: 'runtime_observability_center', label: 'Runtime Observability Center', labelKey: 'navigation.page.runtime_observability_center', icon: Activity, masterOnly: true },
          { id: 'revenue.runtime', label: 'Runtime Operations', labelKey: 'navigation.page.revenue_runtime', icon: Activity },
          { id: 'pilot_monitoring', label: 'Painel Operacional Piloto', labelKey: 'navigation.page.pilot_monitoring', icon: Activity, masterOnly: true },
          { id: 'calibration_playground', label: 'Calibration Playground', labelKey: 'navigation.page.calibration_playground', icon: Sparkles, masterOnly: true },
          { id: 'pilot_experience', label: 'Pilot Experience Dashboard', labelKey: 'navigation.page.pilot_experience', icon: BarChart3, masterOnly: true },
          { id: 'pilot_operations_center', label: 'Pilot Operations Center', labelKey: 'navigation.page.pilot_operations_center', icon: ShieldCheck, masterOnly: true }
        ]
      }
    ]
  }
];
export const NAVIGATION_GROUPS: WorkspaceNavigationGroup[] = RAW_NAVIGATION_GROUPS.map(group => ({
  ...group,
  items: sortNavItems(group.items)
}));
