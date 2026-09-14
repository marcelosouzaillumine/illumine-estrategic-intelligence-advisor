export class LineageService {
  /**
   * Deterministic hash for any JSON‑serializable payload.
   * Simple 32‑bit integer hash to keep it deterministic across runs.
   */
  static createHash(payload: any): string {
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const chr = raw.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32‑bit integer
    }
    return 'lineage_' + Math.abs(hash).toString(16);
  }
}
