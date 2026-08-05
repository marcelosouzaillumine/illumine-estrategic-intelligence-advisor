export enum DisclosureLevel {
  PUBLIC_ALLOWED = 'PUBLIC_ALLOWED',
  RESTRICTED = 'RESTRICTED',
  PROPRIETARY = 'PROPRIETARY'
}

export const DisclosureRules = {
  // O que pode ser dito
  ALLOWED_TOPICS: [
    'posicionamento',
    'benefícios',
    'domínios de atuação',
    'problemas resolvidos',
    'visão geral da plataforma',
    'o que fazemos',
    'por que fazemos',
    'como ajudamos'
  ],

  // O que NÃO pode ser dito
  RESTRICTED_TOPICS: [
    'pesos de modelos',
    'regras de scoring',
    'frameworks internos',
    'lógica dos engines',
    'arquitetura cognitiva',
    'prompts',
    'critérios de decisão',
    'como construímos',
    'como calculamos',
    'quais regras internas usamos',
    'como funciona nossa arquitetura'
  ]
};

/**
 * Verifica se um tema pode ser abordado pelo Concierge
 */
export function validateDisclosure(topic: string): DisclosureLevel {
  if (DisclosureRules.RESTRICTED_TOPICS.some(restricted => topic.toLowerCase().includes(restricted))) {
    return DisclosureLevel.PROPRIETARY;
  }
  return DisclosureLevel.PUBLIC_ALLOWED;
}
