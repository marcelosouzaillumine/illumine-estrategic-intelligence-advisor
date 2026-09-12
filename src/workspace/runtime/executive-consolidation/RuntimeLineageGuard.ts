export class RuntimeLineageGuard {
  /**
   * Validates that a payload contains a deterministic `lineageHash`.
   * In `test`/`ci` environments it throws on failure; in `development`
   * it logs a debug warning; in `production` it is a no‑op.
   */
  static validate(payload: { lineageHash?: string }): void {
    const env = process.env.NODE_ENV ?? 'development';
    if (!payload.lineageHash) {
      const msg = 'RuntimeLineageGuard: missing lineageHash';
      if (env === 'test' || env === 'ci') {
        throw new Error(msg);
      }
      if (env === 'development') {
        console.debug('[DEBUG] ' + msg);
      }
      // production: silent
    }
  }
}
