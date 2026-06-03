export class DLPALegacyLabelScanner {
  private static FORBIDDEN_LABELS = [
    'WEAK CAPITAL PROTECTION',
    'HIGH CAPITAL EROSION',
    'CAPITAL UNDER COLLAPSE',
    'GOVERNANÇA CRÍTICA',
    'LEGACY'
  ];

  public static scanRenderedLabels(semanticSource: string, labels: string[]): void {
    if (semanticSource !== 'ELSA') return;

    for (const label of labels) {
      if (!label) continue;
      
      const normalizedLabel = label.toUpperCase().trim();
      
      for (const forbidden of this.FORBIDDEN_LABELS) {
        if (normalizedLabel === forbidden || normalizedLabel.includes(forbidden)) {
          console.error(`[DLPA_EXECUTIVE_LEGACY_LABEL_LEAK] CRITICAL: Rendered legacy label "${label}" while semanticSource is ELSA.`);
          // Emitting exception depending on the framework, for now throwing an error
          throw new Error(`DLPA_EXECUTIVE_LEGACY_LABEL_LEAK: ${label}`);
        }
      }
    }
  }
}
