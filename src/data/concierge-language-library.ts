export type MessageCategory = 'recognition' | 'context' | 'insight' | 'synthesis' | 'recommendation' | 'advisor' | 'client' | 'value';

export interface ConciergeMessageTemplate {
  category: MessageCategory;
  intentKey: string; 
  messages: string[];
}

export const CONCIERGE_LANGUAGE_LIBRARY: Record<string, ConciergeMessageTemplate> = {
  // --- RECOGNITION ---
  'rec-executive': {
    category: 'recognition',
    intentKey: 'executive',
    messages: [
      'Agradeço por compartilhar essa perspectiva.',
      'Compreendido.',
      'Perfeitamente alinhado.',
    ]
  },
  'rec-advisor': {
    category: 'recognition',
    intentKey: 'advisor',
    messages: [
      'Excelente. Valorizamos imensamente nossos parceiros estratégicos.',
      'A Illumine Network é desenhada exatamente para potencializar seu trabalho.',
    ]
  },
  'rec-client': {
    category: 'recognition',
    intentKey: 'client',
    messages: [
      'Bem-vindo de volta ao ecossistema Illumine.',
      'É excelente recebê-lo novamente.',
    ]
  },

  // --- CONTEXT ---
  'ctx-executive': {
    category: 'context',
    intentKey: 'executive',
    messages: [
      'Essa perspectiva nos ajuda a compreender melhor o contexto executivo em que você atua.',
      'Líderes executivos frequentemente procuram a Illumine quando precisam ampliar a clareza sobre cenários complexos e decisões estratégicas.',
    ]
  },
  
  // --- INSIGHT ---
  'ins-growth': {
    category: 'insight',
    intentKey: 'growth',
    messages: [
      'Organizações em crescimento estruturado exigem visibilidade completa de riscos e oportunidades antes de cada salto operacional.',
    ]
  },
  'ins-financial_predictability': {
    category: 'insight',
    intentKey: 'financial_predictability',
    messages: [
      'A previsibilidade financeira é o alicerce silencioso das decisões executivas mais seguras e consistentes.',
    ]
  },
  'ins-operational_challenges': {
    category: 'insight',
    intentKey: 'operational_challenges',
    messages: [
      'Desafios operacionais crônicos frequentemente ocultam gargalos mais profundos de governança e de fluxo de informação.',
    ]
  },
  'ins-governance': {
    category: 'insight',
    intentKey: 'governance',
    messages: [
      'Fortalecer a governança corporativa é sempre o primeiro passo em direção à perpetuidade da organização.',
    ]
  },
  'ins-strategic_transformation': {
    category: 'insight',
    intentKey: 'strategic_transformation',
    messages: [
      'Transformações estratégicas exigem alinhamento profundo e uma memória institucional resiliente.',
    ]
  },

  // --- SYNTHESIS ---
  'syn-financial': {
    category: 'synthesis',
    intentKey: 'financial',
    messages: [
      'Pelas informações apresentadas, sua organização demonstra um cenário em que ampliar a previsibilidade para decisões executivas tende a ser a prioridade neste momento.',
    ]
  },
  'syn-governance': {
    category: 'synthesis',
    intentKey: 'governance',
    messages: [
      'Considerando este contexto, o fortalecimento da governança estratégica surge como o caminho natural para sustentar seus próximos movimentos.',
    ]
  },
  'syn-operational': {
    category: 'synthesis',
    intentKey: 'operational',
    messages: [
      'Sua realidade indica a necessidade de destravar a fluidez operacional, trazendo maior visibilidade para os líderes de execução.',
    ]
  },
  'syn-commercial': {
    category: 'synthesis',
    intentKey: 'commercial',
    messages: [
      'O momento atual aponta para a importância de alinhar sua estrutura comercial e maximizar a eficiência na originação de valor.',
    ]
  },
  'syn-people': {
    category: 'synthesis',
    intentKey: 'people',
    messages: [
      'Identificamos que o alinhamento e a retenção de capital humano estratégico são os fatores mais críticos da sua organização no momento.',
    ]
  },
  'syn-risk': {
    category: 'synthesis',
    intentKey: 'risk',
    messages: [
      'Fica claro que a mitigação ativa de vulnerabilidades institucionais deve assumir a centralidade das suas operações hoje.',
    ]
  },
  'syn-innovation': {
    category: 'synthesis',
    intentKey: 'innovation',
    messages: [
      'Notamos uma propensão significativa para renovação de modelos de negócio, o que requer arquitetura voltada para inovação.',
    ]
  },
  'syn-institutional': {
    category: 'synthesis',
    intentKey: 'institutional',
    messages: [
      'Seu cenário aponta para um salto de maturidade transversal que engloba toda a arquitetura corporativa.',
    ]
  },

  // --- RECOMMENDATION ---
  'rec-financial': {
    category: 'recommendation',
    intentKey: 'financial',
    messages: [
      'Recomendamos iniciar pela Financial Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-governance': {
    category: 'recommendation',
    intentKey: 'governance',
    messages: [
      'Recomendamos iniciar pela Governance Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-operational': {
    category: 'recommendation',
    intentKey: 'operational',
    messages: [
      'Recomendamos iniciar pela Operational Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-commercial': {
    category: 'recommendation',
    intentKey: 'commercial',
    messages: [
      'Recomendamos iniciar pela Commercial Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-people': {
    category: 'recommendation',
    intentKey: 'people',
    messages: [
      'Recomendamos iniciar pela People Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-risk': {
    category: 'recommendation',
    intentKey: 'risk',
    messages: [
      'Recomendamos iniciar pela Risk Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-innovation': {
    category: 'recommendation',
    intentKey: 'innovation',
    messages: [
      'Recomendamos iniciar pela Innovation Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-institutional': {
    category: 'recommendation',
    intentKey: 'institutional',
    messages: [
      'Recomendamos iniciar pela Institutional Intelligence Diagnostic Journey™.',
    ]
  },
  'rec-360': {
    category: 'recommendation',
    intentKey: '360',
    messages: [
      'Recomendamos iniciar pela Executive 360° Diagnostic Journey™.',
    ]
  },
  'rec-advisor-network': {
    category: 'recommendation',
    intentKey: 'advisor_network',
    messages: [
      'Com base no seu perfil, a Executive Advisor Network™ é a jornada mais adequada para impulsionar seus resultados.',
    ]
  },
  'rec-client-access': {
    category: 'recommendation',
    intentKey: 'client_access',
    messages: [
      'Identificamos que você já faz parte do ecossistema Illumine.',
    ]
  },

  // --- VALUE ---
  'val-financial': {
    category: 'value',
    intentKey: 'financial',
    messages: [
      'Essa jornada ajuda organizações a transformar dados financeiros em inteligência de negócios para decisões mais consistentes.',
    ]
  },
  'val-governance': {
    category: 'value',
    intentKey: 'governance',
    messages: [
      'Essa jornada mapeia a robustez dos seus processos decisórios, assegurando agilidade sem perda de controle.',
    ]
  },
  'val-operational': {
    category: 'value',
    intentKey: 'operational',
    messages: [
      'Essa jornada é projetada para identificar fricções estruturais e otimizar a cadeia de valor ponta a ponta.',
    ]
  },
  'val-commercial': {
    category: 'value',
    intentKey: 'commercial',
    messages: [
      'Essa jornada avalia seu motor de crescimento, alinhando ofertas, canais e rentabilidade.',
    ]
  },
  'val-people': {
    category: 'value',
    intentKey: 'people',
    messages: [
      'Essa jornada calibra sua arquitetura de talentos para garantir suporte à estratégia global.',
    ]
  },
  'val-risk': {
    category: 'value',
    intentKey: 'risk',
    messages: [
      'Essa jornada traz à luz blind spots estratégicos que podem comprometer a estabilidade do negócio no médio prazo.',
    ]
  },
  'val-innovation': {
    category: 'value',
    intentKey: 'innovation',
    messages: [
      'Essa jornada estrutura o portfólio de renovação da companhia para garantir relevância no longo prazo.',
    ]
  },
  'val-institutional': {
    category: 'value',
    intentKey: 'institutional',
    messages: [
      'Essa jornada oferece uma visão integrada de alto nível, preparando a organização para o próximo ciclo de maturidade.',
    ]
  },
  'val-360': {
    category: 'value',
    intentKey: '360',
    messages: [
      'Essa jornada proporciona uma visão panorâmica da organização, identificando as áreas de maior fricção estratégica.',
    ]
  },
  'val-advisor-network': {
    category: 'value',
    intentKey: 'advisor_network',
    messages: [
      'A rede oferece suporte institucional, métodos de diagnóstico exclusivos e a infraestrutura tecnológica necessária para alavancar seu modelo de advisory.',
    ]
  },
  'val-client-access': {
    category: 'value',
    intentKey: 'client_access',
    messages: [
      'Prossiga de forma segura para acessar suas ferramentas de inteligência executiva.',
    ]
  }
};

export function getRandomMessage(key: string): string {
  const template = CONCIERGE_LANGUAGE_LIBRARY[key];
  if (!template || template.messages.length === 0) return '';
  const idx = Math.floor(Math.random() * template.messages.length);
  return template.messages[idx];
}
