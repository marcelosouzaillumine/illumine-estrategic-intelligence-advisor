import { EixoGestao } from '../types/modules';

export interface SacerdotalPrinciple {
  id: string;
  name: string;
  description: string;
  axis: EixoGestao;
  reference: string;
  businessApplication: string;
  risksWhenNeglected: string[];
  practicalRecommendations: string[];
}

export const SACERDOTAL_PRINCIPLES: SacerdotalPrinciple[] = [
  // Eixo: Governança
  {
    id: 'gov_1',
    name: 'Integridade',
    description: 'Agir com retidão e transparência em todas as decisões e processos.',
    axis: 'Governança',
    reference: 'Provérbios 11:3',
    businessApplication: 'Rastreabilidade e transparência decisória.',
    risksWhenNeglected: ['Corrupção', 'Perda de confiança de stakeholders', 'Riscos legais e de compliance'],
    practicalRecommendations: ['Implementar canal de denúncias', 'Auditorias regulares', 'Documentar todas as decisões de alto nível']
  },
  {
    id: 'gov_2',
    name: 'Conselho Plural',
    description: 'Buscar conselho na multidão de conselheiros.',
    axis: 'Governança',
    reference: 'Provérbios 11:14',
    businessApplication: 'Diversidade no board e processos decisórios não concentrados.',
    risksWhenNeglected: ['Decisões enviesadas', 'Concentração de poder', 'Pontos cegos estratégicos'],
    practicalRecommendations: ['Criar conselho consultivo', 'Estabelecer comitês temáticos', 'Incentivar o debate construtivo']
  },
  {
    id: 'gov_3',
    name: 'Accountability',
    description: 'Prestar contas das ações e resultados.',
    axis: 'Governança',
    reference: 'Romanos 14:12',
    businessApplication: 'Prestação de contas estruturada e clara.',
    risksWhenNeglected: ['Falta de responsabilização', 'Ineficiência', 'Ocultação de resultados negativos'],
    practicalRecommendations: ['Reuniões regulares de prestação de contas', 'Dashboard de KPIs visível', 'Avaliação de desempenho periódica']
  },
  {
    id: 'gov_4',
    name: 'Justiça',
    description: 'Praticar a equidade e o que é reto.',
    axis: 'Governança',
    reference: 'Miquéias 6:8',
    businessApplication: 'Equidade em processos e distribuição de valor.',
    risksWhenNeglected: ['Desmotivação', 'Ações trabalhistas', 'Clima organizacional tóxico'],
    practicalRecommendations: ['Políticas de remuneração claras', 'Critérios objetivos para promoção', 'Avaliação justa de fornecedores']
  },
  {
    id: 'gov_5',
    name: 'Sabedoria',
    description: 'Tomar decisões fundamentadas e discernimento.',
    axis: 'Governança',
    reference: 'Tiago 1:5',
    businessApplication: 'Decisão com dados e discernimento.',
    risksWhenNeglected: ['Decisões impulsivas', 'Falta de visão de longo prazo', 'Desperdício de recursos'],
    practicalRecommendations: ['Análise de dados para decisões estratégicas', 'Consultar especialistas', 'Avaliar cenários e riscos']
  },
  {
    id: 'gov_6',
    name: 'Ordem',
    description: 'Fazer tudo com decência e ordem.',
    axis: 'Governança',
    reference: '1 Coríntios 14:40',
    businessApplication: 'Processos claros e governança documentada.',
    risksWhenNeglected: ['Caos operacional', 'Ineficiência', 'Perda de conhecimento com turnover'],
    practicalRecommendations: ['Mapeamento e otimização de processos', 'Criação de manuais e POPs', 'Estruturação hierárquica clara']
  },

  // Eixo: Cultura
  {
    id: 'cult_1',
    name: 'Honra',
    description: 'Reconhecer e valorizar as pessoas.',
    axis: 'Cultura',
    reference: 'Romanos 12:10',
    businessApplication: 'Reconhecimento e valorização de pessoas.',
    risksWhenNeglected: ['Baixo engajamento', 'Turnover elevado', 'Clima de desrespeito'],
    practicalRecommendations: ['Programas de reconhecimento', 'Feedback positivo', 'Celebração de conquistas']
  },
  {
    id: 'cult_2',
    name: 'Unidade',
    description: 'Trabalhar em harmonia e colaboração.',
    axis: 'Cultura',
    reference: 'Salmos 133:1',
    businessApplication: 'Coesão de equipe e ausência de silos.',
    risksWhenNeglected: ['Conflitos internos', 'Falta de sinergia', 'Desalinhamento estratégico'],
    practicalRecommendations: ['Atividades de team building', 'Metas compartilhadas', 'Comunicação interdepartamental']
  },
  {
    id: 'cult_3',
    name: 'Serviço',
    description: 'Liderar servindo aos outros.',
    axis: 'Cultura',
    reference: 'Marcos 10:43-45',
    businessApplication: 'Liderança servidora.',
    risksWhenNeglected: ['Liderança autoritária', 'Falta de empatia', 'Desconexão entre líderes e liderados'],
    practicalRecommendations: ['Desenvolvimento de liderança servidora', 'Mentoria', 'Ouvir ativamente as equipes']
  },
  {
    id: 'cult_4',
    name: 'Verdade',
    description: 'Falar a verdade e ser autêntico.',
    axis: 'Cultura',
    reference: 'João 8:32',
    businessApplication: 'Comunicação transparente e feedback real.',
    risksWhenNeglected: ['Fofocas', 'Desconfiança', 'Ambiente político e dissimulado'],
    practicalRecommendations: ['Cultura de feedback honesto', 'Transparência na comunicação interna', 'Incentivo à franqueza']
  },
  {
    id: 'cult_5',
    name: 'Cuidado',
    description: 'Atentar para o bem-estar do próximo.',
    axis: 'Cultura',
    reference: 'Filipenses 2:4',
    businessApplication: 'Atenção genuína ao desenvolvimento humano.',
    risksWhenNeglected: ['Burnout', 'Falta de desenvolvimento profissional', 'Baixa retenção de talentos'],
    practicalRecommendations: ['Programas de bem-estar', 'Plano de desenvolvimento individual (PDI)', 'Equilíbrio vida pessoal/profissional']
  },

  // Eixo: Inovação
  {
    id: 'inov_1',
    name: 'Criatividade',
    description: 'Refletir a natureza criadora.',
    axis: 'Inovação',
    reference: 'Gênesis 1:1',
    businessApplication: 'Deus criador como modelo de inovação.',
    risksWhenNeglected: ['Estagnação', 'Perda de competitividade', 'Obsolescência de produtos/serviços'],
    practicalRecommendations: ['Incentivar brainstorming', 'Criar espaço para experimentação', 'Investir em P&D']
  },
  {
    id: 'inov_2',
    name: 'Prudência na Inovação',
    description: 'Avaliar os custos antes de iniciar um projeto.',
    axis: 'Inovação',
    reference: 'Lucas 14:28',
    businessApplication: 'Análise de viabilidade antes de construir.',
    risksWhenNeglected: ['Projetos fracassados', 'Desperdício de recursos', 'Falta de foco estratégico'],
    practicalRecommendations: ['Prototipagem rápida', 'Estudos de viabilidade', 'Testes A/B']
  },
  {
    id: 'inov_3',
    name: 'Semear e Colher',
    description: 'O resultado vem após o investimento e esforço.',
    axis: 'Inovação',
    reference: 'Gálatas 6:7',
    businessApplication: 'Investimento consistente produz fruto.',
    risksWhenNeglected: ['Inovação pontual', 'Expectativas irrealistas de curto prazo', 'Falta de persistência'],
    practicalRecommendations: ['Orçamento dedicado à inovação', 'Métricas de inovação de longo prazo', 'Tolerância ao erro (aprendizado)']
  },
  {
    id: 'inov_4',
    name: 'Ousadia',
    description: 'Ter coragem para enfrentar novos desafios.',
    axis: 'Inovação',
    reference: 'Josué 1:9',
    businessApplication: 'Coragem para inovar com fé.',
    risksWhenNeglected: ['Aversão ao risco', 'Ficar para trás no mercado', 'Medo de errar'],
    practicalRecommendations: ['Celebrar tentativas (mesmo as que falham)', 'Incentivar projetos ambiciosos (moonshots)', 'Ambiente seguro para arriscar']
  },

  // Eixo: Marketing
  {
    id: 'mkt_1',
    name: 'Testemunho',
    description: 'Que as boas obras sejam vistas.',
    axis: 'Marketing',
    reference: 'Mateus 5:16',
    businessApplication: 'Reputação que reflete valores internos.',
    risksWhenNeglected: ['Incoerência entre discurso e prática', 'Danos à marca', 'Crise de imagem'],
    practicalRecommendations: ['Marketing autêntico', 'Destacar casos de sucesso reais', 'Alinhamento entre marketing e cultura']
  },
  {
    id: 'mkt_2',
    name: 'Excelência',
    description: 'Fazer com dedicação e máxima qualidade.',
    axis: 'Marketing',
    reference: 'Colossenses 3:23',
    businessApplication: 'Fazer tudo como para o Senhor na comunicação e design.',
    risksWhenNeglected: ['Comunicação amadora', 'Perda de valor percebido', 'Mensagens ineficazes'],
    practicalRecommendations: ['Padrão de qualidade visual', 'Revisão cuidadosa de materiais', 'Investimento em branding profissional']
  },
  {
    id: 'mkt_3',
    name: 'Verdade no Comunicar',
    description: 'Falar a verdade uns aos outros.',
    axis: 'Marketing',
    reference: 'Efésios 4:15',
    businessApplication: 'Marketing ético, sem engano.',
    risksWhenNeglected: ['Propaganda enganosa', 'Perda de credibilidade', 'Insatisfação de clientes'],
    practicalRecommendations: ['Transparência em ofertas', 'Evitar promessas irrealistas', 'Clareza nas condições de serviço']
  },
  {
    id: 'mkt_4',
    name: 'Influência Positiva',
    description: 'Ser sal e luz no mercado.',
    axis: 'Marketing',
    reference: 'Mateus 5:13',
    businessApplication: 'Ser uma influência positiva e transformadora.',
    risksWhenNeglected: ['Falta de impacto social', 'Comunicação vazia de propósito', 'Irrelevância'],
    practicalRecommendations: ['Marketing de causa', 'Conteúdo educativo e inspirador', 'Posicionamento claro sobre valores']
  },

  // Eixo: Comercial
  {
    id: 'com_1',
    name: 'Fidelidade',
    description: 'Ser fiel nas pequenas e grandes coisas.',
    axis: 'Comercial',
    reference: 'Lucas 16:10',
    businessApplication: 'Fiel no pouco, fiel no muito no relacionamento com clientes.',
    risksWhenNeglected: ['Perda de clientes', 'Falta de recompra', 'Foco apenas no fechamento, não na entrega'],
    practicalRecommendations: ['Cumprir o que foi prometido', 'Atenção aos detalhes no pós-venda', 'Consistência na qualidade do atendimento']
  },
  {
    id: 'com_2',
    name: 'Abundância',
    description: 'Trazer vida em abundância.',
    axis: 'Comercial',
    reference: 'João 10:10',
    businessApplication: 'Prosperidade sustentável com propósito.',
    risksWhenNeglected: ['Foco excessivo no lucro de curto prazo', 'Exploração de clientes', 'Relações ganha-perde'],
    practicalRecommendations: ['Focar em gerar valor real para o cliente', 'Modelos de negócios ganha-ganha', 'Visão de longo prazo nas parcerias']
  },
  {
    id: 'com_3',
    name: 'Justiça no Preço',
    description: 'Usar balanças e pesos justos.',
    axis: 'Comercial',
    reference: 'Levítico 19:35-36',
    businessApplication: 'Precificação ética, sem exploração.',
    risksWhenNeglected: ['Precificação abusiva', 'Perda de confiança', 'Guerra de preços'],
    practicalRecommendations: ['Transparência na precificação', 'Valor entregue compatível com o preço', 'Evitar taxas ocultas']
  },
  {
    id: 'com_4',
    name: 'Relacionamento',
    description: 'O ferro afia o ferro.',
    axis: 'Comercial',
    reference: 'Provérbios 27:17',
    businessApplication: 'CRM como cuidado real com clientes.',
    risksWhenNeglected: ['Relações transacionais', 'Desconhecimento das necessidades do cliente', 'Atendimento impessoal'],
    practicalRecommendations: ['Conhecer a fundo o negócio do cliente', 'Atendimento consultivo', 'Construção de parcerias de longo prazo']
  },

  // Eixo: Operacional
  {
    id: 'op_1',
    name: 'Diligência',
    description: 'A alma do diligente prospera.',
    axis: 'Operacional',
    reference: 'Provérbios 13:4',
    businessApplication: 'Eficiência e comprometimento na execução.',
    risksWhenNeglected: ['Atrasos', 'Baixa produtividade', 'Desperdício de tempo'],
    practicalRecommendations: ['Metas operacionais claras', 'Acompanhamento de produtividade', 'Cultura de execução']
  },
  {
    id: 'op_2',
    name: 'Ordem Operacional',
    description: 'Que tudo seja feito com decência e ordem.',
    axis: 'Operacional',
    reference: '1 Coríntios 14:40',
    businessApplication: 'Processos padronizados e organizados.',
    risksWhenNeglected: ['Retrabalho', 'Erros operacionais', 'Falta de escalabilidade'],
    practicalRecommendations: ['Implementação de sistemas de gestão (ERP)', 'Organização física (5S)', 'Padronização de tarefas rotineiras']
  },
  {
    id: 'op_3',
    name: 'Mordomia dos Recursos',
    description: 'Ser achado fiel na administração do que lhe foi confiado.',
    axis: 'Operacional',
    reference: '1 Coríntios 4:2',
    businessApplication: 'Gestão fiel dos recursos e ativos produtivos.',
    risksWhenNeglected: ['Desperdício de matéria-prima', 'Má conservação de equipamentos', 'Custos operacionais elevados'],
    practicalRecommendations: ['Manutenção preventiva', 'Controle rigoroso de estoque', 'Otimização do uso de recursos']
  },
  {
    id: 'op_4',
    name: 'Sustentabilidade',
    description: 'Guardar e cultivar.',
    axis: 'Operacional',
    reference: 'Gênesis 2:15',
    businessApplication: 'Operação ecologicamente e socialmente responsável.',
    risksWhenNeglected: ['Impacto ambiental negativo', 'Problemas com comunidade local', 'Insustentabilidade a longo prazo'],
    practicalRecommendations: ['Práticas ESG', 'Redução de resíduos', 'Eficiência energética']
  },
  {
    id: 'op_5',
    name: 'Qualidade',
    description: 'Fazer com toda a força.',
    axis: 'Operacional',
    reference: 'Eclesiastes 9:10',
    businessApplication: 'Excelência na entrega do produto ou serviço.',
    risksWhenNeglected: ['Produtos defeituosos', 'Insatisfação do cliente', 'Aumento de devoluções/reclamações'],
    practicalRecommendations: ['Controle de qualidade', 'Melhoria contínua', 'Capacitação técnica das equipes']
  },

  // Eixo: Gestão (Gestão Financeira)
  {
    id: 'fin_1',
    name: 'Mordomia Financeira',
    description: 'Ser fiel nas riquezas injustas.',
    axis: 'Gestão',
    reference: 'Lucas 16:11',
    businessApplication: 'Gestão fiel de recursos financeiros e caixa.',
    risksWhenNeglected: ['Descontrole financeiro', 'Mistura de contas PJ e PF', 'Falta de liquidez'],
    practicalRecommendations: ['Conciliação bancária rigorosa', 'Separação de contas', 'Planejamento de fluxo de caixa']
  },
  {
    id: 'fin_2',
    name: 'Prudência Financeira',
    description: 'Ter tesouro e azeite (reservas).',
    axis: 'Gestão',
    reference: 'Provérbios 21:20',
    businessApplication: 'Reservas e planejamento financeiro para imprevistos.',
    risksWhenNeglected: ['Vulnerabilidade a crises', 'Falta de capital de giro', 'Dependência de crédito caro'],
    practicalRecommendations: ['Constituir reserva de emergência', 'Planejamento financeiro de longo prazo', 'Gestão de riscos']
  },
  {
    id: 'fin_3',
    name: 'Sustentabilidade Financeira',
    description: 'Acumular com o próprio trabalho (gradativamente).',
    axis: 'Gestão',
    reference: 'Provérbios 13:11',
    businessApplication: 'Riqueza acumulada com sabedoria, sem atalhos.',
    risksWhenNeglected: ['Crescimento insustentável', 'Alavancagem excessiva para crescimento rápido', 'Problemas de fluxo de caixa por crescimento desordenado'],
    practicalRecommendations: ['Crescimento orgânico e sustentável', 'Reinvestimento de lucros', 'Evitar esquemas de enriquecimento rápido']
  },
  {
    id: 'fin_4',
    name: 'Dívida Consciente',
    description: 'A ninguém dever nada, senão o amor.',
    axis: 'Gestão',
    reference: 'Romanos 13:8',
    businessApplication: 'Endividamento responsável e evitação de juros abusivos.',
    risksWhenNeglected: ['Endividamento insustentável', 'Pagamento elevado de juros', 'Risco de falência'],
    practicalRecommendations: ['Usar crédito apenas para investimentos com ROI claro', 'Renegociação de dívidas caras', 'Evitar alavancagem para cobrir despesas operacionais']
  },
  {
    id: 'fin_5',
    name: 'Dízimo e Retorno',
    description: 'Trazer os dízimos e primícias.',
    axis: 'Gestão',
    reference: 'Malaquias 3:10',
    businessApplication: 'Dar do primeiro fruto e generosidade corporativa.',
    risksWhenNeglected: ['Falta de responsabilidade social', 'Mentalidade de escassez', 'Apego excessivo ao dinheiro'],
    practicalRecommendations: ['Doações corporativas', 'Apoio a projetos sociais', 'Cultura de generosidade']
  },
  {
    id: 'fin_6',
    name: 'Frutificação',
    description: 'Multiplicar os talentos recebidos.',
    axis: 'Gestão',
    reference: 'Mateus 25:14-30',
    businessApplication: 'Talentos investidos com multiplicação e retorno.',
    risksWhenNeglected: ['Capital ocioso', 'Falta de investimento em inovação', 'Estagnação do patrimônio'],
    practicalRecommendations: ['Investimento dos lucros retidos', 'Busca por ROI em projetos', 'Otimização da alocação de capital']
  },
  {
    id: 'fin_7',
    name: 'Transparência Financeira',
    description: 'Procurar o que é honesto perante os homens.',
    axis: 'Gestão',
    reference: '2 Coríntios 8:21',
    businessApplication: 'Contabilidade honesta e relatórios financeiros transparentes.',
    risksWhenNeglected: ['Fraudes', 'Maquiagem contábil', 'Sonegação fiscal'],
    practicalRecommendations: ['Auditoria independente', 'Relatórios financeiros claros para sócios/investidores', 'Compliance fiscal rigoroso']
  },
  {
    id: 'fin_8',
    name: 'Justiça Distributiva',
    description: 'Aquele que distribui mais se lhe acrescenta.',
    axis: 'Gestão',
    reference: 'Provérbios 11:24',
    businessApplication: 'Distribuição justa dos resultados (PLR, dividendos).',
    risksWhenNeglected: ['Concentração de riqueza apenas no topo', 'Desmotivação da equipe', 'Sentimento de injustiça'],
    practicalRecommendations: ['Programa de Participação nos Lucros e Resultados (PLR)', 'Remuneração variável atrelada a resultados', 'Distribuição equilibrada de dividendos']
  }
];

