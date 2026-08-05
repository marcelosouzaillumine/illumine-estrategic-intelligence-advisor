export type ConciergeAudience = 'executive' | 'advisor' | 'client' | 'unknown';

export type ConciergeStepType = "selection" | "transition" | "reflection" | "recommendation" | "action";

export interface ConciergeTransition {
  triggerOption: string;
  tone: "recognition" | "context" | "guidance";
  acknowledgement: string;
  contextMessage: string;
  nextAction?: string;
}

export interface ConciergeOption {
  id: string;
  label: string;
  intent: string;
  nextStep?: string;
  actionType?: 'navigate' | 'message' | 'transition';
  targetUrl?: string; // se navigate
}

export interface ConciergeStep {
  id: string;
  question: string;
  options: ConciergeOption[];
}

export interface ConciergeJourney {
  id: string;
  audience: ConciergeAudience;
  objective: string;
  steps: Record<string, ConciergeStep>;
  initialStepId: string;
}

export const INITIAL_GREETING = "Olá. Sou o Executive Concierge™ da Illumine. Vou ajudá-lo a encontrar a melhor jornada de inteligência executiva para sua realidade.";

export const CONCIERGE_TRANSITIONS: Record<string, ConciergeTransition> = {
  'profile-executive': {
    triggerOption: 'profile-executive',
    tone: 'context',
    acknowledgement: 'Essa perspectiva nos ajuda a compreender melhor o contexto executivo em que você atua.',
    contextMessage: 'Líderes executivos frequentemente procuram a Illumine quando precisam ampliar a clareza sobre cenários complexos e decisões estratégicas.',
  },
  'profile-advisor': {
    triggerOption: 'profile-advisor',
    tone: 'recognition',
    acknowledgement: 'Excelente. O ecossistema Illumine possui uma arquitetura desenhada especificamente para potencializar consultorias e advisors.',
    contextMessage: 'A Illumine conecta advisors a uma infraestrutura de inteligência executiva para apoiar decisões empresariais complexas.',
  },
  'ctx-finance': {
    triggerOption: 'ctx-finance',
    tone: 'context',
    acknowledgement: 'A previsibilidade é um dos elementos centrais para decisões executivas mais seguras.',
    contextMessage: 'Vamos identificar o contexto desse desafio para direcionar a melhor experiência da Illumine.',
  },
  'ctx-growth': {
    triggerOption: 'ctx-growth',
    tone: 'guidance',
    acknowledgement: 'Crescimento estruturado exige visibilidade completa de riscos e oportunidades.',
    contextMessage: 'Entender a maturidade desse desafio nos ajudará a personalizar a jornada a seguir.',
  },
  'ctx-ops': {
    triggerOption: 'ctx-ops',
    tone: 'context',
    acknowledgement: 'Desafios operacionais muitas vezes ocultam gargalos de governança profunda.',
    contextMessage: 'Para seguirmos, precisamos mapear a urgência da sua organização.',
  },
  'ctx-gov': {
    triggerOption: 'ctx-gov',
    tone: 'recognition',
    acknowledgement: 'Fortalecer a governança é o primeiro passo para perpetuidade corporativa.',
    contextMessage: 'Identificar seu momento de decisão garantirá que a plataforma agregue valor máximo.',
  },
  'ctx-transformation': {
    triggerOption: 'ctx-transformation',
    tone: 'context',
    acknowledgement: 'Transformações estratégicas requerem alinhamento e memória institucional.',
    contextMessage: 'Isso representa um marco decisivo. Vamos alinhar seu momento atual.',
  }
};

