// Unified Financial Narrative Types
import type { NarrativeContext } from './narrative-context-types';
import type { DRENarrative } from './dre-narrative-types';
import type { DFCNarrative } from './dfc-narrative-types';
import type { BPNarrative } from './bp-narrative-types';
import type { DLPANarrative } from './dlpa-narrative-types';

/** Input accepted by the UFNE pure engine. */
export interface UnifiedFinancialNarrativeInput {
  narrativeContext?: NarrativeContext;
  dreNarrative?: DRENarrative;
  dfcNarrative?: DFCNarrative;
  bpNarrative?: BPNarrative;
  dlpaNarrative?: DLPANarrative;
}

/** Result of the UFNE engine – consolidated executive narrative. */
export interface UnifiedFinancialNarrative {
  // Optional narrative fragments (only present when supplied)
  dreNarrative?: DRENarrative;
  dfcNarrative?: DFCNarrative;
  bpNarrative?: BPNarrative;
  dlpaNarrative?: DLPANarrative;
  // Executive summary collections (Portuguese language)
  keyStrengths: string[];
  keyRisks: string[];
  executiveAttentionPoints: string[];
  // Fiduciary disclaimer (fixed text, never altered)
  fiduciaryDisclaimer: string;
}