export interface SacerdotalRule {
  id: string;
  condition: (data: any) => boolean;
  principleId: string;
  misalignment: string;
  impact: string;
  recommendation: string;
  orientation: string;
}

// Engine de regras para avaliar indicadores financeiros
export const SACERDOTAL_FINANCIAL_RULES: SacerdotalRule[] = [
  {
    id: 'rule_fin_liquidez',
    condition: (metrics: any) => (metrics.liquidezCorrente && metrics.liquidezCorrente < 1.0),
    principleId: 'fin_2', // Prudência Financeira
    misalignment: 'Liquidez crítica indica ausência de reservas estratégicas e planejamento para imprevistos.',
    impact: 'Vulnerabilidade operacional e alta dependência de crédito emergencial (caro).',
    recommendation: 'Constituir reserva mínima de caixa para cobrir despesas de curto prazo.',
    orientation: 'Nível Básico → Intermediário'
  },
  {
    id: 'rule_fin_endividamento',
    condition: (metrics: any) => (metrics.alavancagem && metrics.alavancagem > 3.0),
    principleId: 'fin_4', // Dívida Consciente
    misalignment: 'Nível de endividamento (Alavancagem Dívida/EBITDA) acima de limites saudáveis.',
    impact: 'Comprometimento excessivo do fluxo de caixa com serviço da dívida, limitando crescimento sustentável.',
    recommendation: 'Reestruturar dívidas, alongar prazos ou reduzir alavancagem com geração de caixa.',
    orientation: 'Atenção Crítica → Estabilização'
  },
  {
    id: 'rule_fin_margem_ebitda',
    condition: (metrics: any) => (metrics.ebitdaMargin && metrics.ebitdaMargin < 5.0),
    principleId: 'op_1', // Diligência (pode ser visto como operacional/eficiência)
    misalignment: 'Baixa geração de caixa operacional indica ineficiência na gestão de custos ou precificação.',
    impact: 'Incapacidade de sustentar a operação e gerar valor a longo prazo.',
    recommendation: 'Revisar estrutura de custos e política de precificação para garantir margens saudáveis.',
    orientation: 'Sobrevivência → Sustentabilidade'
  }
];