export const CONCIERGE_JOURNEYS: Record<string, ConciergeJourney> = {
  'journey-executive': {
    id: 'journey-executive',
    audience: 'executive',
    objective: 'qualification',
    initialStepId: 'step-context',
    steps: {
      'step-context': {
        id: 'step-context',
        question: "Para direcionarmos a melhor experiência, qual cenário representa melhor sua realidade atual?",
        options: [
          { id: 'ctx-growth', label: 'Crescimento e expansão', intent: 'growth', actionType: 'transition', nextStep: 'step-urgency' },
          { id: 'ctx-finance', label: 'Baixa previsibilidade financeira', intent: 'financial_predictability', actionType: 'transition', nextStep: 'step-urgency' },
          { id: 'ctx-ops', label: 'Desafios operacionais', intent: 'operational_challenges', actionType: 'transition', nextStep: 'step-urgency' },
          { id: 'ctx-gov', label: 'Fortalecimento da governança', intent: 'governance', actionType: 'transition', nextStep: 'step-urgency' },
          { id: 'ctx-transformation', label: 'Preparação para transformação estratégica', intent: 'strategic_transformation', actionType: 'transition', nextStep: 'step-urgency' },
        ]
      },
      'step-urgency': {
        id: 'step-urgency',
        question: "Em qual momento sua organização se encontra?",
        options: [
          { id: 'urg-explore', label: 'Explorando oportunidades', intent: 'exploring', actionType: 'navigate', targetUrl: '/diagnostico' },
          { id: 'urg-clarity', label: 'Buscando maior clareza estratégica', intent: 'clarity_needed', actionType: 'navigate', targetUrl: '/diagnostico' },
          { id: 'urg-resolve', label: 'Precisando resolver desafios específicos', intent: 'resolving_challenges', actionType: 'navigate', targetUrl: '/diagnostico' },
          { id: 'urg-decision', label: 'Preparando uma decisão importante', intent: 'strategic_decision', actionType: 'navigate', targetUrl: '/diagnostico' },
          { id: 'urg-transform', label: 'Avaliando uma transformação mais ampla', intent: 'broad_transformation', actionType: 'navigate', targetUrl: '/diagnostico' },
        ]
      }
    }
  },
  
  'journey-advisor': {
    id: 'journey-advisor',
    audience: 'advisor',
    objective: 'partnership',
    initialStepId: 'step-advisor-intent',
    steps: {
      'step-advisor-intent': {
        id: 'step-advisor-intent',
        question: "Como você deseja interagir com o ecossistema Illumine?",
        options: [
          { id: 'adv-model', label: 'Conhecer o modelo de parceria', intent: 'learn_partnership', actionType: 'navigate', targetUrl: '/advisor-network' },
          { id: 'adv-reqs', label: 'Entender requisitos', intent: 'requirements', actionType: 'navigate', targetUrl: '/advisor-network' },
          { id: 'adv-talk', label: 'Solicitar conversa estratégica', intent: 'strategic_conversation', actionType: 'navigate', targetUrl: '/advisor-network#contact' },
        ]
      }
    }
  },

  'journey-client': {
    id: 'journey-client',
    audience: 'client',
    objective: 'access',
    initialStepId: 'step-client-action',
    steps: {
      'step-client-action': {
        id: 'step-client-action',
        question: "Como podemos ajudá-lo hoje?",
        options: [
          { id: 'cli-login', label: 'Entrar na plataforma', intent: 'login', actionType: 'navigate', targetUrl: '/login' },
          { id: 'cli-recover', label: 'Recuperar acesso', intent: 'recover_access', actionType: 'navigate', targetUrl: '/login?action=recover' },
          { id: 'cli-support', label: 'Solicitar suporte', intent: 'support', actionType: 'navigate', targetUrl: '/support' },
        ]
      }
    }
  }
};

export const INITIAL_OPTIONS: ConciergeOption[] = [
  { id: 'profile-executive', label: 'Sou Líder Executivo', intent: 'executive', actionType: 'transition', nextStep: 'journey-executive' },
  { id: 'profile-advisor', label: 'Sou Advisor / Consultor', intent: 'advisor', actionType: 'transition', nextStep: 'journey-advisor' },
  { id: 'profile-client', label: 'Já sou Cliente', intent: 'client', nextStep: 'journey-client' }, // Cliente não precisa de transição complexa
];

export function getJourneyForProfile(profileId: string): ConciergeJourney | null {
  if (profileId === 'profile-executive') return CONCIERGE_JOURNEYS['journey-executive'];
  if (profileId === 'profile-advisor') return CONCIERGE_JOURNEYS['journey-advisor'];
  if (profileId === 'profile-client') return CONCIERGE_JOURNEYS['journey-client'];
  return null;
}

export function getMessageForJourney(audience: ConciergeAudience): string {
  switch (audience) {
    case 'executive':
      return "Vamos identificar quais desafios executivos representam melhor seu momento atual.";
    case 'advisor':
      return "A Illumine conecta advisors e consultorias a uma infraestrutura de inteligência executiva para apoiar decisões empresariais complexas.";
    case 'client':
      return "Bem-vindo de volta. Por favor, selecione como podemos direcioná-lo de forma segura.";
    default:
      return INITIAL_GREETING;
  }
}
