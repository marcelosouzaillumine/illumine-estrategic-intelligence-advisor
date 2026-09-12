import { sha256 } from '../executive/types';
import { ConstitutionalSemanticAuthorityRegistry } from './ConstitutionalSemanticAuthorityRegistry';

export interface SemanticLineagePayload {
  authority: string;
  semanticProtocolVersion: string;
  lifecycleStage: string;
  resolvedLabels: string[];
  foundationYear: number | null;
  analysisYear: number | null;
}

export class SemanticLineageReport {
  public static generateHash(payload: SemanticLineagePayload): string {
    // 1. Sort labels to guarantee determinism
    const sortedLabels = [...payload.resolvedLabels].sort();

    // 2. Create the deterministic hash payload without timestamp
    const deterministicData = {
      authority: payload.authority,
      semanticProtocolVersion: payload.semanticProtocolVersion,
      lifecycleStage: payload.lifecycleStage,
      resolvedLabels: sortedLabels,
      foundationYear: payload.foundationYear,
      analysisYear: payload.analysisYear
    };

    const hash = sha256(JSON.stringify(deterministicData));

    return hash.substring(0, 16);
  }
}