export const SACERDOTAL_AXIS_RULES: SacerdotalRule[] = [
  ...SACERDOTAL_FINANCIAL_RULES,
  // Regras de Cultura
  {
    id: 'rule_cult_turnover',
    condition: (metrics: any) => (metrics['Turnover'] !== undefined && metrics['Turnover'] > 5.0),
    principleId: 'cult_1', // Honra
    misalignment: 'Turnover elevado sugere falha na valorização e retenção de talentos.',
    impact: 'Perda de conhecimento organizacional e alto custo de reposição.',
    recommendation: 'Revisar políticas de reconhecimento e clima organizacional.',
    orientation: 'Atenção'
  },
  {
    id: 'rule_cult_enps',
    condition: (metrics: any) => (metrics['eNPS (Clima)'] !== undefined && metrics['eNPS (Clima)'] < 50),
    principleId: 'cult_5', // Cuidado
    misalignment: 'Baixo eNPS aponta para insatisfação e falta de cuidado com as equipes.',
    impact: 'Desengajamento e potencial risco trabalhista.',
    recommendation: 'Implementar ações de bem-estar e escuta ativa (pesquisas de pulso).',
    orientation: 'Alerta Crítico'
  },
  // Regras de Marketing
  {
    id: 'rule_mkt_cpl',
    condition: (metrics: any) => (metrics['Custo por Lead (CPL)'] !== undefined && metrics['Custo por Lead (CPL)'] > 100),
    principleId: 'mkt_2', // Excelência
    misalignment: 'Custo de aquisição alto pode refletir comunicação ineficiente ou falta de foco.',
    impact: 'Desperdício de orçamento de marketing.',
    recommendation: 'Otimizar canais de mídia e melhorar o direcionamento de anúncios.',
    orientation: 'Atenção'
  },
  // Regras de Comercial
  {
    id: 'rule_com_conversao',
    condition: (metrics: any) => (metrics['Taxa de Conversão'] !== undefined && metrics['Taxa de Conversão'] < 10),
    principleId: 'com_4', // Relacionamento
    misalignment: 'Baixa conversão aponta para falta de conexão real com as dores do cliente.',
    impact: 'Funil de vendas ineficiente e desperdício de leads.',
    recommendation: 'Treinar equipe para vendas consultivas e focar no relacionamento.',
    orientation: 'Alerta'
  },
  // Regras de Operacional
  {
    id: 'rule_op_oee',
    condition: (metrics: any) => (metrics['OEE (Eficiência)'] !== undefined && metrics['OEE (Eficiência)'] < 75),
    principleId: 'op_1', // Diligência
    misalignment: 'Baixa eficiência operacional reflete gargalos e falta de diligência na produção.',
    impact: 'Capacidade ociosa e atrasos na entrega.',
    recommendation: 'Mapear fluxo de valor e eliminar desperdícios na linha de produção.',
    orientation: 'Melhoria Contínua'
  },
  // Regras de Governança
  {
    id: 'rule_gov_maturidade',
    condition: (metrics: any) => (metrics['Índice de Maturidade'] !== undefined && metrics['Índice de Maturidade'] < 60),
    principleId: 'gov_6', // Ordem
    misalignment: 'Baixa maturidade corporativa indica ausência de processos estruturados.',
    impact: 'Riscos de compliance e ineficiência de gestão.',
    recommendation: 'Documentar processos chave e instituir governança básica.',
    orientation: 'Atenção'
  }
];

