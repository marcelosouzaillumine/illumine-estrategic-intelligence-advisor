export enum ExecutiveProductType {
  /**
   * Explica a realidade, identifica sinais e apresenta evidências.
   * Não possui decisão ativa ou aprovação.
   */
  INTELLIGENCE_PRODUCT = 'INTELLIGENCE_PRODUCT',

  /**
   * Fornece mentoria, avalia políticas e orienta a formulação de estratégias.
   * Aponta direções mas não prescreve o plano imutável.
   */
  ADVISORY_PRODUCT = 'ADVISORY_PRODUCT',

  /**
   * Apresenta cenários, compara alternativas, registra deliberação 
   * e armazena o histórico da decisão humana.
   */
  DECISION_PRODUCT = 'DECISION_PRODUCT'
}

export type AdvisoryLevel = 'NONE' | 'DIAGNOSTIC' | 'GUIDANCE' | 'RECOMMENDATION';
