export interface GovernanceRecommendation {
  id: string;
  category: 'Governança' | 'Gestão' | 'Pessoas' | 'Processos';
  title: string;
  description: string;
  impactLevel: 'Alto' | 'Médio' | 'Baixo';
  implementationEffort: 'Alto' | 'Médio' | 'Baixo';
  triggerIRGThreshold: number; // Minimum IRG to trigger this
  triggerGPIThreshold: number; // Minimum GPI to trigger this
}

export const GovernanceCatalog: GovernanceRecommendation[] = [
  // Governança
  { id: 'gov-01', category: 'Governança', title: 'Estruturar Conselho Consultivo', description: 'Formação de conselho focado em aconselhamento estratégico e suporte às decisões.', impactLevel: 'Alto', implementationEffort: 'Médio', triggerIRGThreshold: 40, triggerGPIThreshold: 50 },
  { id: 'gov-02', category: 'Governança', title: 'Formalizar Conselho de Administração', description: 'Implantação de governança fiduciária com membros independentes e deveres estatutários.', impactLevel: 'Alto', implementationEffort: 'Alto', triggerIRGThreshold: 60, triggerGPIThreshold: 70 },
  { id: 'gov-03', category: 'Governança', title: 'Criar Comitê Financeiro', description: 'Comitê auxiliar para escrutínio de tesouraria, fluxo de caixa e alocação de capital.', impactLevel: 'Médio', implementationEffort: 'Baixo', triggerIRGThreshold: 20, triggerGPIThreshold: 30 },
  { id: 'gov-04', category: 'Governança', title: 'Criar Comitê de Estratégia', description: 'Fórum especializado para monitoramento do plano de negócios e cenários estruturais.', impactLevel: 'Alto', implementationEffort: 'Médio', triggerIRGThreshold: 30, triggerGPIThreshold: 40 },
  
  // Gestão
  { id: 'ges-01', category: 'Gestão', title: 'Implantar orçamento matricial', description: 'Mecanismo de controle orçamentário cruzado para redução de despesas fixas.', impactLevel: 'Médio', implementationEffort: 'Alto', triggerIRGThreshold: 20, triggerGPIThreshold: 25 },
  { id: 'ges-02', category: 'Gestão', title: 'Formalizar processo decisório', description: 'Estruturação de fluxos de aprovação claros para evitar gargalos na alta gestão.', impactLevel: 'Alto', implementationEffort: 'Baixo', triggerIRGThreshold: 10, triggerGPIThreshold: 20 },
  { id: 'ges-03', category: 'Gestão', title: 'Criar política de alçadas', description: 'Definição de limites financeiros e operacionais por nível hierárquico.', impactLevel: 'Alto', implementationEffort: 'Baixo', triggerIRGThreshold: 10, triggerGPIThreshold: 30 },
  { id: 'ges-04', category: 'Gestão', title: 'Estruturar gestão por indicadores', description: 'Desdobramento do planejamento estratégico em KPIs operacionais e painéis.', impactLevel: 'Alto', implementationEffort: 'Médio', triggerIRGThreshold: 30, triggerGPIThreshold: 30 },

  // Pessoas
  { id: 'pes-01', category: 'Pessoas', title: 'Criar avaliação de desempenho', description: 'Estruturar ritos de feedback e medição de metas individuais e coletivas.', impactLevel: 'Médio', implementationEffort: 'Médio', triggerIRGThreshold: 40, triggerGPIThreshold: 30 },
  { id: 'pes-02', category: 'Pessoas', title: 'Estruturar sucessão', description: 'Mapeamento e desenvolvimento de líderes para posições chave da organização.', impactLevel: 'Alto', implementationEffort: 'Alto', triggerIRGThreshold: 50, triggerGPIThreshold: 40 },
  { id: 'pes-03', category: 'Pessoas', title: 'Fortalecer liderança média', description: 'Programa focado em capacitar gestores intermediários para suportar crescimento.', impactLevel: 'Alto', implementationEffort: 'Médio', triggerIRGThreshold: 25, triggerGPIThreshold: 50 },

  // Processos
  { id: 'pro-01', category: 'Processos', title: 'Mapear processos críticos', description: 'Documentação da cadeia de valor principal para mitigar falhas operacionais.', impactLevel: 'Alto', implementationEffort: 'Alto', triggerIRGThreshold: 20, triggerGPIThreshold: 40 },
  { id: 'pro-02', category: 'Processos', title: 'Formalizar gestão de riscos', description: 'Matriz de probabilidade e impacto para as principais ameaças do negócio.', impactLevel: 'Médio', implementationEffort: 'Médio', triggerIRGThreshold: 35, triggerGPIThreshold: 60 },
  { id: 'pro-03', category: 'Processos', title: 'Estruturar compliance', description: 'Criação de código de conduta e canal de denúncias para prevenção passiva.', impactLevel: 'Baixo', implementationEffort: 'Médio', triggerIRGThreshold: 45, triggerGPIThreshold: 20 }
];
