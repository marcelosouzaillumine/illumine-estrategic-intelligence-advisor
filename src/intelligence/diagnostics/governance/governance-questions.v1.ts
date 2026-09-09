import { DiagnosticQuestion } from '../core/diagnostic-contracts';

export const GOVERNANCE_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'gov-q1',
    dimensionId: 'strategic-intelligence',
    text: 'Como decisões estratégicas relevantes são tomadas atualmente na organização?',
    type: 'single_choice',
    options: [
      { id: 'opt1', text: 'As decisões dependem principalmente da experiência individual dos líderes, de forma centralizada.', weight: 1 },
      { id: 'opt2', text: 'Existem reuniões e discussões, mas sem processo consistente ou periodicidade definida.', weight: 2 },
      { id: 'opt3', text: 'Há fóruns definidos e critérios conhecidos para deliberações sobre o negócio.', weight: 3 },
      { id: 'opt4', text: 'Decisões utilizam dados, indicadores de performance e análises estruturadas como base padrão.', weight: 4 },
      { id: 'opt5', text: 'Existe um sistema institucional de inteligência decisória, conectando estratégia e risco ativamente.', weight: 5 }
    ]
  },
  {
    id: 'gov-q2',
    dimensionId: 'leadership-accountability',
    text: 'Como as responsabilidades críticas e a prestação de contas (accountability) estão distribuídas?',
    type: 'single_choice',
    options: [
      { id: 'opt1', text: 'Existe sombreamento e conflito de responsabilidades; as pessoas aguardam o direcionamento dos fundadores/CEOs.', weight: 1 },
      { id: 'opt2', text: 'Papéis são conhecidos informalmente, mas a cobrança e a autonomia não são sistematizadas.', weight: 2 },
      { id: 'opt3', text: 'Há descrições de cargo e papéis estruturados, com responsabilidades claras para a maior parte da liderança.', weight: 3 },
      { id: 'opt4', text: 'Autonomia é delegada com base em metas e métricas claras (OKRs/KPIs), com prestação de contas frequente.', weight: 4 },
      { id: 'opt5', text: 'Cultura profunda de accountability, onde a liderança age como dona do negócio (ownership) com total alinhamento.', weight: 5 }
    ]
  },
  {
    id: 'gov-q3',
    dimensionId: 'board-executive',
    text: 'Como a liderança superior (Sócios/Conselho) acompanha a execução e as decisões do corpo executivo?',
    type: 'single_choice',
    options: [
      { id: 'opt1', text: 'Os sócios operam a empresa no dia a dia, sem distinção clara entre papel executivo e papel societário.', weight: 1 },
      { id: 'opt2', text: 'Iniciamos a separação de papéis, realizando algumas reuniões esporádicas de acompanhamento gerencial.', weight: 2 },
      { id: 'opt3', text: 'Temos um Conselho Consultivo/Administrativo ou um fórum formal de sócios com reuniões regulares.', weight: 3 },
      { id: 'opt4', text: 'O Conselho é estruturado, atua estrategicamente e avalia o desempenho do corpo executivo com base em relatórios consistentes.', weight: 4 },
      { id: 'opt5', text: 'Conselho de alto desempenho apoiado por comitês especializados (Auditoria, Pessoas, etc), guiando a visão de longo prazo.', weight: 5 }
    ]
  },
  {
    id: 'gov-q4',
    dimensionId: 'risk-compliance',
    text: 'Como os riscos relevantes para a organização são identificados e gerenciados?',
    type: 'single_choice',
    options: [
      { id: 'opt1', text: 'Tratamos problemas e riscos à medida que eles acontecem (reativo).', weight: 1 },
      { id: 'opt2', text: 'Alguns controles existem em áreas críticas (como financeiro e jurídico), mas sem uma visão unificada.', weight: 2 },
      { id: 'opt3', text: 'Possuímos processos formais de gestão de risco e regras de compliance estabelecidas.', weight: 3 },
      { id: 'opt4', text: 'Matriz de riscos atualizada, auditorias internas/externas regulares e acompanhamento ativo pela liderança.', weight: 4 },
      { id: 'opt5', text: 'Gestão de riscos integrada à tomada de decisão estratégica e ao planejamento de cenários.', weight: 5 }
    ]
  },
  {
    id: 'gov-q5',
    dimensionId: 'institutional-culture',
    text: 'Como a organização transforma valores em práticas concretas de gestão e transparência?',
    type: 'single_choice',
    options: [
      { id: 'opt1', text: 'A cultura reflete apenas o estilo e as reações dos líderes atuais, sem transparência para a equipe.', weight: 1 },
      { id: 'opt2', text: 'Valores estão escritos, mas o grau de transparência sobre os rumos do negócio ainda é muito restrito.', weight: 2 },
      { id: 'opt3', text: 'Práticas de comunicação interna e rituais de cultura garantem alinhamento e clareza sobre decisões e expectativas.', weight: 3 },
      { id: 'opt4', text: 'Transparência ativa sobre resultados e desafios é parte do sistema de gestão e engaja a equipe.', weight: 4 },
      { id: 'opt5', text: 'A cultura institucional atua de forma autônoma aos fundadores, sendo o principal ativo de retenção e governança.', weight: 5 }
    ]
  }
];
