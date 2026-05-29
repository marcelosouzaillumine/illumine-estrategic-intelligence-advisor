// src/core/runtime/publication-governance/FiduciaryDisclosureValidationEngine.ts
//
// Fiduciary Disclosure Validation Engine
// Scans narratives to verify presence of mandatory disclosures.

export class FiduciaryDisclosureValidationEngine {
  // Mapping of mandatory disclosures to their Portuguese/English validation trigger words
  private static DISCLOSURE_TRIGGERS: Record<string, string[]> = {
    'confidence limitations': ['confiança', 'confidence', 'limitações de dados'],
    'predictive limitations': ['preditiva', 'limitações preditivas', 'predictive'],
    'survivability assumptions': ['sobrevivência', 'survivability', 'premissas de sobrevivência'],
    'simulation assumptions': ['simulação', 'simulation', 'premissas de simulação', 'projeções'],
    'treasury fragility': ['tesouraria', 'treasury', 'fragilidade de tesouraria'],
    'materiality constraints': ['materialidade', 'materiality', 'limite de materialidade'],
    'artificial liquidity dependency': ['liquidez artificial', 'artificial liquidity', 'dependência de caixa'],
    'fail-closed restrictions': ['fail-closed', 'bloqueio fiduciário', 'restrições'],
    'lineage limitations': ['lineage', 'rastreabilidade', 'trilha de auditoria']
  };

  /**
   * Scans narrative texts to assert presence of mandatory disclosures.
   */
  public static validate(
    narrativeTexts: string[],
    applicableDisclosures: string[] = Object.keys(FiduciaryDisclosureValidationEngine.DISCLOSURE_TRIGGERS)
  ): { isValid: boolean; missingDisclosures: string[] } {
    const missingDisclosures: string[] = [];
    const combinedText = narrativeTexts.join(' ').toLowerCase();

    for (const key of applicableDisclosures) {
      const triggers = this.DISCLOSURE_TRIGGERS[key];
      if (!triggers) continue;

      // Assert at least one trigger word is present in the text
      const hasTrigger = triggers.some(t => combinedText.includes(t.toLowerCase()));
      if (!hasTrigger) {
        missingDisclosures.push(key);
      }
    }

    return {
      isValid: missingDisclosures.length === 0,
      missingDisclosures
    };
  }
}
