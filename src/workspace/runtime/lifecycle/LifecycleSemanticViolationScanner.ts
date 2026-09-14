// src/core/runtime/lifecycle/LifecycleSemanticViolationScanner.ts

export class LifecycleSemanticViolationScanner {
  private static forbiddenLabels = [
    'Governança Crítica',
    'Colapso Patrimonial',
    'Capital Under Collapse',
    'Weak Capital Protection',
    'High Capital Erosion',
    'Fragilidade Crônica',
    'Deterioração Histórica'
  ];

  public static scan(lifecycleStage: string, payloadText: string): void {
    if (lifecycleStage !== 'INITIAL_CAPITALIZATION') {
      return;
    }

    const lowerPayload = payloadText.toLowerCase();
    for (const term of this.forbiddenLabels) {
      if (lowerPayload.includes(term.toLowerCase())) {
        throw new Error(`EARLY_STAGE_SEMANTIC_CONTRADICTION: O termo proibido '${term}' foi detectado em ambiente de fase inicial (INITIAL_CAPITALIZATION).`);
      }
    }
  }
}
