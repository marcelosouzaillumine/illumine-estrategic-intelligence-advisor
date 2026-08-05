import { EvidenceLocator } from './EvidenceLocator';
import { EvidenceProvenance } from './EvidenceProvenance';

export interface EvidenceReference {
  referenceId: string;
  excerpt?: string; // Verbatim snippet extracted
  summary?: string; // Synthesized meaning of the evidence
  provenance: EvidenceProvenance;
  locator?: EvidenceLocator; // Optional precise technical location
}
