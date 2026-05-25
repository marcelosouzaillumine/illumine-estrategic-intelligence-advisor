export class ScenarioCacheProtector {
  /**
   * Garante que um cenário jamais reaproveite a referência de memória de outro.
   * Clonagem profunda garantida sem invocar dependências.
   */
  static protectSnapshot<T>(payload: T): T {
    // Zero-dependency deep clone
    return JSON.parse(JSON.stringify(payload));
  }
}
