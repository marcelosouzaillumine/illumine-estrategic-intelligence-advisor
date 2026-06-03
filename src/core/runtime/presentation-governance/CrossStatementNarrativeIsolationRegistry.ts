/**
 * CrossStatementNarrativeIsolationRegistry
 * 
 * DEGFF v1.1 — Blocks DRE from containing concepts that belong to DFC/BP.
 * 
 * Allowed concepts in DRE: receita, margem, rentabilidade, absorção, escala, break-even, resultado, geração/destruição de valor.
 * Prohibited concepts in DRE: liquidez, caixa, runway, capital de giro, endividamento, dependência de capital externo, financiamento, tesouraria.
 */

export class CrossStatementNarrativeIsolationRegistry {
  private static readonly PROHIBITED_DRE_TERMS = [
    'liquidez',
    'caixa',
    'runway',
    'capital de giro',
    'endividamento',
    'dependência de capital externo',
    'dependerá de capital externo',
    'financiamento',
    'tesouraria',
    'burn rate de caixa',
    'sobrevivência financeira'
  ];

  public static validate(narrative: string): { isCompliant: boolean; violations: string[] } {
    const textLower = narrative.toLowerCase();
    const violations = this.PROHIBITED_DRE_TERMS.filter(term => textLower.includes(term));
    
    return {
      isCompliant: violations.length === 0,
      violations
    };
  }

  public static assertCompliant(narrative: string, context: string = 'DRE Narrative'): void {
    const { isCompliant, violations } = this.validate(narrative);
    if (!isCompliant) {
      throw new Error(`[CrossStatementNarrativeIsolationRegistry] ${context} contains prohibited cash/liquidity terms: ${violations.join(', ')}`);
    }
  }
}
