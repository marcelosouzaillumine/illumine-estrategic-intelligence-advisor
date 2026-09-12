import { ExecutiveNarrative, ExecutiveNarrativeData, NarrativeHasher } from './types';

export class ExecutiveNarrativePolicy {
  /**
   * Seals a narrative into an immutable state.
   */
  static sealNarrative(data: ExecutiveNarrativeData): ExecutiveNarrative {
    if (!data.sourceRuntime) throw new Error('MISSING_RUNTIME: Narrative must be runtime-backed.');
    if (!data.lineage || data.lineage.length === 0) throw new Error('MISSING_LINEAGE: Narrative must have a causal lineage.');
    if (!data.confidence) throw new Error('MISSING_CONFIDENCE: Narrative must declare confidence level.');
    if (!data.evidenceChain || data.evidenceChain.length === 0) throw new Error('MISSING_EVIDENCE: Narrative must have an evidence chain.');

    const hashes = NarrativeHasher.generateHashes(data);

    const sealed: ExecutiveNarrative = {
      ...data,
      ...hashes
    };

    return Object.freeze(sealed) as ExecutiveNarrative;
  }

  /**
   * Validates if the narrative hasn't been tampered with.
   */
  static verifyIntegrity(narrative: ExecutiveNarrative): boolean {
    const { narrativeHash, lineageHash, evidenceHash, ...data } = narrative;
    const computedHashes = NarrativeHasher.generateHashes(data as ExecutiveNarrativeData);
    
    return computedHashes.narrativeHash === narrativeHash && 
           computedHashes.lineageHash === lineageHash && 
           computedHashes.evidenceHash === evidenceHash;
  }
}
