export enum ExecutiveDomain {
  BP = 'BP',
  DRE = 'DRE',
  DFC = 'DFC',
  BOARD = 'BOARD'
}

export interface DomainValidationResult {
  isValid: boolean;
  reason?: string;
}

export class ExecutiveDomainSegregationEngine {
  /**
   * Valida se um tópico ou insight é permitido para o domínio fiduciário em questão.
   */
  public static validate(domain: ExecutiveDomain, topic: string): DomainValidationResult {
    const topicLower = topic.toLowerCase();

    // Regras de proibição estrita de cruzamento de domínios fiduciários
    const prohibitedPatterns: Record<ExecutiveDomain, string[]> = {
      [ExecutiveDomain.DRE]: [
        'liquidez',
        'cobertura de caixa',
        'pressão de passivo',
        'passivo circulante',
        'dependência bancária',
        'capital de giro',
        'alavancagem',
        'solvência'
      ],
      [ExecutiveDomain.BP]: [
        'pricing',
        'eficiência operacional',
        'unit economics',
        'escalabilidade comercial',
        'absorção de overhead',
        'margem de contribuição'
      ],
      [ExecutiveDomain.DFC]: [
        'margem bruta',
        'eficiência comercial',
        'custo operacional unitário',
        'unit economics'
      ],
      [ExecutiveDomain.BOARD]: [
        // O Board não pode ter replicação de frases cruas dos outros domínios
        // Este filtro atua para barrar jargões exclusivamente técnicos que deviam ter ficado nas camadas inferiores.
        // No entanto, o Board pode sintetizar. A regra de não copiar frase será tratada também no orquestrador.
      ]
    };

    const prohibited = prohibitedPatterns[domain];
    
    for (const pattern of prohibited) {
      if (topicLower.includes(pattern)) {
        return {
          isValid: false,
          reason: `Vazamento fiduciário detectado: o tópico "${pattern}" é proibido no domínio ${domain}.`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Filtra uma lista de ações ou insights, removendo tudo que não pertence ao domínio atual.
   */
  public static filterActionsByDomain(domain: ExecutiveDomain, actions: string[]): string[] {
    return actions.filter(action => this.validate(domain, action).isValid);
  }
}
