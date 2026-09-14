export class ExecutiveDisclosureResolver {
  private static readonly DISCLOSURE_MAP: Record<string, string> = {
    'DISCLOSURE_RUNWAY_FRAGILITY': 'Horizonte financeiro reduzido e necessidade de preservação de caixa.',
    'DISCLOSURE_REINVESTMENT_UNCERTAINTY': 'O retorno esperado das operações apresenta incertezas relevantes sob contextos de estresse econômico.',
    'DISCLOSURE_STRESS_ASSUMPTIONS': 'A estrutura financeira demonstra sensibilidade elevada a choques simultâneos de margem e recebimento.',
    'DISCLOSURE_SURVIVAL_ACTIVE': 'Modo de sobrevivência institucional ativo. Proteção de capital e reestruturação são prioridades máximas.',
    'DISCLOSURE_RECOVERY_ACTIVE': 'A organização encontra-se em estágio de recuperação financeira, exigindo controle estrito sobre expansão.',
    'DISCLOSURE_NO_DFC': 'A qualidade da liquidez não pôde ser validada devido à ausência de evidência confiável de fluxo de caixa.',
    'DISCLOSURE_OPERATIONAL_BURN': 'A operação atual consome caixa de forma estrutural, gerando dependência de capital externo.',
    'DISCLOSURE_LEVERAGE_RISK': 'O nível de alavancagem atual restringe a flexibilidade estratégica da organização.',
    'QUALIDADE DO CAIXA NÃO VERIFICÁVEL': 'A qualidade da liquidez não pôde ser validada devido à ausência de evidência confiável de fluxo de caixa.'
  };

  public static resolve(disclosureIdOrMessage: string): string {
    if (!disclosureIdOrMessage) return '';
    
    // Check if it's an exact ID match
    const cleanKey = disclosureIdOrMessage.trim().toUpperCase();
    if (this.DISCLOSURE_MAP[cleanKey]) {
      return this.DISCLOSURE_MAP[cleanKey];
    }
    if (this.DISCLOSURE_MAP[disclosureIdOrMessage.trim()]) {
      return this.DISCLOSURE_MAP[disclosureIdOrMessage.trim()];
    }

    // Attempt partial match for long predefined strings (like "QUALIDADE DO CAIXA NÃO VERIFICÁVEL...")
    for (const [key, value] of Object.entries(this.DISCLOSURE_MAP)) {
      if (disclosureIdOrMessage.includes(key)) {
        return value;
      }
    }

    // Fallback to the original message if no mapping exists
    return disclosureIdOrMessage;
  }
}
