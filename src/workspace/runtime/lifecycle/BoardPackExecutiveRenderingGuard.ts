export class BoardPackExecutiveRenderingGuard {
  public static validate(semanticSource: string, renderedContent: string): void {
    if (semanticSource !== 'ELSA') return;

    const blockedTerms = [
      'WEAK CAPITAL PROTECTION',
      'HIGH CAPITAL EROSION',
      'CAPITAL UNDER COLLAPSE',
      'Governança Crítica',
      'LEGACY'
    ];

    const normalizedContent = renderedContent.toUpperCase();

    for (const term of blockedTerms) {
      if (normalizedContent.includes(term.toUpperCase())) {
        throw new Error(`[BOARD_PACK_EXECUTIVE_LEGACY_LABEL_LEAK] CRITICAL: Rendered legacy label "${term}" detected in Board Pack while semanticSource is ELSA.`);
      }
    }
  }
}
