export interface ExecutiveCommand {
  id: string;
  keywords: string[];
  title: string;
  subtitle?: string;
  targetPath: string;
  office: string;
}

export const COMMAND_REGISTRY: ExecutiveCommand[] = [
  {
    id: 'cmd-liquidity-risk',
    keywords: ['risco de caixa', 'liquidez', 'runway', 'caixa', 'cash'],
    title: 'Visualizar Risco de Liquidez',
    subtitle: 'CFO Office > Cash Governance',
    targetPath: '/finance/cash-flow', // Will map to new routes once updated
    office: 'cfo'
  },
  {
    id: 'cmd-revenue-performance',
    keywords: ['receita', 'faturamento', 'vendas', 'margem', 'dre'],
    title: 'Analisar Performance de Receita',
    subtitle: 'CFO Office > Financial Performance',
    targetPath: '/finance/dre',
    office: 'cfo'
  },
  {
    id: 'cmd-budget-variance',
    keywords: ['budget', 'orçamento', 'desvio', 'planejamento', 'forecast'],
    title: 'Comparativo Orçado vs Realizado',
    subtitle: 'CFO Office > Planning & Forecast',
    targetPath: '/finance/modeling',
    office: 'cfo'
  },
  {
    id: 'cmd-client-portfolio',
    keywords: ['clientes', 'carteira', 'advisor', 'compliance'],
    title: 'Portfólio de Clientes',
    subtitle: 'Advisor Office',
    targetPath: '/risk/compliance',
    office: 'advisor'
  }
];

export const searchCommands = (query: string): ExecutiveCommand[] => {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase().trim();
  return COMMAND_REGISTRY.filter(cmd => 
    cmd.title.toLowerCase().includes(normalizedQuery) ||
    cmd.keywords.some(kw => kw.toLowerCase().includes(normalizedQuery))
  );
};
