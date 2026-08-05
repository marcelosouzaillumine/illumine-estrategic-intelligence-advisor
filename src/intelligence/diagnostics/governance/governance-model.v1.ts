import { DiagnosticDimension, DiagnosticMaturityMatrix } from '../core/diagnostic-contracts';

export const GOVERNANCE_DOMAIN = 'governance';

export const GOVERNANCE_DIMENSIONS: DiagnosticDimension[] = [
  {
    id: 'strategic-governance',
    name: 'Strategic Governance Intelligence™',
    description: 'Clareza estratégica, processo decisório e alinhamento.',
    weight: 20,
    indicators: []
  },
  {
    id: 'leadership-accountability',
    name: 'Leadership & Accountability Intelligence™',
    description: 'Papéis, responsabilidades e prestação de contas.',
    weight: 20,
    indicators: []
  },
  {
    id: 'board-executive',
    name: 'Board & Executive Governance Intelligence™',
    description: 'Conselho, comitês e relação Conselho x Executivo.',
    weight: 20,
    indicators: []
  },
  {
    id: 'risk-compliance',
    name: 'Risk & Compliance Intelligence™',
    description: 'Gestão de riscos, controles e compliance.',
    weight: 20,
    indicators: []
  },
  {
    id: 'institutional-culture',
    name: 'Institutional Culture Intelligence™',
    description: 'Cultura de responsabilidade, transparência e valores organizacionais.',
    weight: 20,
    indicators: []
  }
];

export const GOVERNANCE_MATURITY_MATRIX: DiagnosticMaturityMatrix = {
  initial: {
    level: 'Initial',
    threshold: 0,
    interpretation: 'A governança é incipiente, baseada em confiança pessoal e experiência individual dos sócios, sem processos formais estabelecidos.',
    implications: [
      'Alta dependência dos fundadores/sócios',
      'Falta de alinhamento estruturado'
    ]
  },
  developing: {
    level: 'Developing',
    threshold: 25,
    interpretation: 'Existem rituais iniciais e processos sendo formados, mas as decisões importantes e a prestação de contas ainda não são sistemáticas.',
    implications: [
      'Reuniões de acompanhamento existem, mas não seguem padrões',
      'Desafios de accountability na liderança intermediária'
    ]
  },
  structured: {
    level: 'Structured',
    threshold: 50,
    interpretation: 'A organização possui mecanismos formais de liderança e decisão, porém ainda existem oportunidades para ampliar integração entre estratégia, execução e responsabilidade.',
    implications: [
      'Fóruns decisórios bem estabelecidos',
      'Papéis e responsabilidades mais claros'
    ]
  },
  advanced: {
    level: 'Advanced',
    threshold: 75,
    interpretation: 'Sistema robusto com Conselho atuante, comitês e gestão de riscos em pleno funcionamento. A governança impulsiona a estratégia.',
    implications: [
      'Decisões baseadas em inteligência de dados',
      'Gestão ativa de riscos'
    ]
  },
  excellence: {
    level: 'Excellence',
    threshold: 90,
    interpretation: 'A governança atua como diferencial competitivo. O alinhamento institucional garante máxima performance com resiliência superior.',
    implications: [
      'Capacidade de antecipação e correção',
      'Cultura profunda de ownership corporativo'
    ]
  }
};
