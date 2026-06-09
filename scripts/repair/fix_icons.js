import fs from 'fs';

let content = fs.readFileSync('src/app/navigation.ts', 'utf8');

// Replace duplicate icons in the file

const replacements = [
  // Globe replacements
  { search: /\{ id: 'portfolio', label: 'Portfólio', icon: Globe \},/g, replace: "{ id: 'portfolio', label: 'Portfólio', icon: Briefcase }," },
  { search: /\{ id: 'planejamento_estrategico', label: 'Planejamento Estratégico', icon: Globe \},/g, replace: "{ id: 'planejamento_estrategico', label: 'Planejamento Estratégico', icon: Map }," },
  { search: /\{ id: 'marketing_estrategico', label: 'Marketing de Posicionamento', icon: Globe \},/g, replace: "{ id: 'marketing_estrategico', label: 'Marketing de Posicionamento', icon: Megaphone }," },
  
  // Cpu replacements
  { search: /\{ id: 'inteligencia_governanca', label: 'Inteligência de Governança', icon: Cpu \},/g, replace: "{ id: 'inteligencia_governanca', label: 'Inteligência de Governança', icon: Brain }," },

  // Activity replacements
  { search: /\{ id: 'lab', label: 'Executive Scenario Lab', icon: Activity \},/g, replace: "{ id: 'lab', label: 'Executive Scenario Lab', icon: FlaskConical }," },
  { search: /\{ id: 'observabilidade_institucional', label: 'Observabilidade Institucional', icon: Activity/g, replace: "{ id: 'observabilidade_institucional', label: 'Observabilidade Institucional', icon: Eye" },
  { search: /\{ id: 'runtime_observability', label: 'Observabilidade Institucional', icon: Activity/g, replace: "{ id: 'runtime_observability', label: 'Observabilidade Institucional', icon: Eye" },
  { search: /\{ id: 'diagnostico', label: 'Diagnóstico & IVE', icon: Activity \},/g, replace: "{ id: 'diagnostico', label: 'Diagnóstico & IVE', icon: HeartPulse }," },
  { search: /\{ id: 'administrativa_indicadores', label: 'Indicadores Administrativos', icon: Activity \},/g, replace: "{ id: 'administrativa_indicadores', label: 'Indicadores Administrativos', icon: BarChart2 }," },
  { search: /\{ id: 'dre_gerencial', label: 'DRE Gerencial Estratégica', icon: Activity \},/g, replace: "{ id: 'dre_gerencial', label: 'DRE Gerencial Estratégica', icon: LineChart }," },
  { search: /\{ id: 'producao', label: 'Produção & Processos', icon: Activity \},/g, replace: "{ id: 'producao', label: 'Produção & Processos', icon: Factory }," },

  // TrendingUp replacements
  { search: /\{ id: 'analise_mercado', label: 'Inteligência Competitiva', icon: TrendingUp \},/g, replace: "{ id: 'analise_mercado', label: 'Inteligência Competitiva', icon: Target }," },

  // Building2 replacements
  { search: /\{ id: 'admin_grupos', label: 'Gestão de Grupos Econômicos', icon: Building2/g, replace: "{ id: 'admin_grupos', label: 'Gestão de Grupos Econômicos', icon: Building" },

  // Users replacements
  { search: /\{ id: 'parceiros', label: 'Parceiros Estratégicos', icon: Users/g, replace: "{ id: 'parceiros', label: 'Parceiros Estratégicos', icon: Handshake" },
  { search: /\{ id: 'gestao_usuarios', label: 'Usuários', icon: Users/g, replace: "{ id: 'gestao_usuarios', label: 'Usuários', icon: UserPlus" },
  { search: /\{ id: 'estrutura_governanca', label: 'Estrutura de Governança', icon: Users \},/g, replace: "{ id: 'estrutura_governanca', label: 'Estrutura de Governança', icon: Waypoints }," },
  { search: /\{ id: 'custos_pessoal', label: 'Análise de Custos de Pessoal', icon: Users \},/g, replace: "{ id: 'custos_pessoal', label: 'Análise de Custos de Pessoal', icon: CircleDollarSign }," },
  { search: /\{ id: 'perfil_usuario', label: 'Gestão de Perfil', icon: Users \},/g, replace: "{ id: 'perfil_usuario', label: 'Gestão de Perfil', icon: UserCog }," },

  // Settings replacements
  { search: /\{ id: 'premissas_economicas', label: 'Premissas do Sistema', icon: Settings \},/g, replace: "{ id: 'premissas_economicas', label: 'Premissas do Sistema', icon: Settings2 }," },

  // Network replacements
  { search: /\{ id: 'institutional_knowledge_graph', label: 'Knowledge Graph', icon: Network,/g, replace: "{ id: 'institutional_knowledge_graph', label: 'Knowledge Graph', icon: GitGraph," },

  // Scale replacements
  { search: /\{ id: 'dlpa', label: 'DLPA Contábil', icon: Scale \},/g, replace: "{ id: 'dlpa', label: 'DLPA Contábil', icon: BookOpen }," },

  // Zap replacements
  { search: /\{ id: 'simulador_estrategico', label: 'Simulador de Valor', icon: Zap \},/g, replace: "{ id: 'simulador_estrategico', label: 'Simulador de Valor', icon: Gem }," },
  { search: /\{ id: 'desenvolvimento_humano', label: 'Desenvolvimento Humano', icon: Zap \},/g, replace: "{ id: 'desenvolvimento_humano', label: 'Desenvolvimento Humano', icon: GraduationCap }," },
  { search: /\{ id: 'simulador_capital', label: 'Simulador de Captação', icon: Zap \},/g, replace: "{ id: 'simulador_capital', label: 'Simulador de Captação', icon: Magnet }," },

  // ShieldCheck replacements
  { search: /\{ id: 'product_governance', label: 'Governança de Produto', icon: ShieldCheck/g, replace: "{ id: 'product_governance', label: 'Governança de Produto', icon: PackageCheck" },

  // Calculator replacements
  { search: /\{ id: 'orcamento', label: 'Orçamento & Budget', icon: Calculator \},/g, replace: "{ id: 'orcamento', label: 'Orçamento & Budget', icon: PiggyBank }," },

  // WalletCards replacements
  { search: /\{ id: 'dfc', label: 'DFC Contábil', icon: WalletCards \},/g, replace: "{ id: 'dfc', label: 'DFC Contábil', icon: ArrowRightLeft }," },
  { search: /\{ id: 'emprestimos', label: 'Gestão de Passivos', icon: WalletCards \},/g, replace: "{ id: 'emprestimos', label: 'Gestão de Passivos', icon: CreditCard }," },

  // ShoppingBag replacements
  { search: /\{ id: 'comercial_estrategico', label: 'Vendas & Mercado', icon: ShoppingBag \},/g, replace: "{ id: 'comercial_estrategico', label: 'Vendas & Mercado', icon: ShoppingCart }," },

  // Percent replacements
  { search: /\{ id: 'precificacao', label: 'Precificação & Margem', icon: Percent \},/g, replace: "{ id: 'precificacao', label: 'Precificação & Margem', icon: Tags }," },

  // Boxes replacements
  { search: /\{ id: 'analise_financeira', label: 'Inteligência de Capital', icon: Boxes \},/g, replace: "{ id: 'analise_financeira', label: 'Inteligência de Capital', icon: Coins }," },

  // MessageSquare replacements
  { search: /\{ id: 'cultura_feedback', label: 'Cultura de Feedback', icon: MessageSquare \},/g, replace: "{ id: 'cultura_feedback', label: 'Cultura de Feedback', icon: MessageCircle }," },
  { search: /\{ id: 'suporte', label: 'Suporte', icon: MessageSquare \},/g, replace: "{ id: 'suporte', label: 'Suporte', icon: LifeBuoy }," },

  // HardDrive replacements
  { search: /\{ id: 'maintenance', label: 'Manutenção de Dados', icon: HardDrive \},/g, replace: "{ id: 'maintenance', label: 'Manutenção de Dados', icon: DatabaseBackup }," }
];

replacements.forEach(r => {
  content = content.replace(r.search, r.replace);
});

// Update imports
const newImports = [
  'Map', 'Brain', 'Eye', 'HeartPulse', 'BarChart2', 'Factory', 'Building',
  'Handshake', 'UserPlus', 'Waypoints', 'UserCog', 'GitGraph',
  'Gem', 'GraduationCap', 'Magnet', 'PackageCheck', 'PiggyBank', 'ShoppingCart',
  'Tags', 'Coins', 'MessageCircle', 'LifeBuoy', 'DatabaseBackup'
];

let importBlock = content.match(/import\s*\{[\s\S]*?\}\s*from\s*'lucide-react';/)[0];
let currentImports = importBlock.replace(/import\s*\{/, '').replace(/\}\s*from\s*'lucide-react';/, '').split(',').map(s => s.trim()).filter(s => s.length > 0);

newImports.forEach(i => {
  if (!currentImports.includes(i)) {
    currentImports.push(i);
  }
});

currentImports.sort();
const newImportBlock = `import {\n  ${currentImports.join(',\n  ')}\n} from 'lucide-react';`;

content = content.replace(/import\s*\{[\s\S]*?\}\s*from\s*'lucide-react';/, newImportBlock);

fs.writeFileSync('src/app/navigation.ts', content);
console.log("Replaced duplicates!");
