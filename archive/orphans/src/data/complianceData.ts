export interface ComplianceDimension {
  subject: string;
  A: number;
  fullMark: number;
  description: string;
}

export interface TechnicalRecommendation {
  id: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  title: string;
  description: string;
  action: string;
}

export interface AssessmentQuestion {
  id: string;
  dimension: string;
  question: string;
  weight: number;
}

export const complianceMaturityLevels = [
  { level: 'Reativo', range: [0, 20], description: 'Ações informais e sem documentação. O Compliance só é lembrado em crises.' },
  { level: 'Básico', range: [21, 40], description: 'Políticas mínimas existem, mas não há monitoramento ou cultura disseminada.' },
  { level: 'Definido', range: [41, 60], description: 'Processos mapeados e políticas formais. Treinamentos ocorrem periodicamente.' },
  { level: 'Gerenciado', range: [61, 80], description: 'Indicadores monitorados e controles estruturados. O Compliance é parte do dia a dia.' },
  { level: 'Otimizado', range: [81, 100], description: 'Cultura de excelência. Melhoria contínua e foco preditivo em riscos.' },
];

export const complianceMaturityData: ComplianceDimension[] = [
  { 
    subject: 'Tone at the Top', 
    A: 85, 
    fullMark: 100,
    description: 'Comprometimento da alta liderança e cultura ética organizacional.'
  },
  { 
    subject: 'Gestão de Riscos', 
    A: 60, 
    fullMark: 100,
    description: 'Identificação, análise e mitigação de riscos regulatórios e operacionais.'
  },
  { 
    subject: 'Comunicação', 
    A: 45, 
    fullMark: 100,
    description: 'Eficácia na disseminação de políticas e treinamentos periódicos.'
  },
  { 
    subject: 'Canais de Denúncia', 
    A: 30, 
    fullMark: 100,
    description: 'Independência e segurança do canal de relatos e investigações.'
  },
  { 
    subject: 'Diligência Terceiros', 
    A: 40, 
    fullMark: 100,
    description: 'Avaliação de riscos em fornecedores, parceiros e prestadores.'
  },
  { 
    subject: 'Privacidade/LGPD', 
    A: 70, 
    fullMark: 100,
    description: 'Conformidade com a proteção de dados e privacidade de informações.'
  },
];

export const assessmentQuestions: AssessmentQuestion[] = [
  { id: 'q1', dimension: 'Tone at the Top', question: 'A diretoria participa ativamente da aprovação e revisão das políticas de ética?', weight: 1 },
  { id: 'q2', dimension: 'Tone at the Top', question: 'Existem sanções claras aplicadas a executivos que violam o código de conduta?', weight: 1 },
  { id: 'q3', dimension: 'Gestão de Riscos', question: 'A empresa possui uma matriz de riscos de compliance atualizada anualmente?', weight: 1.5 },
  { id: 'q4', dimension: 'Canais de Denúncia', question: 'O canal de denúncias é operado por uma empresa externa e independente?', weight: 2 },
  { id: 'q5', dimension: 'Diligência Terceiros', question: 'Há um processo de Due Diligence antes da contratação de fornecedores críticos?', weight: 1.5 },
  { id: 'q6', dimension: 'Comunicação', question: 'Todos os colaboradores assinam um termo de ciência do Código de Conduta no onboarding?', weight: 1 },
];

export const technicalRecommendations: TechnicalRecommendation[] = [
  {
    id: '1',
    priority: 'Alta',
    title: 'Due Diligence de Terceiros',
    description: 'A empresa não possui um processo estruturado de verificação de fornecedores críticos.',
    action: 'Implementar checklist de conformidade e auditoria em fornecedores Tier 1.'
  },
  {
    id: '2',
    priority: 'Média',
    title: 'Sistematização de Denúncias',
    description: 'O canal de denúncias atual é via e-mail, o que reduz a percepção de anonimato.',
    action: 'Migrar para uma plataforma externa e independente de relatos.'
  },
  {
    id: '3',
    priority: 'Alta',
    title: 'Reciclagem de Treinamento',
    description: 'Último treinamento de compliance ocorreu há mais de 12 meses.',
    action: 'Agendar workshop trimestral de dilemas éticos para liderança.'
  }
];

