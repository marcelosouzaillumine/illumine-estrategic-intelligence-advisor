/**
 * Architecture Governance Center™ (AGC)
 * Maturity Model Definition
 */

export enum AGCMaturityLevel {
  LEVEL_0_NO_GOVERNANCE = 'LEVEL_0_NO_GOVERNANCE',
  LEVEL_1_DISCOVERY = 'LEVEL_1_DISCOVERY',
  LEVEL_2_MEASUREMENT = 'LEVEL_2_MEASUREMENT',
  LEVEL_3_CERTIFICATION = 'LEVEL_3_CERTIFICATION',
  LEVEL_4_INTELLIGENCE = 'LEVEL_4_INTELLIGENCE',
  LEVEL_5_ADVISORY = 'LEVEL_5_ADVISORY',
  LEVEL_6_RISK = 'LEVEL_6_RISK',
  LEVEL_7_DECISION = 'LEVEL_7_DECISION',
  LEVEL_8_KNOWLEDGE = 'LEVEL_8_KNOWLEDGE',
  LEVEL_9_MEMORY = 'LEVEL_9_MEMORY',
  LEVEL_10_STRATEGIC = 'LEVEL_10_STRATEGIC',
  LEVEL_11_EXECUTIVE = 'LEVEL_11_EXECUTIVE',
  LEVEL_12_LEARNING = 'LEVEL_12_LEARNING'
}

export interface MaturityLevelDefinition {
  level: AGCMaturityLevel;
  name: string;
  capabilities: readonly string[];
  description: string;
  status?: string;
}

export const AGC_MATURITY_MODEL: readonly MaturityLevelDefinition[] = [
  {
    level: AGCMaturityLevel.LEVEL_0_NO_GOVERNANCE,
    name: 'No Architectural Awareness',
    capabilities: ['código sem mapa'],
    description: 'Nível onde o sistema existe como base de código, mas sem nenhuma ferramenta para auto-observação.',
    status: 'SUPERADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_1_DISCOVERY,
    name: 'Architecture Discovery',
    capabilities: ['descobrir artefatos', 'rastrear módulos'],
    description: 'Capacidade de inspecionar a própria base de código e listar componentes.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_2_MEASUREMENT,
    name: 'Architecture Measurement',
    capabilities: ['compreender relações', 'gerar métricas estruturais'],
    description: 'Transformação dos dados descobertos num Knowledge Graph observável com métricas.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_3_CERTIFICATION,
    name: 'Architecture Certification',
    capabilities: ['avaliar políticas', 'certificar conformidade', 'provar reprodutibilidade histórica'],
    description: 'Onde o AGC emite decisões determinísticas auditáveis baseadas em fatos.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_4_INTELLIGENCE,
    name: 'Architecture Intelligence',
    capabilities: ['Evolution Tracking', 'Historical Audit', 'Time-Travel Governance', 'Structural Analytics'],
    description: 'Camada de accountability histórico e inteligência analítica de trajetória.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_5_ADVISORY,
    name: 'Architecture Advisory Foundation',
    capabilities: ['Architecture Signals', 'Pattern Classification', 'Architecture Narrative', 'Advisory Evidence Graph'],
    description: 'A plataforma oferece compreensão contextual baseada em evidências estruturais sem emitir julgamento de risco ou prescrição.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_6_RISK,
    name: 'Architecture Risk Intelligence',
    capabilities: ['Exposure Index', 'Risk Assessment', 'Risk Signals', 'Risk Policy Catalog'],
    description: 'A plataforma transforma sinais contextuais neutros em quantificações formais de exposição arquitetural baseadas em políticas declarativas.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_7_DECISION,
    name: 'Architecture Decision Intelligence',
    capabilities: ['Decision Board', 'Architecture Memory', 'Immutable Context Hash', 'Formal Outcomes'],
    description: 'A plataforma delibera fatos formalmente como um Architecture Review Board não-intervencionista, preparando a decisão.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_8_KNOWLEDGE,
    name: 'Architecture Knowledge Intelligence',
    capabilities: ['Knowledge Graph', 'Decision Explainability', 'Constitution Reference', 'Decision Lineage', 'Architecture Canon'],
    description: 'Consolida a ontologia completa da arquitetura do Illumine OS em um grafo semântico interconectado. Transforma governança em patrimônio histórico.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_9_MEMORY,
    name: 'Institutional Architecture Memory',
    capabilities: ['Architecture Memory Engine', 'Canonical Authority Layer', 'Institutional Learning Record', 'Knowledge Lineage'],
    description: 'A organização não apenas conhece sua arquitetura; ela aprende historicamente com suas próprias decisões. Consolidação de governança retrospectiva verdadeira.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_10_STRATEGIC,
    name: 'Strategic Architecture Intelligence',
    capabilities: ['Recommendation Engine', 'Alternative Generation', 'Scenario Evaluation', 'Strategic Support'],
    description: 'A organização transforma memória arquitetural em alternativas estratégicas fundamentadas, atuando como conselheiro estrutural (Decision Support).',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_11_EXECUTIVE,
    name: 'Executive Decision Intelligence',
    capabilities: ['Decision Context Engine', 'Decision Brief Generator', 'Institutional Decision Memory'],
    description: 'A organização transforma inteligência contextual em decisões governadas, acompanhadas por evidências, resultados esperados e aprendizado institucional contínuo.',
    status: 'IMPLEMENTADO'
  },
  {
    level: AGCMaturityLevel.LEVEL_12_LEARNING,
    name: 'Institutional Learning Intelligence',
    capabilities: ['Strategic Self-Correction', 'Adaptive Governance', 'Institutional Reflex'],
    description: 'A organização aprende sistematicamente com suas decisões históricas, aprimorando continuamente seus modelos estratégicos e sua capacidade adaptativa.',
    status: 'IMPLEMENTADO'
  }
];
