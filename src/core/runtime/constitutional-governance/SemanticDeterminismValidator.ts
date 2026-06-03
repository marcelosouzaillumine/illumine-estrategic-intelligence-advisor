export class SemanticDeterminismValidator {
  
  private static referenceStore: Map<string, string> = new Map();

  public static validate(
    contextHash: string,
    resultHash: string,
    version: string
  ): void {
    const key = `${contextHash}_${version}`;
    const previousResult = this.referenceStore.get(key);

    if (previousResult && previousResult !== resultHash) {
      throw new Error(`[SEMANTIC_DRIFT_DETECTED] CRITICAL: Mesmo contexto e mesma versão geraram resultados semânticos divergentes.`);
    }

    this.referenceStore.set(key, resultHash);
  }

  // Used for testing isolation
  public static clearStore(): void {
    this.referenceStore.clear();
  }
}