export function getPrincipleById(id: string): SacerdotalPrinciple | undefined {
  return SACERDOTAL_PRINCIPLES.find(p => p.id === id);
}

export function evaluateFinancialRules(metrics: any): (SacerdotalRule & { principle: SacerdotalPrinciple })[] {
  const triggeredRules = SACERDOTAL_FINANCIAL_RULES.filter(rule => {
    try {
      return rule.condition(metrics);
    } catch (e) {
      return false;
    }
  });

  return triggeredRules.map(rule => ({
    ...rule,
    principle: getPrincipleById(rule.principleId)!
  })).filter(r => r.principle !== undefined);
}

export function evaluateAxisRules(metrics: any, axis: string): (SacerdotalRule & { principle: SacerdotalPrinciple })[] {
  const axisRules = SACERDOTAL_AXIS_RULES.filter(r => {
    const p = getPrincipleById(r.principleId);
    return p && p.axis === axis;
  });

  const triggeredRules = axisRules.filter(rule => {
    try {
      return rule.condition(metrics);
    } catch (e) {
      return false;
    }
  });

  return triggeredRules.map(rule => ({
    ...rule,
    principle: getPrincipleById(rule.principleId)!
  }));
}

// Cálculo do Score de Alinhamento (simplificado para demonstração)
export function calculateSacerdotalAlignmentScore(data: any): number {
  // Lógica fictícia baseada em alguns inputs genéricos
  // Na prática, isso seria alimentado por um questionário ou avaliação de maturidade
  let score = 50; // Começa com 50
  
  if (data.hasMVV) score += 10;
  if (data.hasCompliance) score += 10;
  if (data.liquidezCorrente > 1.2) score += 10;
  if (data.turnoverBaixo) score += 10;
  if (data.ebitdaMargin > 15) score += 10;

  return Math.min(100, score);
}
