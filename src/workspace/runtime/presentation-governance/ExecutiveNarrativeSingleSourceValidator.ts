/**
 * ExecutiveNarrativeSingleSourceValidator
 * 
 * ENGF v1.1 — Guarantees the DRE has exactly one official executive narrative.
 * 
 * Rule: DRE.executiveNarrativeCount === 1
 * Official narrative: Executive Advisory (DREBoardAdvisoryEngine)
 * 
 * Prohibited narratives in DRE executive layer:
 * - "Síntese Executiva para Tomada de Decisão" (legacy)
 * - "Insira aqui as observações críticas" (placeholder)
 * - "Sumário de Conselho" (superseded)
 * - Manual/free-text fields without runtime governance
 */

export interface NarrativeSourceAudit {
  isCompliant: boolean;
  officiaNarrativePresent: boolean;
  legacyNarrativesDetected: string[];
  placeholdersDetected: string[];
  recommendations: string[];
}

const LEGACY_NARRATIVE_SIGNATURES = [
  'Síntese Executiva para Tomada de Decisão',
  'Parecer analítico fiduciário para o Conselho',
  'Sumário de Conselho',
  'Insira aqui as observações críticas',
  'Incluir Parecer',
  'Personalizar Parecer',
  'Salvar Parecer',
];

const PLACEHOLDER_SIGNATURES = [
  'Insira aqui',
  'Aguardando dados estruturais',
  'Dados insuficientes para análise',
  'Em breve',
  'placeholder',
  'dummy',
  'TODO',
  'N/A',
];

const OFFICIAL_NARRATIVE_SIGNATURES = [
  'Executive Advisory',
  'Situação Atual',
  'Principal Restrição',
  'Principal Oportunidade',
  'Prioridade Estratégica',
  'Outlook',
];

export class ExecutiveNarrativeSingleSourceValidator {
  /**
   * Validates that a rendered DRE page has exactly one narrative source.
   * @param renderedContent — string representation of the rendered executive layer
   */
  public static validate(renderedContent: string): NarrativeSourceAudit {
    const legacyNarrativesDetected = LEGACY_NARRATIVE_SIGNATURES.filter(sig =>
      renderedContent.includes(sig)
    );

    const placeholdersDetected = PLACEHOLDER_SIGNATURES.filter(sig =>
      renderedContent.toLowerCase().includes(sig.toLowerCase())
    );

    const officiaNarrativePresent = OFFICIAL_NARRATIVE_SIGNATURES.some(sig =>
      renderedContent.includes(sig)
    );

    const isCompliant =
      legacyNarrativesDetected.length === 0 &&
      placeholdersDetected.length === 0 &&
      officiaNarrativePresent;

    const recommendations: string[] = [];
    if (!officiaNarrativePresent) {
      recommendations.push('Executive Advisory block (ENGF) not detected. Ensure dreExecutiveAdvisoryFull is propagated from runtime.');
    }
    legacyNarrativesDetected.forEach(sig => {
      recommendations.push(`Legacy narrative detected: "${sig}". Remove from DREPage.tsx — superseded by Executive Advisory.`);
    });
    placeholdersDetected.forEach(sig => {
      recommendations.push(`Placeholder detected: "${sig}". Replace with runtime-governed content.`);
    });

    return {
      isCompliant,
      officiaNarrativePresent,
      legacyNarrativesDetected,
      placeholdersDetected,
      recommendations,
    };
  }

  /**
   * Asserts single-source compliance. Throws if not compliant (for use in CI).
   */
  public static assert(renderedContent: string): void {
    const audit = this.validate(renderedContent);
    if (!audit.isCompliant) {
      throw new Error(
        `ExecutiveNarrativeSingleSourceValidator: DRE narrative is NOT compliant.\n` +
        audit.recommendations.map(r => `  - ${r}`).join('\n')
      );
    }
  }
}
