import { ExecutiveSession } from '../runtime/ExecutiveSession';

export class DataNormalizer {
  public async process(session: ExecutiveSession, rawData: any): Promise<any> {
    // Stub: In the future, cleans lexical and typographic issues.
    // E.g., 'LIQ_CORR' -> 'CURRENT_RATIO'
    return { ...rawData, normalized: true };
  }
}
